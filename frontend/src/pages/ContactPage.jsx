import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AboutFAQ.css'; // Shared styles for info pages

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Your message has been sent! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; Contact Us
          </div>
          <h1>Contact KitchenLux</h1>
          <p>Contact us to explore our rental options and discover how we can enhance your vacation cooking experience.</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-info">
              <h2>How to Reach Us</h2>
              <div className="contact-method">
                <div className="contact-icon">📱</div>
                <div className="contact-details">
                  <h3>Phone</h3>
                  <p>(800) 555-1234</p>
                  <p className="contact-hours">Monday to Friday, 9am - 6pm EST</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>support@kitchenlux.com</p>
                  <p className="contact-hours">We typically respond within 24 hours</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h3>Address</h3>
                  <p>123 Culinary Boulevard</p>
                  <p>Suite 405</p>
                  <p>San Francisco, CA 94110</p>
                </div>
              </div>
              <div className="social-links">
                <a href="#" className="social-link">📘 Facebook</a>
                <a href="#" className="social-link">📸 Instagram</a>
                <a href="#" className="social-link">🐦 Twitter</a>
                <a href="#" className="social-link">📱 TikTok</a>
              </div>
            </div>
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Your Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-preview">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <div className="faq-question">How does delivery and pickup work?</div>
              <div className="faq-answer">
                <p>We coordinate with your vacation rental to ensure your kitchenware is waiting when you arrive. After your stay, simply leave everything in the case and we'll handle pickup.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">Do I need to clean everything before returning?</div>
              <div className="faq-answer">
                <p>No! Simply pack everything back in the case—no cleaning required. We professionally sanitize all items between rentals.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">Where do you currently operate?</div>
              <div className="faq-answer">
                <p>We serve major vacation destinations including NYC, Miami, LA, San Francisco, Chicago, Austin, Nashville, and Denver.</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link to="/faq" className="btn btn-outline">View All FAQs</Link>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Transform Your Vacation Rental Kitchen?</h2>
          <p>Never settle for poorly equipped vacation rental kitchens again. Book KitchenLux for your next Airbnb or Vrbo stay!</p>
          <Link to="/booking" className="btn btn-large">Book Your Kitchenware Now</Link>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;