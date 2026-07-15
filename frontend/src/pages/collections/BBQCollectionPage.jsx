import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductImageUrl } from '../../utils/imageUtils';
import './CollectionPage.css';

const galleryImages = ['bbq-collection', 'grill-tools', 'spice-kit', 'storage-case'].map(getProductImageUrl);

const BBQCollectionPage = () => {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState(galleryImages[0]);

  const handleAddToCart = () => {
    addToCart({
      _id: 'prototype-bbq-collection',
      name: 'BBQ Collection',
      slug: 'bbq-collection',
      price: 89.99,
      image: galleryImages[0]
    }, 1);
  };

  const handleThumbnailClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; <Link to="/catalog">Collections</Link> &gt; BBQ Collection
          </div>
          <h1>BBQ Collection</h1>
          <p>Premium outdoor cooking equipment for the ultimate BBQ experience.</p>
        </div>
      </section>

      <section className="product-details">
        <div className="container">
          <div className="product-details-container">
            <div className="product-gallery">
              <img
                src={mainImage}
                alt="BBQ Collection"
                className="gallery-main-image"
              />
              <div className="gallery-thumbnails">
                {galleryImages.map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt={`BBQ Collection placeholder ${index + 1}`}
                    className={`gallery-thumbnail ${mainImage === image ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(image)}
                  />
                ))}
              </div>
            </div>
            <div className="product-info">
              <h2 className="product-title">BBQ Collection</h2>
              <div className="product-price">$89.99/week</div>
              <div className="product-description">
                <p>Premium outdoor cooking equipment for the ultimate BBQ experience. Our BBQ Collection includes everything you need for grilling and smoking at your vacation rental.</p>
                <p>Each item is sanitized, inspected, and delivered to your vacation rental before your arrival. Simply leave everything for pickup after your departure — no cleaning required.</p>
              </div>
              <div className="product-features">
                <h3>What's Included:</h3>
                <ul className="feature-list">
                  <li>Professional-grade portable grill</li>
                  <li>Cast iron BBQ grates</li>
                  <li>Digital meat thermometer</li>
                  <li>Grill tool set (tongs, spatula, fork)</li>
                  <li>Cedar grilling planks</li>
                  <li>BBQ spice rub collection</li>
                  <li>Heavy-duty heat-resistant gloves</li>
                  <li>Basting brushes and mops</li>
                  <li>Marinade injector kit</li>
                  <li>Stainless steel skewers set</li>
                  <li>Grill cleaning brush</li>
                </ul>
              </div>
              <div className="product-actions">
                <button className="btn btn-large" onClick={handleAddToCart}>Add to Cart</button>
                <Link to="/booking?product=BBQ%20Collection" className="btn btn-large btn-outline">Book Now</Link>
              </div>
            </div>
          </div>

          <div className="product-tabs">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Details
              </button>
              <button
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="tab-content active" id="description">
                <h3>About This Kit</h3>
                <p>Our BBQ Collection is designed for outdoor cooking enthusiasts who want professional-quality equipment without the hassle of purchasing or transporting it to their vacation rental. Each item in this collection has been carefully selected for its quality, performance, and durability.</p>
                <p>The professional-grade portable grill provides consistent heat for perfect results, while the included tools and accessories ensure you have everything needed for a complete outdoor cooking experience. The BBQ spice rub collection adds authentic flavors to your grilled creations.</p>
                <p>Everything arrives ready to use, professionally cleaned and sanitized. When your stay is over, simply leave everything for pickup — no cleaning required. We professionally clean and sanitize all items between rentals.</p>

                <h3>Perfect For:</h3>
                <ul>
                  <li>Summer getaways and beach houses</li>
                  <li>Outdoor entertaining and family gatherings</li>
                  <li>Tailgating and sporting events</li>
                  <li>Camping trips with premium meals</li>
                  <li>Grill enthusiasts who want quality without commitment</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-content active" id="specifications">
                <h3>Specifications</h3>
                <table className="spec-table">
                  <tbody>
                    <tr>
                      <th>Portable Grill</th>
                      <td>Premium stainless steel construction, 255 sq. in. cooking surface, foldable design</td>
                    </tr>
                    <tr>
                      <th>BBQ Grates</th>
                      <td>Cast iron construction with pre-seasoned finish for optimal heat retention</td>
                    </tr>
                    <tr>
                      <th>Digital Thermometer</th>
                      <td>Instant-read digital display with temperature range of 32°F to 572°F</td>
                    </tr>
                    <tr>
                      <th>Grill Tool Set</th>
                      <td>Commercial-grade stainless steel with ergonomic heat-resistant handles</td>
                    </tr>
                    <tr>
                      <th>Cedar Planks</th>
                      <td>Set of 6 premium cedar planks (7" x 16") for fish and other delicate foods</td>
                    </tr>
                    <tr>
                      <th>Spice Rub Collection</th>
                      <td>6 signature BBQ rub blends in resealable containers</td>
                    </tr>
                    <tr>
                      <th>Heat-Resistant Gloves</th>
                      <td>Aramid fiber construction with silicone grip, heat resistant to 932°F</td>
                    </tr>
                    <tr>
                      <th>Basting Tools</th>
                      <td>Silicone brushes and cotton fiber mops with extended handles</td>
                    </tr>
                    <tr>
                      <th>Marinade Injector</th>
                      <td>Commercial-grade stainless steel with multiple needle attachments</td>
                    </tr>
                    <tr>
                      <th>Skewers Set</th>
                      <td>Set of 12 flat stainless steel skewers (14" length) preventing food rotation</td>
                    </tr>
                    <tr>
                      <th>Cleaning Brush</th>
                      <td>Durable brass bristles with scraper edge and 18" handle</td>
                    </tr>
                    <tr>
                      <th>Total Items</th>
                      <td>Approximately 25 pieces</td>
                    </tr>
                    <tr>
                      <th>Weight</th>
                      <td>Approximately 22 lbs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content active" id="reviews">
                <h3>Prototype review state</h3>
                <p>Customer review collection and moderation were designed for this prototype, but no real customer reviews are included in the public snapshot.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="related-products">
        <div className="container">
          <div className="section-header">
            <h2>You Might Also Like</h2>
            <p>Other premium kitchenware collections to enhance your vacation cooking.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card product-card">
              <div className="product-image">
                <img
                  src={getProductImageUrl('italian-cuisine-kit')}
                  alt="Italian Cuisine Kit"
                />
              </div>
              <h3 className="product-title">Italian Cuisine Kit</h3>
              <p>Everything you need for authentic Italian cooking.</p>
              <div className="product-price">$75/week</div>
              <div className="product-actions">
                <Link to="/collections/italian-cuisine" className="btn btn-outline">View Details</Link>
                <button className="btn add-to-cart">Add to Cart</button>
              </div>
            </div>
            <div className="feature-card product-card">
              <div className="product-image">
                <img
                  src={getProductImageUrl('professional-chefs-kit')}
                  alt="Chef's Kit"
                />
              </div>
              <h3 className="product-title">Chef's Kit</h3>
              <p>Professional-grade kitchenware for culinary enthusiasts.</p>
              <div className="product-price">$89/week</div>
              <div className="product-actions">
                <Link to="/collections/chefs-kit" className="btn btn-outline">View Details</Link>
                <button className="btn add-to-cart">Add to Cart</button>
              </div>
            </div>
            <div className="feature-card product-card">
              <div className="product-image">
                <img
                  src={getProductImageUrl('spice-collection')}
                  alt="Spice Collection"
                />
              </div>
              <h3 className="product-title">Spice Collection</h3>
              <p>Essential spices in glass jars with labels.</p>
              <div className="product-price">$15/week</div>
              <div className="product-actions">
                <button className="btn add-to-cart">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Upgrade Your Outdoor Cooking?</h2>
          <p>Book your premium BBQ collection today and experience professional grilling during your next vacation.</p>
          <Link to="/booking" className="btn">Book Your Kitchenware Now</Link>
        </div>
      </section>
    </>
  );
};

export default BBQCollectionPage;
