import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { getMyKits, deleteKit, addKitToCart } from '../api';
import './ProfilePage.css'; // Reuse profile page styles
import './MyKits.css'; // Kit-specific styles

const MyKitsPage = () => {
  const { isAuthenticated } = useAuth();
  const { addCustomKitToCart } = useCart();
  const navigate = useNavigate();

  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user's kits
  useEffect(() => {
    const fetchKits = async () => {
      try {
        setLoading(true);
        const data = await getMyKits();
        setKits(data);
      } catch (err) {
        setError(err.message || 'Failed to load your kits');
        toast.error('Failed to load your kits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchKits();
    } else {
      navigate('/login?redirect=/my-kits');
    }
  }, [isAuthenticated, navigate]);

  // Handle deleting a kit
  const handleDeleteKit = async (kitId) => {
    if (!window.confirm('Are you sure you want to delete this kit?')) {
      return;
    }

    try {
      await deleteKit(kitId);
      setKits(kits.filter(kit => kit._id !== kitId));
      toast.success('Kit deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete kit');
    }
  };

  // Handle adding a kit to cart
  const handleAddToCart = async (kitId) => {
    try {
      setLoading(true);
      const cartItem = await addKitToCart(kitId);
      addCustomKitToCart(cartItem);
      toast.success('Kit added to cart');
      navigate('/cart');
    } catch (err) {
      toast.error(err.message || 'Failed to add kit to cart');
    } finally {
      setLoading(false);
    }
  };

  // Calculate kit category distribution
  const getKitCategories = (kit) => {
    const categories = kit.items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.quantity;
      return acc;
    }, {});

    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => {
        const displayName = {
          knife: 'Knives',
          pan: 'Pans',
          pot: 'Pots',
          utensil: 'Utensils',
          bakeware: 'Bakeware',
          appliance: 'Appliances',
          storage: 'Storage',
          other: 'Other',
        }[category] || category;

        return `${displayName} (${count})`;
      });
  };

  return (
    <div className="profile-container">
      <div className="page-header">
        <h1>My Custom Kits</h1>
        <p>View, edit, and manage your saved kitchenware collections</p>
        <Link to="/build-kit" className="btn">Create New Kit</Link>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : kits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍳</div>
          <h2>No Custom Kits Yet</h2>
          <p>
            Create your first custom kitchenware collection tailored to your vacation rental needs.
          </p>
          <Link to="/build-kit" className="btn">Build Your First Kit</Link>
        </div>
      ) : (
        <div className="kits-grid">
          {kits.map(kit => (
            <div className="kit-card" key={kit._id}>
              <div className="kit-header">
                <h2>{kit.name}</h2>
                <span className="item-count">
                  {kit.itemCount} {kit.itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="kit-preview">
                {kit.items.slice(0, 4).map((item, index) => (
                  <div className="kit-item-preview" key={index}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="kit-item-image"
                    />
                    {kit.items.length > 4 && index === 3 && (
                      <div className="more-items">
                        +{kit.items.length - 4} more
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="kit-details">
                <div className="kit-price">
                  <span className="price-label">Total:</span>
                  <span className="price-value">${kit.totalPrice.toFixed(2)}</span>
                  {kit.discountPercentage > 0 && (
                    <span className="kit-discount">
                      {kit.discountPercentage}% volume discount applied
                    </span>
                  )}
                </div>

                <div className="kit-categories">
                  <span className="categories-label">Includes:</span>
                  <span className="categories-list">
                    {getKitCategories(kit).join(', ')}
                  </span>
                </div>

                <div className="kit-date">
                  Last modified: {new Date(kit.lastModified).toLocaleDateString()}
                </div>
              </div>

              <div className="kit-actions">
                <Link to={`/build-kit/${kit._id}`} className="btn btn-sm btn-outline">
                  Edit
                </Link>
                <button
                  className="btn btn-sm"
                  onClick={() => handleAddToCart(kit._id)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-icon delete-btn"
                  onClick={() => handleDeleteKit(kit._id)}
                  title="Delete Kit"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyKitsPage;