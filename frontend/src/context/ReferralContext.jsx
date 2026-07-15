import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getMyReferralCode,
  getReferralStats,
  generateReferralCode,
  validateReferralCode,
  requestReferralPayout
} from '../api';

const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  const { userInfo, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hostInfo, setHostInfo] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [referralStats, setReferralStats] = useState(null);
  const [appliedReferralCode, setAppliedReferralCode] = useState(
    localStorage.getItem('kitchenluxReferralCode') || null
  );
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [isReferralCodeValid, setIsReferralCodeValid] = useState(false);

  // Fetch referral code for host
  const fetchReferralCode = async () => {
    if (!isAuthenticated || !userInfo.isHost) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getMyReferralCode();
      setReferralCode(data);
    } catch (err) {
      console.error('Error fetching referral code:', err);
      // Only set error if it's not a "no code found" error
      if (err.response?.status !== 404) {
        setError(err.message || 'Failed to fetch referral code');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch referral statistics for host
  const fetchReferralStats = async () => {
    if (!isAuthenticated || !userInfo.isHost) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getReferralStats();
      setReferralStats(data);
    } catch (err) {
      console.error('Error fetching referral stats:', err);
      setError(err.message || 'Failed to fetch referral statistics');
    } finally {
      setLoading(false);
    }
  };

  // Generate a new referral code
  const generateNewReferralCode = async () => {
    if (!isAuthenticated || !userInfo.isHost) return;

    setLoading(true);
    setError(null);

    try {
      const data = await generateReferralCode();
      setReferralCode(data);
      return data;
    } catch (err) {
      console.error('Error generating referral code:', err);
      setError(err.message || 'Failed to generate referral code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Apply a referral code
  const applyReferralCode = async (code) => {
    setLoading(true);
    setError(null);

    try {
      const data = await validateReferralCode(code);

      if (data.valid) {
        setAppliedReferralCode(code);
        setReferralDiscount(data.discountPercentage);
        setIsReferralCodeValid(true);
        localStorage.setItem('kitchenluxReferralCode', code);
        return true;
      } else {
        setIsReferralCodeValid(false);
        setError('Invalid referral code');
        return false;
      }
    } catch (err) {
      console.error('Error validating referral code:', err);
      setError(err.message || 'Invalid referral code');
      setIsReferralCodeValid(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove applied referral code
  const removeReferralCode = () => {
    setAppliedReferralCode(null);
    setReferralDiscount(0);
    setIsReferralCodeValid(false);
    localStorage.removeItem('kitchenluxReferralCode');
  };

  // Request a payout
  const requestPayout = async (paymentMethod) => {
    if (!isAuthenticated || !userInfo.isHost) return;

    setLoading(true);
    setError(null);

    try {
      const data = await requestReferralPayout(paymentMethod);
      // Refresh stats after payout request
      await fetchReferralStats();
      return data;
    } catch (err) {
      console.error('Error requesting payout:', err);
      setError(err.message || 'Failed to request payout');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Effect to load referral information when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userInfo?.isHost) {
      fetchReferralCode();
      fetchReferralStats();
    }
  }, [isAuthenticated, userInfo]);

  // Effect to validate stored referral code on load
  useEffect(() => {
    const validateStoredCode = async () => {
      const storedCode = localStorage.getItem('kitchenluxReferralCode');
      if (storedCode) {
        await applyReferralCode(storedCode);
      }
    };

    validateStoredCode();
  }, []);

  const value = {
    loading,
    error,
    hostInfo,
    referralCode,
    referralStats,
    appliedReferralCode,
    referralDiscount,
    isReferralCodeValid,
    fetchReferralCode,
    fetchReferralStats,
    generateNewReferralCode,
    applyReferralCode,
    removeReferralCode,
    requestPayout,
  };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

export default ReferralContext;