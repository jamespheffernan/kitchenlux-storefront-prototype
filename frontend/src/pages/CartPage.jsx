import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useReferral } from '../context/ReferralContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReferralCodeInput from '../components/checkout/ReferralCodeInput';
import './CartPage.css';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    rentalDates,
    setRentalPeriod,
    damageProtection,
    toggleDamageProtection,
    subtotal,
    damageProtectionFee,
    deliveryFee,
    tax,
    total,
    rentalDays
  } = useContext(CartContext);

  const { isAuthenticated } = useContext(AuthContext);
  const { referralDiscount } = useReferral();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(rentalDates.start || null);
  const [endDate, setEndDate] = useState(rentalDates.end || null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setRentalPeriod(date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setRentalPeriod(startDate, date);
  };

  // Calculate discount amount when subtotal or referral discount percentage changes
  useEffect(() => {
    if (referralDiscount && subtotal) {
      setDiscountAmount((subtotal * (referralDiscount / 100)).toFixed(2) * 1);
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, referralDiscount]);

  // Calculate total with discount
  const discountedTotal = total - discountAmount;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=booking');
    } else if (!startDate || !endDate) {
      alert('Please select rental dates');
    } else {
      navigate('/booking');
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart-container">
            <div className="empty-cart">
              <div className="empty-cart-icon">🛍️</div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <Link to="/catalog" className="btn">Browse Collections</Link>
            </div>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items-container">
              <div className="cart-header">
                <span className="cart-header-product">Product</span>
                <span className="cart-header-price">Price</span>
                <span className="cart-header-quantity">Quantity</span>
                <span className="cart-header-total">Total</span>
                <span className="cart-header-remove"></span>
              </div>

              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-product">
                    <div className="cart-item-image">
                      <img
                        src={item.image.startsWith('http') ? item.image : `${item.image}`}
                        alt={item.name}
                      />
                    </div>
                    <div className="cart-item-details">
                      <Link to={`/products/${item.slug || item._id}`} className="cart-item-name">
                        {item.name}
                      </Link>
                      <div className="cart-item-category">{item.category}</div>
                    </div>
                  </div>

                  <div className="cart-item-price" data-label="Price:">${item.price.toFixed(2)}/week</div>

                  <div className="cart-item-quantity" data-label="Quantity:">
                    <div className="quantity-selector">
                      <button
                        onClick={() => updateQuantity(item._id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.qty + 1)}
                        disabled={item.qty >= item.countInStock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total" data-label="Total:">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>

                  <div className="cart-item-remove">
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-actions">
                <Link to="/catalog" className="btn btn-outline">Continue Shopping</Link>
                <button className="btn btn-clear" onClick={clearCart}>Clear Cart</button>
              </div>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="rental-dates">
                <h3>Rental Period</h3>
                <div className="datepicker-container">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      minDate={new Date()}
                      placeholderText="Select start date"
                      className="form-control"
                      dateFormat="MMMM d, yyyy"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || new Date()}
                      placeholderText="Select end date"
                      className="form-control"
                      dateFormat="MMMM d, yyyy"
                      required
                    />
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="rental-duration">
                    <div className="rental-days">
                      <span>Rental Duration:</span>
                      <span className="days-count">{rentalDays} days</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="damage-protection">
                <div className="damage-protection-header">
                  <label htmlFor="damageProtection" className="damage-protection-label">
                    <input
                      type="checkbox"
                      id="damageProtection"
                      checked={damageProtection}
                      onChange={toggleDamageProtection}
                    />
                    <span className="checkbox-label">Add Damage Protection</span>
                  </label>
                  <span className="damage-protection-price">
                    ${damageProtectionFee.toFixed(2)}
                  </span>
                </div>
                <p className="damage-protection-info">
                  Protect yourself against accidental damage to the rented items for just 10% of the rental cost.
                </p>
              </div>

              {/* Referral Code Input */}
              <ReferralCodeInput />

              <div className="cart-totals">
                <div className="cart-total-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {damageProtection && (
                  <div className="cart-total-row">
                    <span>Damage Protection</span>
                    <span>${damageProtectionFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-total-row">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="cart-total-row discount">
                    <span>Referral Discount ({referralDiscount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="cart-total-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="cart-total-row total">
                  <span>Total</span>
                  <span>${discountedTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn btn-checkout"
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || !startDate || !endDate}
              >
                {!startDate || !endDate
                  ? 'Select Dates to Continue'
                  : isAuthenticated
                    ? 'Proceed to Checkout'
                    : 'Login to Checkout'
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;