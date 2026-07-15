import React from 'react';
import { Link } from 'react-router-dom';
import './AboutFAQ.css'; // Shared styles for info pages
import { getContentImageUrl, createContentImageErrorHandler } from '../utils/imageUtils';

const HowItWorksPage = () => {
  return (
    <div className="how-it-works-page">
      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; How It Works
          </div>
          <h1>How KitchenLux Works</h1>
          <p>Discover how we can transform your vacation rental kitchen experience with premium kitchenware rentals.</p>
        </div>
      </section>

      <section className="process-steps">
        <div className="container">
          <div className="section-header">
            <h2>Our Simple Process</h2>
            <p>Enhancing your Airbnb or Vrbo kitchen with KitchenLux is effortless</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">🍽️</div>
              <h3>Choose Your Collection</h3>
              <p>Browse our curated kitchenware collections or build your own custom set with exactly what you need.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">📅</div>
              <h3>Book Online</h3>
              <p>Enter your vacation dates and rental address. Add specialty items or premium spice collections.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">📦</div>
              <h3>We Deliver</h3>
              <p>Your kitchenware arrives in a secure case before your arrival, sanitized and ready to use.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">👨‍🍳</div>
              <h3>Cook & Enjoy</h3>
              <p>Prepare delicious meals with professional-grade tools during your entire vacation stay.</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <div className="step-icon">♻️</div>
              <h3>Easy Return</h3>
              <p>Simply place everything back in the case. We'll pick it up after your departure—no cleaning required!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features" style={{ backgroundColor: 'var(--light)' }}>
        <div className="container">
          <div className="section-header">
            <h2>The KitchenLux Difference</h2>
            <p>What makes our kitchenware rental service unique and hassle-free.</p>
          </div>

          <div className="feature-content">
            <div className="feature-image">
              <img
                src={getContentImageUrl("premium-kitchenware", "800x600")}
                alt="Premium kitchenware collection"
                onError={createContentImageErrorHandler("premium-kitchenware")}
              />
            </div>
            <div className="feature-text">
              <h3>Professional-Grade Quality</h3>
              <p>Every item in our inventory is selected for professional quality and exceptional performance. We offer the same brands and tools used by professional chefs, giving you an elevated cooking experience during your vacation.</p>
              <p>Our collections include high-carbon steel knives that maintain their edge, heavy-bottomed cookware for even heat distribution, and precision tools that make cooking more enjoyable and efficient.</p>
            </div>
          </div>

          <div className="feature-content reverse">
            <div className="feature-image">
              <img
                src={getContentImageUrl("sanitization", "800x600")}
                alt="Sanitization process"
                onError={createContentImageErrorHandler("sanitization")}
              />
            </div>
            <div className="feature-text">
              <h3>Impeccable Cleanliness</h3>
              <p>Hygiene is our top priority. Every returned item undergoes a rigorous multi-stage cleaning and sanitization process that exceeds industry standards.</p>
              <p>Our cleaning facility uses commercial-grade equipment and food-safe sanitizing agents to ensure each product is pristine before delivery. All items are individually inspected for quality before being approved for the next rental.</p>
            </div>
          </div>

          <div className="feature-content">
            <div className="feature-image">
              <img
                src={getContentImageUrl("delivery-service", "800x600")}
                alt="Delivery service"
                onError={createContentImageErrorHandler("delivery-service")}
              />
            </div>
            <div className="feature-text">
              <h3>Seamless Logistics</h3>
              <p>Our delivery and pickup system is designed for maximum convenience. We coordinate with property managers or rental hosts to ensure your kitchenware is waiting for you upon arrival.</p>
              <p>All items arrive in a secure, custom-designed case that keeps everything organized and protected. When it's time to leave, simply place everything back in the case—no washing or special packing required.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Our Popular Collections</h2>
            <p>Choose from our pre-curated kitchenware collections or build your own.</p>
          </div>
          <div className="pricing-cards">
            <div className="pricing-card">
              <h3>Essential Kit</h3>
              <div className="price">$49<span>/week</span></div>
              <p>The basics you need for everyday cooking during your stay.</p>
              <ul className="pricing-features">
                <li>Chef's knife & cutting board</li>
                <li>Non-stick frying pan</li>
                <li>Medium saucepan</li>
                <li>Basic utensil set</li>
                <li>Measuring cups & spoons</li>
                <li>Free delivery & pickup</li>
              </ul>
              <Link to="/booking" className="btn">Select This Kit</Link>
            </div>
            <div className="pricing-card popular">
              <h3>Chef's Kit</h3>
              <div className="price">$89<span>/week</span></div>
              <p>Our most popular option for culinary enthusiasts.</p>
              <ul className="pricing-features">
                <li>Professional knife set</li>
                <li>Cast iron skillet</li>
                <li>Stainless steel pots & pans</li>
                <li>Complete utensil collection</li>
                <li>Food processor</li>
                <li>Spice kit included</li>
                <li>Free priority delivery & pickup</li>
              </ul>
              <Link to="/booking" className="btn">Select This Kit</Link>
            </div>
            <div className="pricing-card">
              <h3>Custom Kit</h3>
              <div className="price">From $69<span>/week</span></div>
              <p>Build your own kit with exactly what you need.</p>
              <ul className="pricing-features">
                <li>Choose any 8 items from our catalog</li>
                <li>Add specialty items as needed</li>
                <li>Themed options available</li>
                <li>Perfect for specific cuisines</li>
                <li>Free delivery & pickup</li>
              </ul>
              <Link to="/booking" className="btn">Build Your Kit</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Transform Your Vacation Rental Kitchen?</h2>
          <p>Don't let poorly equipped Airbnb or Vrbo kitchens limit your culinary options. Rent premium kitchenware from KitchenLux today!</p>
          <Link to="/booking" className="btn btn-large">Book Your Kitchenware Now</Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
