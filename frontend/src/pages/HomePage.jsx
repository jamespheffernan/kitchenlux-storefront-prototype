import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTopProducts } from '../api';
import { getHeroImageUrl, getProductImageUrl, createImageErrorHandler } from '../utils/imageUtils';
import './HomePage.css';

const HomePage = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopProducts = async () => {
      try {
        const data = await fetchTopProducts();
        setTopProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top products:', error);
        setLoading(false);
      }
    };

    loadTopProducts();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Elevate Your Vacation Culinary Experience</h1>
              <p className="tagline">Luxury kitchenware delivered to your doorstep, for an uncompromising cooking experience.</p>
              <p>Many vacation rentals, such as Airbnb and Vrbo properties, often lack well-equipped kitchens, leaving guests with limited cooking options. KitchenLux addresses this issue by offering premium kitchenware rentals, ensuring you have the tools needed to prepare meals comfortably during your stay.</p>
              <Link to="/catalog" className="btn">Rent Premium Kitchenware</Link>
              <Link to="/build-kit" className="btn btn-primary" style={{ marginLeft: '10px' }}>Build Custom Kit</Link>
            </div>
            <div className="hero-image">
              <img
                src={getHeroImageUrl('kitchen-hero')}
                alt="Premium kitchenware"
                onError={createImageErrorHandler('kitchen', '1200x800')}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose KitchenLux?</h2>
            <p>Choose KitchenLux for competitive prices, flexible rental terms, and outstanding customer service, ensuring a seamless cooking experience in your vacation rental.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔪</div>
              <h3>Professional-Grade Quality</h3>
              <p>Every piece in our collection is carefully selected for quality, durability, and performance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧽</div>
              <h3>Sanitized & Ready to Use</h3>
              <p>All items are professionally cleaned and sanitized before delivery to ensure the highest standards.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Doorstep Delivery & Pickup</h3>
              <p>We deliver before your arrival and pick up after your departure - nothing to clean or return.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Curated Collections</h3>
              <p>From essential basics to specialty cuisine kits, we offer thoughtfully curated kitchenware collections.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="collections">
        <div className="container">
          <div className="section-header">
            <h2>Popular Collections</h2>
            <p>Rent from our extensive selection of cookware, bakeware, utensils, and appliances. Every item is meticulously maintained to ensure you can prepare meals with ease during your vacation.</p>
          </div>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <div className="collections-grid">
              {topProducts.map((product) => (
                <div key={product._id} className="collection-card">
                  <div className="collection-image">
                    <img
                      src={getProductImageUrl(product.slug)}
                      alt={product.name}
                      loading="lazy"
                      onError={createImageErrorHandler(product.category?.toLowerCase() || 'kitchen')}
                    />
                  </div>
                  <div className="collection-content">
                    <h3>{product.name}</h3>
                    <p>{product.description.substring(0, 100)}...</p>
                    <div className="collection-price">${product.price.toFixed(2)}/week</div>
                    <Link to={`/products/${product.slug}`} className="btn">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/catalog" className="btn btn-outline">View All Collections</Link>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Enhancing your vacation rental kitchen has never been easier.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse & Select</h3>
              <p>Choose from our curated kitchenware collections or customize your own.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book & Pay</h3>
              <p>Secure your rental with our simple booking process and secure payment.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Doorstep Delivery</h3>
              <p>We deliver to your Airbnb or Vrbo rental before your arrival date.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Cook & Enjoy</h3>
              <p>Create memorable meals with premium kitchenware during your stay.</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h3>Leave It All Behind</h3>
              <p>No cleanup or return needed. We pick everything up after you leave.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="kit-builder-promo">
        <div className="container">
          <div className="promo-content">
            <div className="promo-text">
              <h2>Build Your Perfect Custom Kitchen Kit</h2>
              <p>Create a personalized kitchenware package tailored exactly to your vacation rental needs. Select individual items, get volume discounts, and enjoy the flexibility of a customized cooking experience.</p>
              <ul className="promo-features">
                <li><span className="feature-icon">✓</span> Select individual items from our premium collection</li>
                <li><span className="feature-icon">✓</span> Get up to 10% discount on larger kits</li>
                <li><span className="feature-icon">✓</span> Save your custom kits for future rentals</li>
                <li><span className="feature-icon">✓</span> Start with templates or build from scratch</li>
              </ul>
              <Link to="/build-kit" className="btn">Create Your Custom Kit</Link>
            </div>
            <div className="promo-image">
              <img
                src={getHeroImageUrl('custom-kit')}
                alt="Custom Kitchen Kit Builder"
                onError={createImageErrorHandler('kitchenware', '800x600')}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Upgrade Your Vacation Rental Kitchen?</h2>
          <p>Contact us to explore our rental options and discover how we can enhance your vacation cooking experience in any Airbnb or Vrbo property.</p>
          <Link to="/catalog" className="btn">Browse Collections Now</Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
