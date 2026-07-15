import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, logout, register, getUserProfile } from '../api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user info in localStorage
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        setUserInfo(JSON.parse(savedUserInfo));
      } catch (error) {
        console.error('Error parsing user info from localStorage:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const data = await login(email, password);
      setUserInfo(data);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const data = await register(
        userData.name,
        userData.email,
        userData.password,
        userData.phone,
        userData.address
      );
      setUserInfo(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
    setUserInfo(null);
    toast.success('Logged out successfully');
  };

  const loadUserProfile = async () => {
    if (!userInfo) return null;

    try {
      setLoading(true);
      const data = await getUserProfile();
      return data;
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load profile. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userInfo,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    loadUserProfile,
    isAuthenticated: !!userInfo,
    isAdmin: userInfo?.isAdmin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};