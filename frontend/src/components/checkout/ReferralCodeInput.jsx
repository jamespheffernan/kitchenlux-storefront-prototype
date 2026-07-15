import React, { useState, useEffect } from 'react';
import { useReferral } from '../../context/ReferralContext';
import './ReferralCodeInput.css';

const ReferralCodeInput = ({ onDiscount }) => {
  const {
    loading,
    error,
    appliedReferralCode,
    referralDiscount,
    isReferralCodeValid,
    applyReferralCode,
    removeReferralCode,
  } = useReferral();

  const [code, setCode] = useState('');
  const [showInput, setShowInput] = useState(!appliedReferralCode);

  // Callback to parent component when discount changes
  useEffect(() => {
    if (onDiscount && typeof onDiscount === 'function') {
      onDiscount(referralDiscount);
    }
  }, [referralDiscount, onDiscount]);

  // Initialize code from applied code
  useEffect(() => {
    if (appliedReferralCode) {
      setCode(appliedReferralCode);
    }
  }, [appliedReferralCode]);

  const handleApplyCode = async (e) => {
    e.preventDefault();

    if (!code.trim()) return;

    const success = await applyReferralCode(code.trim());
    if (success) {
      setShowInput(false);
    }
  };

  const handleRemoveCode = () => {
    removeReferralCode();
    setCode('');
    setShowInput(true);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  return (
    <div className="referral-code-section">
      {!showInput && isReferralCodeValid ? (
        <div className="applied-code">
          <div className="code-info">
            <span className="code-label">Referral code applied:</span>
            <span className="code-value">{appliedReferralCode}</span>
            <span className="discount-value">
              (-{referralDiscount}% discount)
            </span>
          </div>
          <button
            type="button"
            className="remove-code-btn"
            onClick={handleRemoveCode}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="add-code-container">
          {showInput ? (
            <form onSubmit={handleApplyCode} className="code-form">
              <div className="form-row">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter referral code"
                  className="code-input"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="apply-btn"
                  disabled={!code.trim() || loading}
                >
                  {loading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          ) : (
            <button
              type="button"
              className="toggle-input-btn"
              onClick={toggleInput}
            >
              Have a referral code?
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralCodeInput;