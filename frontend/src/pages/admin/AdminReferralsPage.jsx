import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllReferralCodes, processReferralPayout } from '../../api';
import { toast } from 'react-toastify';
import Loader from '../../components/layout/Loader';
import Paginate from '../../components/layout/Paginate';
import './AdminStyles.css';

const AdminReferralsPage = () => {
  const [referralCodes, setReferralCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [payoutStatus, setPayoutStatus] = useState('processed');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [processingPayout, setProcessingPayout] = useState(false);

  useEffect(() => {
    fetchReferralCodes(page);
  }, [page]);

  const fetchReferralCodes = async (pageNumber) => {
    setLoading(true);
    try {
      const data = await getAllReferralCodes(pageNumber);
      setReferralCodes(data.referralCodes);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError(err.message || 'Failed to fetch referral codes');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const openPayoutModal = (payout, hostId, code) => {
    setSelectedPayout({
      ...payout,
      hostId,
      code,
    });
    setPayoutStatus('processed');
    setPayoutNotes('');
    setTransactionId('');
    setShowPayoutModal(true);
  };

  const closePayoutModal = () => {
    setSelectedPayout(null);
    setShowPayoutModal(false);
  };

  const handleProcessPayout = async () => {
    if (!selectedPayout) return;

    setProcessingPayout(true);
    try {
      await processReferralPayout(selectedPayout._id, {
        status: payoutStatus,
        notes: payoutNotes,
        transactionId: transactionId || undefined,
      });

      toast.success(`Payout ${payoutStatus} successfully`);
      closePayoutModal();
      fetchReferralCodes(page); // Refresh the list
    } catch (err) {
      toast.error(err.message || 'Failed to process payout');
    } finally {
      setProcessingPayout(false);
    }
  };

  return (
    <div className="admin-container">
      <h1>Referral Program Management</h1>
      <p>Manage host referral codes and process payout requests.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="admin-card">
            <h2>Active Referral Codes</h2>
            {referralCodes.length === 0 ? (
              <p>No referral codes found.</p>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Host</th>
                      <th>Created</th>
                      <th>Expires</th>
                      <th>Usage</th>
                      <th>Total Earnings</th>
                      <th>Pending Payouts</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralCodes.map((code) => (
                      <tr key={code._id}>
                        <td>
                          <span className="code-badge">{code.code}</span>
                        </td>
                        <td>
                          <Link to={`/admin/user/${code.host._id}`}>
                            {code.host.name}
                          </Link>
                          <div className="email-small">{code.host.email}</div>
                        </td>
                        <td>{new Date(code.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(code.expiresAt).toLocaleDateString()}</td>
                        <td>{code.usageCount}</td>
                        <td>${code.totalEarnings.toFixed(2)}</td>
                        <td>
                          {code.payouts && code.payouts.filter(p => p.status === 'pending').length > 0 ? (
                            <span className="badge badge-warning">
                              {code.payouts.filter(p => p.status === 'pending').length} pending
                            </span>
                          ) : (
                            <span className="badge badge-secondary">None</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-sm btn-outline"
                            onClick={() => {
                              // Implement view details
                              toast.info('Detailed view coming soon');
                            }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Paginate
              pages={pages}
              page={page}
              onChange={handlePageChange}
            />
          </div>

          <div className="admin-card">
            <h2>Pending Payout Requests</h2>
            {referralCodes.filter(code =>
              code.payouts && code.payouts.some(p => p.status === 'pending')
            ).length === 0 ? (
              <p>No pending payout requests.</p>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Host</th>
                      <th>Referral Code</th>
                      <th>Request Date</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralCodes
                      .filter(code =>
                        code.payouts && code.payouts.some(p => p.status === 'pending')
                      )
                      .flatMap(code =>
                        code.payouts
                          .filter(payout => payout.status === 'pending')
                          .map(payout => ({
                            ...payout,
                            hostName: code.host.name,
                            hostId: code.host._id,
                            code: code.code,
                          }))
                      )
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((payout) => (
                        <tr key={payout._id}>
                          <td>
                            <Link to={`/admin/user/${payout.hostId}`}>
                              {payout.hostName}
                            </Link>
                          </td>
                          <td>
                            <span className="code-badge">{payout.code}</span>
                          </td>
                          <td>{new Date(payout.date).toLocaleDateString()}</td>
                          <td>${payout.amount.toFixed(2)}</td>
                          <td>
                            <button
                              className="btn-sm"
                              onClick={() => openPayoutModal(payout, payout.hostId, payout.code)}
                            >
                              Process
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Payout Processing Modal */}
      {showPayoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Process Payout Request</h2>
              <button
                className="close-btn"
                onClick={closePayoutModal}
                disabled={processingPayout}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="payout-details">
                <p>
                  <strong>Host:</strong> {selectedPayout.hostName}
                </p>
                <p>
                  <strong>Referral Code:</strong> {selectedPayout.code}
                </p>
                <p>
                  <strong>Request Date:</strong>{' '}
                  {new Date(selectedPayout.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Amount:</strong> ${selectedPayout.amount.toFixed(2)}
                </p>
                {selectedPayout.notes && (
                  <p>
                    <strong>Notes:</strong> {selectedPayout.notes}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="payoutStatus">Status:</label>
                <select
                  id="payoutStatus"
                  className="form-control"
                  value={payoutStatus}
                  onChange={(e) => setPayoutStatus(e.target.value)}
                  disabled={processingPayout}
                >
                  <option value="processed">Processed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transactionId">Transaction ID (optional):</label>
                <input
                  type="text"
                  id="transactionId"
                  className="form-control"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  disabled={processingPayout}
                  placeholder="Enter payment transaction ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="payoutNotes">Notes:</label>
                <textarea
                  id="payoutNotes"
                  className="form-control"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  disabled={processingPayout}
                  rows="3"
                  placeholder="Enter any notes about this payout"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={closePayoutModal}
                disabled={processingPayout}
              >
                Cancel
              </button>
              <button
                className={`btn ${payoutStatus === 'failed' ? 'btn-danger' : ''}`}
                onClick={handleProcessPayout}
                disabled={processingPayout}
              >
                {processingPayout
                  ? 'Processing...'
                  : payoutStatus === 'processed'
                  ? 'Confirm Payment'
                  : 'Mark as Failed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReferralsPage;