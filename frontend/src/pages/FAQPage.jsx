import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AboutFAQ.css'; // Shared styles for info pages

const FAQPage = () => {
  // State for storing which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState({});

  // Toggle FAQ item expansion
  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="faq-page">
      <section className="page-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; FAQ
          </div>
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our premium kitchenware rental service.</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="faq-container">
            <h2 style={{ marginBottom: '30px' }}>General Questions</h2>

            <div className={`faq-item ${expandedItems['faq1'] ? 'active' : ''}`} onClick={() => toggleItem('faq1')}>
              <div className="faq-question">What is KitchenLux?</div>
              <div className="faq-answer">
                <p>KitchenLux is a premium kitchenware rental service designed for travelers staying in vacation rentals. We deliver high-quality, professional-grade kitchenware directly to your Airbnb or other rental property, so you can enjoy cooking with the same quality tools you use at home.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq2'] ? 'active' : ''}`} onClick={() => toggleItem('faq2')}>
              <div className="faq-question">How does the rental process work?</div>
              <div className="faq-answer">
                <p>Our process is simple:</p>
                <ol style={{ marginLeft: '20px' }}>
                  <li>Choose your kitchenware collection (pre-curated or custom)</li>
                  <li>Provide your vacation dates and rental address</li>
                  <li>Complete your booking with payment</li>
                  <li>Your kitchenware is delivered before your arrival</li>
                  <li>Enjoy cooking during your stay</li>
                  <li>Leave everything in the case for pickup after your departure</li>
                </ol>
                <p>For more details, visit our <Link to="/how-it-works" style={{ color: 'var(--primary)' }}>How It Works</Link> page.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq3'] ? 'active' : ''}`} onClick={() => toggleItem('faq3')}>
              <div className="faq-question">Where do you currently offer your service?</div>
              <div className="faq-answer">
                <p>We currently operate in these major vacation destinations:</p>
                <ul style={{ marginLeft: '20px' }}>
                  <li>New York City metropolitan area</li>
                  <li>Miami and South Florida</li>
                  <li>Los Angeles and Orange County</li>
                  <li>San Francisco Bay Area</li>
                  <li>Chicago</li>
                  <li>Austin</li>
                  <li>Nashville</li>
                  <li>Denver</li>
                </ul>
                <p>We're rapidly expanding to new locations. If your destination isn't listed, contact us as we may still be able to accommodate your request with advance notice.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq4'] ? 'active' : ''}`} onClick={() => toggleItem('faq4')}>
              <div className="faq-question">How much advance notice do you need for a booking?</div>
              <div className="faq-answer">
                <p>We recommend booking at least 3-5 days in advance to ensure availability and smooth delivery. For popular vacation periods like holidays, we suggest booking 1-2 weeks ahead. Last-minute bookings may be possible depending on location and inventory availability—contact us directly for rush requests.</p>
              </div>
            </div>

            <h2 style={{ margin: '40px 0 30px' }}>Products & Collections</h2>

            <div className={`faq-item ${expandedItems['faq5'] ? 'active' : ''}`} onClick={() => toggleItem('faq5')}>
              <div className="faq-question">What brands and quality level can I expect?</div>
              <div className="faq-answer">
                <p>We offer professional-grade kitchenware from premium brands including All-Clad, Wüsthof, Global, Lodge, Le Creuset, KitchenAid, and other respected manufacturers. Our inventory is maintained to professional standards and regularly replaced to ensure quality. Each item would typically cost $50-$200+ to purchase outright, making our rental service an economical way to access high-end kitchenware.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq6'] ? 'active' : ''}`} onClick={() => toggleItem('faq6')}>
              <div className="faq-question">What's included in each collection?</div>
              <div className="faq-answer">
                <p>Our collections are designed to meet different cooking needs:</p>
                <p><strong>Essential Kit ($49/week):</strong> Includes a chef's knife, cutting board, non-stick frying pan, medium saucepan, basic utensil set, and measuring tools.</p>
                <p><strong>Chef's Kit ($89/week):</strong> Our most popular option includes a professional knife set, cast iron skillet, stainless steel cookware set, complete utensil collection, food processor, and a spice kit.</p>
                <p><strong>Custom Kit (from $69/week):</strong> Choose any 8 items from our catalog, with the option to add specialty items for specific cuisines or cooking needs.</p>
                <p>We also offer themed collections for specific cuisines (Italian, Asian, Baking, etc.) and special occasions (Holiday Feast, Romantic Dinner, etc.).</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq7'] ? 'active' : ''}`} onClick={() => toggleItem('faq7')}>
              <div className="faq-question">Can I request specific brands or items?</div>
              <div className="faq-answer">
                <p>Yes! With our Custom Kit option, you can request specific brands or items from our inventory. While we can't guarantee every specific request, we have an extensive selection and will do our best to accommodate your preferences. For very specific needs, contact us before booking to confirm availability.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq8'] ? 'active' : ''}`} onClick={() => toggleItem('faq8')}>
              <div className="faq-question">Do you offer electric appliances or just manual tools?</div>
              <div className="faq-answer">
                <p>We offer both. Our Chef's Kit includes a food processor, and we offer additional electrical appliances as add-ons, including:</p>
                <ul style={{ marginLeft: '20px' }}>
                  <li>Stand mixers</li>
                  <li>Immersion blenders</li>
                  <li>Electric kettles</li>
                  <li>Slow cookers</li>
                  <li>Coffee grinders</li>
                  <li>Specialty items like pasta makers or ice cream machines</li>
                </ul>
                <p>All electrical appliances are tested before delivery to ensure proper function.</p>
              </div>
            </div>

            <h2 style={{ margin: '40px 0 30px' }}>Delivery & Logistics</h2>

            <div className={`faq-item ${expandedItems['faq9'] ? 'active' : ''}`} onClick={() => toggleItem('faq9')}>
              <div className="faq-question">How is the kitchenware delivered?</div>
              <div className="faq-answer">
                <p>Your kitchenware arrives in a secure, custom-designed case that keeps everything organized and protected. For properties with secure access, we coordinate with the property manager or host to ensure the case is placed inside before your arrival.</p>
                <p>For properties without advance access, we arrange a delivery window with you directly or leave the case in a secure location as specified in your delivery instructions.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq10'] ? 'active' : ''}`} onClick={() => toggleItem('faq10')}>
              <div className="faq-question">Do I need to be present for delivery or pickup?</div>
              <div className="faq-answer">
                <p>No, you don't need to be present for either delivery or pickup. We coordinate with property managers when possible, or follow your delivery instructions. For pickup, simply leave the case in the designated location before your departure.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq11'] ? 'active' : ''}`} onClick={() => toggleItem('faq11')}>
              <div className="faq-question">Do I need to clean everything before pickup?</div>
              <div className="faq-answer">
                <p>No! This is one of the most loved features of our service. Simply place all items back in the case—there's no need to clean or wash anything. We professionally clean and sanitize all items between rentals using commercial-grade equipment and processes.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq12'] ? 'active' : ''}`} onClick={() => toggleItem('faq12')}>
              <div className="faq-question">What if I need to change my delivery or pickup dates?</div>
              <div className="faq-answer">
                <p>You can modify your booking dates through your account on our website or by calling our customer service team. Changes made at least 48 hours before scheduled delivery are free of charge. Last-minute changes may incur a small fee depending on logistics.</p>
              </div>
            </div>

            <h2 style={{ margin: '40px 0 30px' }}>Policies & Concerns</h2>

            <div className={`faq-item ${expandedItems['faq13'] ? 'active' : ''}`} onClick={() => toggleItem('faq13')}>
              <div className="faq-question">How clean are the kitchenware items?</div>
              <div className="faq-answer">
                <p>Hygiene is our top priority. Every item undergoes a rigorous multi-stage cleaning and sanitization process between rentals:</p>
                <ol style={{ marginLeft: '20px' }}>
                  <li>Initial cleaning to remove food residue</li>
                  <li>High-temperature dishwashing (180°F+) with commercial-grade detergents</li>
                  <li>Sanitization with food-safe solutions</li>
                  <li>Quality inspection under bright light for any remaining residue</li>
                  <li>Packaging in sealed, clean containers</li>
                </ol>
                <p>Our standards exceed those required for restaurants and commercial kitchens.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq14'] ? 'active' : ''}`} onClick={() => toggleItem('faq14')}>
              <div className="faq-question">What if something breaks during my rental period?</div>
              <div className="faq-answer">
                <p>Our standard rental includes basic coverage for normal wear and tear. We understand accidents happen in the kitchen. If something breaks:</p>
                <ol style={{ marginLeft: '20px' }}>
                  <li>Notify us through our website or by calling customer service</li>
                  <li>For customers with Premium Damage Protection ($10/week add-on), there's no additional charge</li>
                  <li>Without Premium Damage Protection, responsibility is determined case-by-case, though we're generally understanding about normal kitchen accidents</li>
                </ol>
                <p>We recommend the Premium Damage Protection for complete peace of mind.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq15'] ? 'active' : ''}`} onClick={() => toggleItem('faq15')}>
              <div className="faq-question">What is your cancellation policy?</div>
              <div className="faq-answer">
                <p>Our cancellation policy is as follows:</p>
                <ul style={{ marginLeft: '20px' }}>
                  <li>Full refund for cancellations 7+ days before delivery</li>
                  <li>75% refund for cancellations 3-6 days before delivery</li>
                  <li>50% refund for cancellations 24-48 hours before delivery</li>
                  <li>No refund for cancellations less than 24 hours before delivery</li>
                </ul>
                <p>For special circumstances, please contact our customer service team directly.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq16'] ? 'active' : ''}`} onClick={() => toggleItem('faq16')}>
              <div className="faq-question">Can I extend my rental period?</div>
              <div className="faq-answer">
                <p>Yes! If your plans change and you need your kitchenware longer, simply log in to your account or give us a call at least 24 hours before your scheduled pickup. We'll extend your rental at the same daily rate, subject to availability.</p>
              </div>
            </div>

            <div className={`faq-item ${expandedItems['faq17'] ? 'active' : ''}`} onClick={() => toggleItem('faq17')}>
              <div className="faq-question">What if I need a specific item that isn't in your catalog?</div>
              <div className="faq-answer">
                <p>We're always expanding our inventory based on customer requests. If you need something specific that isn't listed in our catalog, please contact us. We may already have it or can potentially source it for you. For unique or specialty items, we may require a longer lead time or additional fee.</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <h3>Didn't find your answer?</h3>
            <p>Our customer service team is ready to help with any additional questions.</p>
            <Link to="/contact" className="btn" style={{ marginTop: '20px' }}>Contact Us</Link>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Upgrade Your Vacation Cooking?</h2>
          <p>Book your premium kitchenware kit today and experience the joy of cooking with professional tools during your next vacation.</p>
          <Link to="/booking" className="btn btn-large">Book Your Kitchenware Now</Link>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;