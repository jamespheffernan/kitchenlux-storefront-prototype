import React, { useState, useEffect } from 'react';
import { getProducts } from '../../api';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = ({ keyword = '', category = '' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(keyword, page, category);
        setProducts(data.products);
        setPages(data.pages);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    loadProducts();
  }, [keyword, page, category]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No products found.</div>;
  }

  return (
    <div className="product-list-container">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>

          <div className="pagination-pages">
            {[...Array(pages).keys()].map((p) => (
              <button
                key={p + 1}
                className={`pagination-number ${page === p + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(p + 1)}
              >
                {p + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            disabled={page === pages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;