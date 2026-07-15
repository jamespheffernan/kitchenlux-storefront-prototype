import React from 'react';
import './KitSummary.css';

const KitSummary = ({
  kitName,
  onKitNameChange,
  items,
  onRemoveItem,
  onQuantityChange,
  itemCount,
  basePrice,
  discountPercentage,
  totalPrice,
  totalWeight,
  totalDeposit,
  onSave,
  onAddToCart,
  isEditMode,
  validationErrors,
}) => {
  return (
    <div className="kit-summary">
      <div className="kit-summary-header">
        <h2>Your Custom Kit</h2>
        <div className="kit-name-container">
          <input
            type="text"
            value={kitName}
            onChange={(e) => onKitNameChange(e.target.value)}
            placeholder="Enter kit name"
            className="kit-name-input"
            maxLength={50}
          />
        </div>
      </div>

      <div className="kit-items-container">
        {items.length === 0 ? (
          <div className="empty-kit">
            <p>Your kit is empty. Add items from the products list.</p>
          </div>
        ) : (
          <div className="kit-items-list">
            {items.map((item) => (
              <div className="kit-item" key={item.product}>
                <div className="kit-item-image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="kit-item-image"
                  />
                </div>
                <div className="kit-item-details">
                  <h4 className="kit-item-name">{item.name}</h4>
                  <div className="kit-item-category">{item.category}</div>
                  <div className="kit-item-price">${item.price.toFixed(2)}</div>
                </div>
                <div className="kit-item-actions">
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => onQuantityChange(item.product, Math.max(1, item.quantity - 1))}
                    >
                      –
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => onQuantityChange(item.product, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => onRemoveItem(item.product)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="kit-summary-footer">
        <div className="kit-stats">
          <div className="kit-stat">
            <span className="stat-label">Items:</span>
            <span className="stat-value">{itemCount}</span>
          </div>
          <div className="kit-stat">
            <span className="stat-label">Base price:</span>
            <span className="stat-value">${basePrice.toFixed(2)}</span>
          </div>
          {discountPercentage > 0 && (
            <div className="kit-stat discount">
              <span className="stat-label">Volume discount:</span>
              <span className="stat-value">-{discountPercentage}%</span>
            </div>
          )}
          <div className="kit-stat total">
            <span className="stat-label">Total price:</span>
            <span className="stat-value">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="kit-stat">
            <span className="stat-label">Security deposit:</span>
            <span className="stat-value">${totalDeposit.toFixed(2)}</span>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="validation-errors">
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="kit-actions">
          <button
            className="btn btn-outline"
            onClick={onSave}
            disabled={items.length === 0}
          >
            {isEditMode ? 'Update Kit' : 'Save Kit'}
          </button>
          <button
            className="btn"
            onClick={onAddToCart}
            disabled={items.length === 0 || validationErrors.length > 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitSummary;