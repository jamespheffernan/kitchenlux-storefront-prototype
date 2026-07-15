import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getContentImageUrl } from '../utils/imageUtils';
import './AuthPages.css';

const RegisterPage = () => {
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

  const { registerUser, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    // If already logged in, redirect
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    };

    const success = await registerUser(userData);
    if (success) {
      navigate(redirect);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container register-container">
          <div className="auth-content">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-description">
              Join KitchenLux to start renting premium kitchenware for your vacation rentals.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <h3 className="address-title">Address Information</h3>

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  className="form-control"
                  placeholder="Enter your street address"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    className="form-control"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    className="form-control"
                    placeholder="Enter your state"
                    value={formData.state}
                    onChange={handleChange}
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
                    placeholder="Enter your postal code"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    className="form-control"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    <option value="MEX">Mexico</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-auth"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-links">
              <p>
                Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign In</Link>
              </p>
            </div>
          </div>

          <div className="auth-image">
            <img src={getContentImageUrl('premium-kitchenware')} alt="Kitchenware prototype placeholder" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
