import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { getProductImageUrl, createImageErrorHandler } from '../../utils/imageUtils';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { userInfo, isAuthenticated, logoutUser } = useContext(AuthContext);
  const { cartItems, itemCount, removeFromCart, total } = useContext(CartContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCart = () => setCartOpen(!cartOpen);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.menu-container')) {
        setMenuOpen(false);
      }
      if (cartOpen && !event.target.closest('.cart-dropdown') && !event.target.closest('.cart-icon')) {
        setCartOpen(false);
      }
    };

    // Handle both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen, cartOpen]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <nav>
          <Link to="/" className="logo">
            Kitchen<span>Lux</span>
          </Link>

          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/catalog" onClick={() => setMenuOpen(false)}>Collections</Link>
            <Link to="/build-kit" onClick={() => setMenuOpen(false)}>Build Your Kit</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>

          <div className="nav-actions">
            <div className="cart-icon" onClick={toggleCart}>
              <span>🛍️</span>
              {itemCount > 0 && <div className="cart-count">{itemCount}</div>}
            </div>

            {isAuthenticated ? (
              <div className="user-menu-container">
                <button className="user-menu-button">
                  {userInfo?.name?.split(' ')[0]}
                </button>
                <div className="user-dropdown">
                  <Link to="/profile">My Profile</Link>
                  <Link to="/my-kits">My Custom Kits</Link>
                  {userInfo?.isAdmin && <Link to="/admin/dashboard">Admin Dashboard</Link>}
                  {userInfo?.isHost && <Link to="/host-dashboard">Host Dashboard</Link>}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn">Login</Link>
            )}

            <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </div>

      {/* Cart Dropdown */}
      <div className={`cart-dropdown ${cartOpen ? 'active' : ''}`}>
        <h3>Your Cart</h3>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={getProductImageUrl(item.slug || 'default')}
                      alt={item.name}
                      onError={createImageErrorHandler('kitchen')}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)} × {item.qty}</p>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
              ))}
              <div className="cart-total">
                <p>Total: <span>${total.toFixed(2)}</span></p>
              </div>
            </>
          )}
        </div>
        <div className="cart-actions">
          <Link to="/cart" className="btn btn-outline" onClick={() => setCartOpen(false)}>View Cart</Link>
          <Link to="/booking" className="btn" onClick={() => setCartOpen(false)}>Checkout</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;