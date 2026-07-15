import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>KitchenLux</h3>
            <p>Bringing premium kitchenware to your vacation rental, so you can cook like you're home.</p>
            <div className="social-links">
              <a href="#" className="social-link"><span>📘</span></a>
              <a href="#" className="social-link"><span>📱</span></a>
              <a href="#" className="social-link"><span>📸</span></a>
              <a href="#" className="social-link"><span>📌</span></a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalog">Collections</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Collections</h3>
            <ul className="footer-links">
              <li><Link to="/products/professional-chefs-kit">Chef's Essentials</Link></li>
              <li><Link to="/products/baking-collection">Baking Collection</Link></li>
              <li><Link to="/products/italian-cuisine-kit">Italian Cuisine</Link></li>
              <li><Link to="/products/bbq-collection">BBQ Collection</Link></li>
              <li><Link to="/products/holiday-cooking-kit">Holiday Cooking Kit</Link></li>
              <li><Link to="/products/asian-fusion-kit">Asian Fusion</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for special offers and updates.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button type="submit">→</button>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} KitchenLux. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
