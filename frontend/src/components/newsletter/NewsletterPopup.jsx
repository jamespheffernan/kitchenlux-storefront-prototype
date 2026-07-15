import React, { useState, useContext, useRef, useEffect } from 'react';
import { NewsletterContext } from '../../context/NewsletterContext';
import { subscribeToNewsletter } from '../../api';
import { toast } from 'react-toastify';
import './NewsletterPopup.css';

const NewsletterPopup = () => {
  const { showPopup, closePopup, markAsSubscribed, exitIntent } = useContext(NewsletterContext);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const popupRef = useRef(null);

  // Email validation
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    setFormError('');
    setIsLoading(true);

    try {
      await subscribeToNewsletter(email, 'exit-popup');
      markAsSubscribed();
      toast.success('Thanks for subscribing! Your 10% discount code has been sent to your email.');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setFormError(error.message || 'An error occurred. Please try again.');
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup, closePopup]);

  if (!showPopup) return null;

  return (
    <div className={`newsletter-popup-overlay ${exitIntent ? 'exit-intent' : ''}`}>
      <div className="newsletter-popup" ref={popupRef}>
        <button
          className="popup-close"
          onClick={closePopup}
          aria-label="Close popup"
        >
          ×
        </button>

        <div className="popup-content">
          <div className="popup-header">
            <h2>Wait! Before You Go...</h2>
            <p className="popup-subtitle">Get 10% off your first rental</p>
          </div>

          <div className="popup-offer">
            <div className="discount-badge">10% OFF</div>
            <p>Subscribe to our newsletter and receive a 10% discount code for your first order!</p>
          </div>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={formError ? 'error' : ''}
                disabled={isLoading}
              />
              {formError && <p className="error-message">{formError}</p>}
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn-subscribe"
                disabled={isLoading}
              >
                {isLoading ? 'Subscribing...' : 'Get My Discount'}
              </button>
            </div>
          </form>

          <p className="privacy-note">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;