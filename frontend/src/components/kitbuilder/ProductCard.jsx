import React from 'react';
import { getProductImageUrl } from '../../utils/imageUtils';
import './ProductCard.css';

const ProductCard = ({ product, onAddToKit, isInKit }) => {
  // Format price display
  const price = product.individualRentalPrice || product.price;

  // Get category display name
  const getCategoryName = (category) => {
    const categoryNames = {
      knife: 'Knife',
      pan: 'Pan',
      pot: 'Pot',
      utensil: 'Utensil',
      bakeware: 'Bakeware',
      appliance: 'Appliance',
      storage: 'Storage',
      other: 'Other',
    };

    return categoryNames[category] || category;
  };

  // Helper to get image URL with fallback
  return (
    <div className={`kit-product-card ${isInKit ? 'in-kit' : ''}`}>
      <div className="product-image-container">
        <img
          src={getProductImageUrl(product.slug || product.kitCategory)}
          alt={product.name}
          className="product-image"
        />
        {product.isEssential && (
          <span className="essential-badge">Essential</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-category">
          {getCategoryName(product.kitCategory)}
        </div>
        <div className="product-price">
          ${price.toFixed(2)}
        </div>
      </div>

      <button
        className={`add-to-kit-btn ${isInKit ? 'in-kit' : ''}`}
        onClick={onAddToKit}
        disabled={isInKit}
      >
        {isInKit ? 'Added to Kit' : 'Add to Kit'}
      </button>
    </div>
  );
};

export default ProductCard;
