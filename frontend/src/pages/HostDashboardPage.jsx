import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReferral } from '../context/ReferralContext';
import { toast } from 'react-toastify';
import { getContentImageUrl } from '../utils/imageUtils';
import './ProfilePage.css'; // Reuse existing profile styles
import './admin/AdminStyles.css'; // For dashboard-like elements
import './HostDashboard.css'; // Host-specific styles (we'll create this after)

// Chart component for visualizing earnings
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const HostDashboardPage = () => {
  const storefrontURL = import.meta.env.VITE_STOREFRONT_URL || window.location.origin;
  const {
    loading,
    error,
    referralCode,
    referralStats,
    generateNewReferralCode,
    requestPayout,
    fetchReferralStats,
  } = useReferral();

  const [payoutMethod, setPayoutMethod] = useState('creditToAccount');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Function to copy referral code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Referral code copied to clipboard!');
      },
      () => {
        toast.error('Failed to copy code. Please try again.');
      }
    );
  };

  // Function to generate a new referral code
  const handleGenerateCode = async () => {
    try {
      const result = await generateNewReferralCode();
      if (result) {
        toast.success('New referral code generated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate referral code');
    }
  };

  // Function to handle payout request
  const handlePayoutRequest = async () => {
    try {
      const result = await requestPayout(payoutMethod);
      if (result) {
        toast.success('Payout request submitted successfully!');
        setShowPayoutModal(false);
        // Refresh stats to show updated pending amount
        await fetchReferralStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to request payout');
    }
  };

  // Generate download URL for listing card image
  const getListingCardURL = () => {
    if (!referralCode) return null;

    return getContentImageUrl('referral-card');
  };

  // Generate QR code URL (using an API service)
  const getQRCodeURL = () => {
    if (!referralCode) return null;

    return getContentImageUrl('qr-preview');
  };

  return (
    <div className="profile-container host-dashboard">
      <div className="dashboard-header">
        <h1>Host Dashboard</h1>
        <p>Manage your vacation rental referrals and earnings</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-grid">
        {/* Referral Code Section */}
        <div className="dashboard-card referral-code-card">
          <h2>Your Referral Code</h2>

          {loading ? (
            <div className="loader"></div>
          ) : referralCode ? (
            <div className="referral-code-container">
              <div className="referral-code">
                <span className="code">{referralCode.code}</span>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(referralCode.code)}
                >
                  Copy
                </button>
              </div>
              <p className="code-info">
                Share this code with your vacation rental guests for 10% off their first rental.
                You'll earn 15% commission on each order!
              </p>
              <div className="referral-link">
                <span className="link-label">Your referral link:</span>
                <span className="link">
                  {storefrontURL}?ref={referralCode.code}
                </span>
                <button
                  className="copy-btn"
                  onClick={() =>
                    copyToClipboard(`${storefrontURL}?ref=${referralCode.code}`)
                  }
                >
                  Copy
                </button>
              </div>
              <p className="expiry">
                Expires: {new Date(referralCode.expiresAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="no-code">
              <p>You don't have an active referral code yet.</p>
              <button
                className="btn"
                onClick={handleGenerateCode}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Referral Code'}
              </button>
            </div>
          )}
        </div>

        {/* Stats Overview Section */}
        <div className="dashboard-card stats-card">
          <h2>Earnings Overview</h2>

          {loading ? (
            <div className="loader"></div>
          ) : referralStats ? (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">
                  ${referralStats.totalEarnings.toFixed(2)}
                </span>
                <span className="stat-label">Total Earned</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  ${referralStats.pendingPayout.toFixed(2)}
                </span>
                <span className="stat-label">Available for Payout</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {referralStats.totalUsage}
                </span>
                <span className="stat-label">Total Referrals</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  ${referralStats.totalPaidOut.toFixed(2)}
                </span>
                <span className="stat-label">Total Paid Out</span>
              </div>
            </div>
          ) : (
            <p>No earnings data available yet.</p>
          )}

          {referralStats && referralStats.pendingPayout > 0 && (
            <button
              className="btn payout-btn"
              onClick={() => setShowPayoutModal(true)}
            >
              Request Payout
            </button>
          )}
        </div>

        {/* Earnings Chart */}
        <div className="dashboard-card chart-card">
          <h2>Monthly Earnings</h2>

          {loading ? (
            <div className="loader"></div>
          ) : referralStats && referralStats.monthlyEarnings ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={referralStats.monthlyEarnings}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                  <Legend />
                  <Bar dataKey="earnings" fill="#4CAF50" name="Earnings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>No earnings data available yet for visualization.</p>
          )}
        </div>

        {/* Recent Referrals */}
        <div className="dashboard-card recent-referrals-card">
          <h2>Recent Referrals</h2>

          {loading ? (
            <div className="loader"></div>
          ) : referralStats && referralStats.recentReferrals &&
              referralStats.recentReferrals.length > 0 ? (
            <div className="table-responsive">
              <table className="referrals-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order Amount</th>
                    <th>Your Commission</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referralStats.recentReferrals.map((referral, index) => (
                    <tr key={index}>
                      <td>{new Date(referral.date).toLocaleDateString()}</td>
                      <td>${referral.orderAmount.toFixed(2)}</td>
                      <td>${referral.commission.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${referral.orderStatus}`}>
                          {referral.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No referrals have been made yet.</p>
          )}
        </div>

        {/* Marketing Materials */}
        <div className="dashboard-card marketing-card">
          <h2>Marketing Materials</h2>

          {loading ? (
            <div className="loader"></div>
          ) : referralCode ? (
            <div className="marketing-materials">
              <div className="material-item">
                <h3>Listing Card</h3>
                <div className="material-preview">
                  <img
                    src={getListingCardURL()}
                    alt="Listing card with referral code"
                    className="listing-card-img"
                  />
                </div>
                <a
                  href={getListingCardURL()}
                  download={`kitchenlux-referral-${referralCode.code}.jpg`}
                  className="btn btn-sm"
                >
                  Download
                </a>
              </div>

              <div className="material-item">
                <h3>QR Code</h3>
                <div className="material-preview">
                  <img
                    src={getQRCodeURL()}
                    alt="QR code for referral link"
                    className="qr-code-img"
                  />
                </div>
                <a
                  href={getQRCodeURL()}
                  download={`kitchenlux-qr-${referralCode.code}.png`}
                  className="btn btn-sm"
                >
                  Download
                </a>
              </div>

              <div className="material-item">
                <h3>Email Template</h3>
                <div className="material-preview text-preview">
                  <p>
                    Dear Guest,<br /><br />
                    Thank you for choosing to stay at my vacation rental! To enhance your
                    experience, I've partnered with KitchenLux to offer you premium kitchenware
                    during your stay.<br /><br />
                    Use my code <strong>{referralCode.code}</strong> for 10% off your order!<br /><br />
                    Visit: {storefrontURL}?ref={referralCode.code}
                  </p>
                </div>
                <button
                  className="btn btn-sm"
                  onClick={() =>
                    copyToClipboard(
                      `Dear Guest,\n\nThank you for choosing to stay at my vacation rental! To enhance your experience, I've partnered with KitchenLux to offer you premium kitchenware during your stay.\n\nUse my code ${referralCode.code} for 10% off your order!\n\nVisit: ${storefrontURL}?ref=${referralCode.code}`
                    )
                  }
                >
                  Copy Text
                </button>
              </div>
            </div>
          ) : (
            <p>Generate a referral code to access marketing materials.</p>
          )}
        </div>
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Request Payout</h2>
              <button
                className="close-btn"
                onClick={() => setShowPayoutModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Available for payout: ${referralStats?.pendingPayout.toFixed(2)}</p>

              <div className="form-group">
                <label htmlFor="payoutMethod">Select Payment Method:</label>
                <select
                  id="payoutMethod"
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="form-control"
                >
                  <option value="creditToAccount">Credit to My Account</option>
                  <option value="paypal">PayPal</option>
                  <option value="bankTransfer">Bank Transfer</option>
                </select>
              </div>

              {payoutMethod === 'paypal' && (
                <div className="notice">
                  <p>
                    Please ensure your PayPal email is correctly set in your profile
                    before requesting a payout.
                  </p>
                </div>
              )}

              {payoutMethod === 'bankTransfer' && (
                <div className="notice">
                  <p>
                    Please ensure your bank account details are correctly set in your profile
                    before requesting a payout.
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowPayoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={handlePayoutRequest}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDashboardPage;
