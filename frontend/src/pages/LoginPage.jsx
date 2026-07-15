import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getContentImageUrl } from '../utils/imageUtils';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    // If already logged in, redirect
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    const success = await loginUser(email, password);
    if (success) {
      navigate(redirect);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-content">
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-description">
              Sign in to your KitchenLux account to manage your bookings, view your rental history, and more.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-auth"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-links">
              <p>
                New to KitchenLux? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Create an account</Link>
              </p>
              <p>
                <Link to="/forgot-password">Forgot your password?</Link>
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

export default LoginPage;
