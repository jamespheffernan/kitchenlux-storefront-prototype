import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder, getUserProfile, getProducts } from '../api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getProductImageUrl, getFallbackImageUrl, createImageErrorHandler } from '../utils/imageUtils';
import './BookingPage.css';

const BookingPage = () => {
  const {
    cartItems,
    rentalDates,
    damageProtection,
    subtotal,
    damageProtectionFee,
    deliveryFee,
    tax,
    total,
    clearCart,
    addToCart,
    setRentalPeriod,
    toggleDamageProtection
  } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // Multi-step booking state
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // User profile state
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Date selection state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));

  // Address state
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
  });
  const [airbnbListingUrl, setAirbnbListingUrl] = useState('');
  const [useAirbnbListing, setUseAirbnbListing] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    // Load products and user profile
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Load user profile
        const profile = await getUserProfile();
        setUserProfile(profile);

        // Pre-fill address if user has one
        if (profile && profile.address) {
          setAddressData({
            street: profile.address.street || '',
            city: profile.address.city || '',
            state: profile.address.state || '',
            postalCode: profile.address.postalCode || '',
            country: profile.address.country || 'USA',
          });
        }

        // Load kitchenware collections/products
        const productData = await getProducts();
        setProducts(productData);

        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Error loading products. Please try again.');
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Step handlers
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Product selection handlers
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleProductSubmit = () => {
    // If cart already has items or a product is selected, proceed to next step
    if (cartItems.length > 0 || selectedProduct) {
      // If a new product is selected, add it to the cart
      if (selectedProduct) {
        addToCart(selectedProduct, quantity);
      }

      // Move to the next step
      nextStep();
    } else {
      toast.error('Please select a kitchenware kit or add items to your cart first');
    }
  };

  // Date selection handlers
  const handleDateChange = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (startDate >= endDate) {
      toast.error('End date must be after start date');
      return;
    }

    // Set rental period in the cart context
    setRentalPeriod(startDate, endDate);

    // Move to the next step
    nextStep();
  };

  // Address handlers
  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.id]: e.target.value,
    });
  };

  const handleAirbnbUrlChange = (e) => {
    setAirbnbListingUrl(e.target.value);
  };

  const toggleAddressType = () => {
    setUseAirbnbListing(!useAirbnbListing);
  };

  // Helper function to clean and validate Airbnb URLs
  const cleanAirbnbUrl = (url) => {
    try {
      // Return null for empty URLs
      if (!url) return null;

      // Create a URL object to parse the components
      const urlObj = new URL(url);

      // Check if it's an Airbnb domain (both .com and international variants)
      const isAirbnbDomain = urlObj.hostname.includes('airbnb.') ||
                             urlObj.hostname === 'airbnb' ||
                             urlObj.hostname.startsWith('www.airbnb.');

      if (!isAirbnbDomain) return null;

      // Extract just the base path with room ID, assuming format is /rooms/XXXXX
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length >= 3 && pathParts[1] === 'rooms') {
        // Rebuild the clean URL with just the room ID
        const roomId = pathParts[2].split('?')[0]; // Remove any query parameters
        const baseHost = urlObj.hostname.includes('airbnb.') ? urlObj.hostname : 'www.airbnb.com';
        return `https://${baseHost}/rooms/${roomId}`;
      }

      return null;
    } catch (error) {
      console.error('Error parsing Airbnb URL:', error);
      return null;
    }
  };

  const handleAddressSubmit = () => {
    if (useAirbnbListing) {
      // Clean and validate the Airbnb URL
      const cleanedUrl = cleanAirbnbUrl(airbnbListingUrl);

      if (!cleanedUrl) {
        toast.error('Please enter a valid Airbnb listing URL (e.g., https://www.airbnb.com/rooms/12345)');
        return;
      }

      // Show the cleaned URL to the user
      if (cleanedUrl !== airbnbListingUrl) {
        setAirbnbListingUrl(cleanedUrl);
        toast.info('Your Airbnb URL has been formatted for clarity');
      }

      // In a real app, you would make an API call to get the Airbnb listing details
      // For now, we'll just simulate success
      toast.success('Airbnb listing details retrieved');

      // Extract the listing ID from the cleaned URL
      const listingId = cleanedUrl.split('/rooms/')[1];

      // Set some placeholder address data (in a real app, this would come from the API)
      setAddressData({
        street: `Airbnb Listing #${listingId}`,
        city: 'Vacation City',
        state: 'CA',
        postalCode: '90210',
        country: 'USA',
      });
    } else {
      // Validate manual address
      if (!addressData.street || !addressData.city || !addressData.state || !addressData.postalCode) {
        toast.error('Please fill in all address fields');
        return;
      }
    }

    // Move to the next step
    nextStep();
  };

  // Payment handlers
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setShowStripeForm(method === 'stripe');
  };

  const handleDamageProtectionToggle = () => {
    toggleDamageProtection();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate payment details
    if (paymentMethod === 'stripe') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
        toast.error('Please fill in all payment details');
        return;
      }

      // Basic card validation
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }

      if (cardExpiry.length < 5) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }

      if (cardCVC.length < 3) {
        toast.error('Please enter a valid CVC');
        return;
      }
    }

    try {
      setPlacingOrder(true);

      // In a real app, you would process payment with Stripe here
      // For now, we'll just simulate a successful payment

      // Generate order data (would normally be sent to the server)
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        rentalAddress: addressData,
        paymentMethod,
        taxPrice: tax,
        deliveryPrice: deliveryFee,
        damageProtection,
        damageProtectionFee,
        totalPrice: total,
        rentalStart: startDate,
        rentalEnd: endDate,
        airbnbListing: useAirbnbListing ? airbnbListingUrl : null,
      };

      // Demo mode: Instead of calling the API, simulate a successful order
      setTimeout(() => {
        // Show success message
        toast.success('Order placed successfully!');

        // Clear cart
        clearCart();

        // Generate a random order ID for demo purposes
        const demoOrderId = 'demo-' + Math.floor(Math.random() * 1000000);

        // Display order summary in console (for demo/debugging)
        console.log('Demo Order Created:', orderData);

        // Navigate to a success page
        navigate(`/confirmation/${demoOrderId}`);
      }, 1500);

    } catch (error) {
      toast.error(error.message || 'Failed to place order. Please try again.');
      setPlacingOrder(false);
    }
  };

  const formatCardNumber = (value) => {
    // Format card number with spaces after every 4 digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    // Format expiry date as MM/YY
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }

    return v;
  };

  const renderProgressBar = () => {
    return (
      <div className="booking-progress">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select Kit</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Dates</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Address</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Payment</div>
        </div>
      </div>
    );
  };

  const renderProductSelection = () => {
    return (
      <div className="booking-section">
        <h2>Select Your Kitchenware Kit</h2>
        <p className="section-description">
          Choose from our curated collections or build your own custom set.
        </p>

        {cartItems.length > 0 && (
          <div className="cart-preview">
            <h3>Currently in Your Cart</h3>
            <div className="cart-preview-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-preview-item">
                  <div className="item-image">
                    <img
                      src={getProductImageUrl(item.slug || 'default')}
                      alt={item.name}
                      onError={createImageErrorHandler('kitchen')}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.qty}</p>
                    <p className="item-price">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-message">
              <p>You can proceed with these items or add recommended products below.</p>
            </div>

            <div className="recommended-products">
              <h4>Frequently Paired Together</h4>
              <div className="recommended-items">
                {/* Damage Protection Recommendation */}
                <div className="recommended-item">
                  <div className="rec-item-image">
                    <div className="rec-icon">🛡️</div>
                  </div>
                  <div className="rec-item-details">
                    <h5>Damage Protection</h5>
                    <p>Peace of mind for your rental</p>
                    <p className="rec-item-price">+10% of rental cost</p>
                  </div>
                  <button
                    className="btn-add-recommended"
                    onClick={handleDamageProtectionToggle}
                  >
                    {damageProtection ? 'Remove' : 'Add'}
                  </button>
                </div>

                {/* Spice Collection */}
                <div className="recommended-item">
                  <div className="rec-item-image">
                    <div className="rec-icon">🌶️</div>
                  </div>
                  <div className="rec-item-details">
                    <h5>Premium Spice Collection</h5>
                    <p>30 essential spices for your cooking</p>
                    <p className="rec-item-price">$19.99</p>
                  </div>
                  <button
                    className="btn-add-recommended"
                    onClick={() => addToCart({
                      _id: 'spice-collection-123',
                      name: 'Premium Spice Collection',
                      slug: 'premium-spice-collection',
                      price: 19.99,
                      image: getProductImageUrl('premium-spice-collection')
                    }, 1)}
                  >
                    Add
                  </button>
                </div>

                {/* Chef's Knife */}
                <div className="recommended-item">
                  <div className="rec-item-image">
                    <div className="rec-icon">🔪</div>
                  </div>
                  <div className="rec-item-details">
                    <h5>Professional Chef's Knife</h5>
                    <p>8" high-carbon steel blade</p>
                    <p className="rec-item-price">$14.99</p>
                  </div>
                  <button
                    className="btn-add-recommended"
                    onClick={() => addToCart({
                      _id: 'chefs-knife-123',
                      name: 'Professional Chef\'s Knife',
                      slug: 'knife-master-collection',
                      price: 14.99,
                      image: getProductImageUrl('knife-master-collection')
                    }, 1)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="product-cards">
          {products.map((product) => (
            <div
              key={product._id}
              className={`product-card ${selectedProduct && selectedProduct._id === product._id ? 'selected' : ''}`}
              onClick={() => handleProductSelect(product)}
            >
              <div className="product-image">
                <img
                  src={getProductImageUrl(product.slug || 'default')}
                  alt={product.name}
                  onError={createImageErrorHandler('kitchen')}
                />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description?.substring(0, 100) || 'Premium kitchenware kit'}...</p>
                <div className="product-price">${(product.price || 49.99).toFixed(2)}/week</div>
              </div>
              {selectedProduct && selectedProduct._id === product._id && (
                <div className="selected-badge">✓</div>
              )}
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="form-control"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        )}

        <div className="step-buttons">
          <button
            className="btn btn-primary"
            onClick={handleProductSubmit}
            disabled={!selectedProduct && cartItems.length === 0}
          >
            Continue to Dates
          </button>
        </div>
      </div>
    );
  };

  const renderDateSelection = () => {
    return (
      <div className="booking-section">
        <h2>Select Rental Dates</h2>
        <p className="section-description">
          Choose when you want your kitchenware delivered and picked up.
        </p>

        <div className="date-picker-container">
          <div className="date-picker">
            <label>Delivery Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              className="form-control"
              dateFormat="MM/dd/yyyy"
            />
          </div>

          <div className="date-picker">
            <label>Pickup Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="form-control"
              dateFormat="MM/dd/yyyy"
            />
          </div>
        </div>

        <div className="rental-duration">
          <p>
            Rental Duration: {startDate && endDate ?
              Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0} days
          </p>
        </div>

        <div className="step-buttons">
          <button className="btn btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button className="btn btn-primary" onClick={handleDateChange}>
            Continue to Address
          </button>
        </div>
      </div>
    );
  };

  const renderAddressInput = () => {
    return (
      <div className="booking-section">
        <h2>Delivery Address</h2>
        <p className="section-description">
          Please provide the address for your vacation rental.
        </p>

        <div className="address-type-toggle">
          <div className="toggle-option">
            <input
              type="radio"
              id="manual-address"
              name="addressType"
              checked={!useAirbnbListing}
              onChange={toggleAddressType}
            />
            <label htmlFor="manual-address">Enter Address Manually</label>
          </div>

          <div className="toggle-option">
            <input
              type="radio"
              id="airbnb-listing"
              name="addressType"
              checked={useAirbnbListing}
              onChange={toggleAddressType}
            />
            <label htmlFor="airbnb-listing">Use Airbnb Listing</label>
          </div>
        </div>

        {useAirbnbListing ? (
          <div className="airbnb-form">
            <div className="form-group">
              <label htmlFor="airbnbUrl">Airbnb Listing URL</label>
              <input
                type="text"
                id="airbnbUrl"
                className="form-control"
                value={airbnbListingUrl}
                onChange={handleAirbnbUrlChange}
                placeholder="https://www.airbnb.com/rooms/12345678"
                required
              />
              <small className="helper-text">
                We support all Airbnb domains (airbnb.com, airbnb.co.uk, etc.) and will clean up any tracking parameters.
              </small>
            </div>
            <p className="helper-text">
              We'll extract the address information from your Airbnb listing to ensure accurate delivery.
            </p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                className="form-control"
                value={addressData.street}
                onChange={handleAddressChange}
                required
                placeholder="Enter street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  className="form-control"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  required
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  className="form-control"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  required
                  placeholder="Enter state"
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
                  value={addressData.postalCode}
                  onChange={handleAddressChange}
                  required
                  placeholder="Enter postal code"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  className="form-control"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  required
                >
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="MEX">Mexico</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="step-buttons">
          <button className="btn btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button className="btn btn-primary" onClick={handleAddressSubmit}>
            Continue to Payment
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentAndConfirmation = () => {
    return (
      <div className="booking-section">
        <h2>Payment & Confirmation</h2>
        <p className="section-description">
          Review your order and complete payment.
        </p>

        <div className="order-review">
          <h3>Order Details</h3>
          <div className="review-section">
            <div className="review-items">
              {cartItems.map((item) => (
                <div key={item._id} className="review-item">
                  <div className="item-image">
                    <img
                      src={getProductImageUrl(item.slug || 'default')}
                      alt={item.name}
                      onError={createImageErrorHandler('kitchen')}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-quantity">Quantity: {item.qty}</p>
                    <p className="item-price">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="review-section">
            <h3>Rental Period</h3>
            <p>
              <strong>Delivery:</strong> {startDate?.toLocaleDateString()}
            </p>
            <p>
              <strong>Pickup:</strong> {endDate?.toLocaleDateString()}
            </p>
            <p>
              <strong>Duration:</strong> {startDate && endDate ?
                Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0} days
            </p>
          </div>

          <div className="review-section">
            <h3>Delivery Address</h3>
            {useAirbnbListing ? (
              <p>Using Airbnb listing: {airbnbListingUrl}</p>
            ) : (
              <>
                <p>{addressData.street}</p>
                <p>{addressData.city}, {addressData.state} {addressData.postalCode}</p>
                <p>{addressData.country}</p>
              </>
            )}
          </div>

          <div className="review-section">
            <h3>Additional Options</h3>
            <div className="damage-protection-option">
              <input
                type="checkbox"
                id="damageProtection"
                checked={damageProtection}
                onChange={handleDamageProtectionToggle}
              />
              <label htmlFor="damageProtection">
                Damage Protection (+10% of rental cost)
              </label>
              <p className="option-description">
                Add damage protection to cover accidental damage to kitchenware during your rental period.
              </p>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            <div className="payment-method">
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={() => handlePaymentMethodChange('stripe')}
              />
              <label htmlFor="stripe" className="payment-label">
                Credit Card
                <span className="payment-icons">
                  💳
                </span>
              </label>
            </div>

            <div className="payment-method">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => handlePaymentMethodChange('paypal')}
              />
              <label htmlFor="paypal" className="payment-label">
                PayPal
                <span className="payment-icons">
                  💰
                </span>
              </label>
            </div>
          </div>

          {showStripeForm && (
            <div className="stripe-form">
              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  className="form-control"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Enter name on card"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  className="form-control"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiration Date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    className="form-control"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cardCVC">CVC</label>
                  <input
                    type="text"
                    id="cardCVC"
                    className="form-control"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
                    placeholder="000"
                    maxLength="4"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="order-total">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {damageProtection && (
            <div className="total-row">
              <span>Damage Protection:</span>
              <span>${damageProtectionFee.toFixed(2)}</span>
            </div>
          )}
          <div className="total-row">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="total-row grand-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="step-buttons">
          <button className="btn btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderProductSelection();
      case 2:
        return renderDateSelection();
      case 3:
        return renderAddressInput();
      case 4:
        return renderPaymentAndConfirmation();
      default:
        return renderProductSelection();
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Book Your Kitchenware</h1>

        {renderProgressBar()}

        <div className="booking-container">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;