import React from 'react';
import './CategorySidebar.css';

const CategorySidebar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="category-sidebar">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-list">
        <h3>Categories</h3>
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              <button
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(category.id)}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategorySidebar;