import React from 'react';
import { Link } from 'react-router-dom';
import './AboutFAQ.css'; // Shared styles for info pages
import { getContentImageUrl, createContentImageErrorHandler } from '../utils/imageUtils';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; About Us
          </div>
          <h1>About KitchenLux</h1>
          <p>Discover our story and the passion behind our premium kitchenware rental service.</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-image">
              <img
                src={getContentImageUrl("about-founders", "800x600")}
                alt="Generated product concept placeholder"
                onError={createContentImageErrorHandler("about-founders")}
              />
            </div>
            <div className="about-text">
              <h2>Product Hypothesis</h2>
              <p>Vacation rentals often provide inconsistent kitchen equipment. This prototype explores whether travellers could reserve a curated set of cookware and tools alongside a stay instead of buying or transporting their own.</p>
              <p>The interface models discovery, kit configuration, delivery details, account management, host referrals, and internal order operations. Its copy and data are illustrative product-design material, not claims about an operating service.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section" style={{ backgroundColor: 'var(--light)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do at KitchenLux.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Quality Without Compromise</h3>
              <p>We source and maintain the highest quality kitchenware available, never settling for anything less than what professional chefs would approve.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">♻️</div>
              <h3>Sustainability</h3>
              <p>Our rental model promotes sustainability by reducing waste. Why buy new kitchenware for each vacation when you can simply rent what you need?</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧽</div>
              <h3>Impeccable Cleanliness</h3>
              <p>Every item is thoroughly sanitized and inspected between rentals, meeting commercial kitchen standards for cleanliness and safety.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Customer-Centric Service</h3>
              <p>We believe in going above and beyond to ensure our customers have an exceptional experience from booking to return.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Community Support</h3>
              <p>We partner with local culinary programs to donate a portion of our proceeds to culinary education initiatives in underserved communities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Continuous Improvement</h3>
              <p>We constantly refine our offerings based on customer feedback, culinary trends, and innovations in kitchenware technology.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Prototype Scope</h2>
            <p>This archived interface explores the customer, host, operations, and administration surfaces a rental service would need.</p>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-image">
                <img
                  src={getContentImageUrl("customer-experience", "400x400")}
                  alt="Generated customer experience placeholder"
                  onError={createContentImageErrorHandler("customer-experience")}
                />
              </div>
              <h3 className="team-member-name">Customer Experience</h3>
              <p className="team-member-bio">Discovery, booking, account, and order-history flows for vacation travellers.</p>
            </div>
            <div className="team-member">
              <div className="team-member-image">
                <img
                  src={getContentImageUrl("host-tools", "400x400")}
                  alt="Generated host tools placeholder"
                  onError={createContentImageErrorHandler("host-tools")}
                />
              </div>
              <h3 className="team-member-name">Host Tools</h3>
              <p className="team-member-bio">Property, referral, verification, and payout concepts for rental hosts.</p>
            </div>
            <div className="team-member">
              <div className="team-member-image">
                <img
                  src={getContentImageUrl("operations", "400x400")}
                  alt="Generated operations placeholder"
                  onError={createContentImageErrorHandler("operations")}
                />
              </div>
              <h3 className="team-member-name">Operations</h3>
              <p className="team-member-bio">Catalog, inventory, fulfilment-status, and administration concepts for an internal team.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Elevate Your Vacation Cooking?</h2>
          <p>Experience the joy of cooking with professional-grade kitchenware during your next getaway.</p>
          <Link to="/booking" className="btn btn-large">Book Your Kitchenware Now</Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
