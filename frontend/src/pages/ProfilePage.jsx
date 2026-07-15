import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, getMyOrders, becomeHost } from '../api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userInfo, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
  });

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);

        // Load user profile
        const profileData = await getUserProfile();
        setProfile(profileData);

        // Pre-fill form with user data
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          password: '',
          confirmPassword: '',
          phone: profileData.phone || '',
          street: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          postalCode: profileData.address?.postalCode || '',
          country: profileData.address?.country || 'USA',
        });

        // Load orders if on orders tab
        if (activeTab === 'orders') {
          const ordersData = await getMyOrders();
          setOrders(ordersData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
        setLoading(false);
      }
    };

    loadProfileData();
  }, [isAuthenticated, navigate, activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getMyOrders();
      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'orders') {
      loadOrders();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match if changing password
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setUpdateLoading(true);

      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };

      // Only include password if it was entered
      if (formData.password) {
        userData.password = formData.password;
      }

      await updateUserProfile(userData);
      toast.success('Profile updated successfully');

      // Reset password fields
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });

      setUpdateLoading(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      setUpdateLoading(false);
    }
  };

  const renderProfileTab = () => {
    return (
      <div className="profile-form-container">
        <h2>My Profile</h2>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Account Information</h3>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Password</h3>
            <p className="section-note">Leave blank to keep current password</p>

            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Address Information</h3>

            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                className="form-control"
                value={formData.street}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  className="form-control"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  className="form-control"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  className="form-control"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="MEX">Mexico</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-save"
            disabled={updateLoading}
          >
            {updateLoading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>

        {/* Host Program Section */}
        {profile && !profile.isHost && (
          <div className="form-section host-section">
            <h3>Vacation Rental Host Program</h3>
            <p>Are you a vacation rental host on Airbnb, VRBO, or other platforms? Join our host referral program to earn commissions when your guests rent kitchenware from us!</p>

            <div className="host-benefits">
              <div className="benefit-item">
                <h4>Earn 15% Commission</h4>
                <p>Get 15% of every order placed by your guests using your referral code.</p>
              </div>
              <div className="benefit-item">
                <h4>Custom Marketing Materials</h4>
                <p>Access custom QR codes, listing cards, and email templates to share with your guests.</p>
              </div>
              <div className="benefit-item">
                <h4>10% Guest Discount</h4>
                <p>Your guests will receive 10% off their first order with your code.</p>
              </div>
            </div>

            <button
              className="btn btn-primary host-btn"
              onClick={async () => {
                try {
                  await becomeHost();
                  toast.success('You are now a host! Visit your Host Dashboard to generate your referral code.');
                  // Reload profile data to reflect new host status
                  const profileData = await getUserProfile();
                  setProfile(profileData);
                  navigate('/host-dashboard');
                } catch (error) {
                  toast.error(error.message || 'Failed to become a host. Please try again.');
                }
              }}
            >
              Become a Host
            </button>
          </div>
        )}

        {profile && profile.isHost && (
          <div className="form-section host-section">
            <h3>Vacation Rental Host Program</h3>
            <p>You're already enrolled in our host program!</p>
            <button
              className="btn btn-primary host-btn"
              onClick={() => navigate('/host-dashboard')}
            >
              Go to Host Dashboard
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderOrdersTab = () => {
    if (orders.length === 0) {
      return (
        <div className="no-orders">
          <h2>My Orders</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      );
    }

    return (
      <div className="orders-container">
        <h2>My Orders</h2>
        <p className="section-note">View your order history and current rentals.</p>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-date">
                  {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                </div>
                <div className={`order-status ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="order-details">
                <div className="order-info">
                  <div className="order-info-row">
                    <span>Order ID:</span>
                    <span className="order-id">{order._id}</span>
                  </div>
                  <div className="order-info-row">
                    <span>Rental Period:</span>
                    <span>
                      {format(new Date(order.rentalStart), 'MMM d')} - {format(new Date(order.rentalEnd), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="order-info-row">
                    <span>Total Amount:</span>
                    <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="order-info-row">
                    <span>Payment Status:</span>
                    <span className={`payment-status ${order.isPaid ? 'paid' : 'pending'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="order-items-summary">
                  <h4>Items</h4>
                  <div className="order-items-container">
                    {order.orderItems.map((item) => (
                      <div key={item._id} className="order-item-row">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-qty">x{item.qty}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="order-footer">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/confirmation/${order._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                {profile?.name?.charAt(0) || userInfo?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-details">
                <h3>{profile?.name || userInfo?.name}</h3>
                <p>{profile?.email || userInfo?.email}</p>
              </div>
            </div>

            <div className="profile-nav">
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabChange('profile')}
              >
                My Profile
              </button>
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => handleTabChange('orders')}
              >
                My Orders
              </button>
            </div>
          </div>

          <div className="profile-content">
            {activeTab === 'profile' ? renderProfileTab() : renderOrdersTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;