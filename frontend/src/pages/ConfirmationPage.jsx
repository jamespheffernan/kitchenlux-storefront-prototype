import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getOrderDetails } from '../api';
import { format } from 'date-fns';
import { getProductImageUrl, createImageErrorHandler } from '../utils/imageUtils';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if this is a demo order ID
    const isDemoOrder = id.startsWith('demo-');

    if (isDemoOrder) {
      // Create a demo order object for display purposes
      const demoOrder = {
        _id: id,
        user: { email: 'demo@example.com' },
        orderItems: [
          {
            _id: 'demo-item-1',
            name: 'Essential Kitchen Kit',
            qty: 1,
            price: 49.99,
            image: '/images/premium-kitchenware.jpg',
            slug: 'essential-kit'
          },
          {
            _id: 'demo-item-2',
            name: 'Premium Spice Collection',
            qty: 1,
            price: 19.99,
            image: '/images/spice-collection.jpg',
            slug: 'premium-spice-collection'
          }
        ],
        rentalAddress: {
          street: '123 Demo Street',
          city: 'Example City',
          state: 'CA',
          postalCode: '90210',
          country: 'USA'
        },
        paymentMethod: 'stripe',
        taxPrice: 5.78,
        deliveryPrice: 15.00,
        damageProtection: true,
        damageProtectionPrice: 7.00,
        totalPrice: 97.76,
        rentalStart: new Date(),
        rentalEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isPaid: true,
        paidAt: new Date(),
        status: 'confirmed'
      };

      setOrder(demoOrder);
      setLoading(false);
    } else {
      // This is a real order, fetch from API
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const data = await getOrderDetails(id);
          setOrder(data);
          setLoading(false);
        } catch (error) {
          setError(error.message || 'Failed to load order details');
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return (
      <div className="confirmation-page">
        <div className="container">
          <div className="confirmation-error">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/" className="btn">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="container">
          <div className="confirmation-error">
            <h2>Order Not Found</h2>
            <p>Sorry, we couldn't find the order you're looking for.</p>
            <Link to="/" className="btn">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-content">
          <div className="confirmation-header">
            <div className="success-icon">✓</div>
            <h1>Your Order is Confirmed!</h1>
            <p className="order-number">Order #: {order._id}</p>
            <p className="confirmation-message">
              Thank you for your order. We've sent a confirmation email to {order.user.email}.
            </p>
          </div>

          <div className="confirmation-details">
            <div className="confirmation-section">
              <h2>Order Details</h2>

              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="order-item">
                    <div className="item-image">
                      <img
                        src={getProductImageUrl(item.slug || 'default')}
                        alt={item.name}
                        onError={createImageErrorHandler('kitchen')}
                      />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="item-quantity">Qty: {item.qty}</div>
                      <div className="item-price">${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${order.totalPrice - order.taxPrice - order.deliveryPrice - (order.damageProtectionPrice || 0)}</span>
                </div>
                {order.damageProtection && (
                  <div className="summary-row">
                    <span>Damage Protection</span>
                    <span>${order.damageProtectionPrice?.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>${order.deliveryPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h2>Delivery Information</h2>

              <div className="delivery-info">
                <div className="info-row">
                  <span className="info-label">Address:</span>
                  <span className="info-value">
                    {order.rentalAddress.street}, {order.rentalAddress.city}, {order.rentalAddress.state} {order.rentalAddress.postalCode}, {order.rentalAddress.country}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Rental Period:</span>
                  <span className="info-value">
                    {format(new Date(order.rentalStart), 'MMMM d, yyyy')} - {format(new Date(order.rentalEnd), 'MMMM d, yyyy')}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className="info-value status-badge">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h2>Payment Information</h2>

              <div className="payment-info">
                <div className="info-row">
                  <span className="info-label">Method:</span>
                  <span className="info-value">
                    {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className={`info-value status-badge ${order.isPaid ? 'status-paid' : 'status-pending'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>

                {order.isPaid && (
                  <div className="info-row">
                    <span className="info-label">Paid On:</span>
                    <span className="info-value">
                      {format(new Date(order.paidAt), 'MMMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="confirmation-footer">
            <p>
              Thank you for choosing KitchenLux for your premium kitchenware rental needs. We'll process your order and deliver your kitchenware before your rental start date.
            </p>
            <div className="confirmation-actions">
              <Link to="/profile" className="btn btn-outline">View My Orders</Link>
              <Link to="/" className="btn">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;