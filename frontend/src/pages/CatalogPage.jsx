import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import './CatalogPage.css';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(keyword);

  useEffect(() => {
    // Update the URL when category changes
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory) {
      newParams.set('category', selectedCategory);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  }, [selectedCategory, searchParams, setSearchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('keyword', searchTerm);
    } else {
      newParams.delete('keyword');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Our Premium Kitchenware Collections</h1>
          <p className="page-subtitle">
            Explore our curated collections of professional-grade kitchenware for your vacation rental.
          </p>
        </div>

        <div className="catalog-filters">
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn">Search</button>
            </form>
          </div>

          <div className="category-filters">
            <button
              className={`category-filter ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All Collections
            </button>
            <button
              className={`category-filter ${selectedCategory === 'Essential' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Essential')}
            >
              Essential
            </button>
            <button
              className={`category-filter ${selectedCategory === 'Chef' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Chef')}
            >
              Chef's
            </button>
            <button
              className={`category-filter ${selectedCategory === 'Specialty' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Specialty')}
            >
              Specialty
            </button>
          </div>
        </div>

        {keyword && (
          <div className="search-results-info">
            <p>Search results for: <strong>{keyword}</strong></p>
            <button
              className="clear-search"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('keyword');
                setSearchParams(newParams);
                setSearchTerm('');
              }}
            >
              Clear Search
            </button>
          </div>
        )}

        <ProductList keyword={keyword} category={selectedCategory} />

        <div className="catalog-info">
          <h2>Premium Kitchenware for Your Vacation Rental</h2>
          <p>
            At KitchenLux, we understand that cooking in a vacation rental can be frustrating when
            you're stuck with dull knives, flimsy pans, and inadequate tools. That's why we've
            created a service that delivers high-quality kitchenware directly to your vacation
            destination, so you can enjoy cooking just like you would at home.
          </p>
          <p>
            Each collection is carefully curated to provide everything you need for specific cooking
            styles and needs. From our Essential Kitchen Kit that covers the basics to specialized
            collections for BBQ, Italian cuisine, or holiday cooking, we have the perfect kitchenware
            set for your vacation.
          </p>
          <p>
            All items are professionally cleaned, sanitized, and delivered in a secure case.
            When your stay is over, simply leave everything for pickup - no cleaning or return
            shipping required!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;