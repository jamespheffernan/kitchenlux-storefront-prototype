import React from 'react';
import './Paginate.css';

const Paginate = ({ pages, page, onChange, className = '' }) => {
  if (pages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show max 5 page numbers

    if (pages <= maxPagesToShow) {
      // If total pages is less than maxPagesToShow, show all pages
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Current page and surrounding pages
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(pages - 1, page + 1);

      // Adjust if we're near the beginning
      if (page <= 3) {
        endPage = Math.min(pages - 1, 4);
      }

      // Adjust if we're near the end
      if (page >= pages - 2) {
        startPage = Math.max(2, pages - 3);
      }

      // Add dots after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add dots before last page if needed
      if (endPage < pages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(pages);
    }

    return pageNumbers;
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== '...' && pageNumber !== page) {
      onChange(pageNumber);
    }
  };

  return (
    <div className={`pagination ${className}`}>
      <button
        className="pagination-prev"
        disabled={page === 1}
        onClick={() => handlePageClick(page - 1)}
      >
        &laquo; Prev
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            className={`pagination-number ${
              pageNumber === page ? 'active' : ''
            } ${pageNumber === '...' ? 'dots' : ''}`}
            onClick={() => handlePageClick(pageNumber)}
            disabled={pageNumber === '...'}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        className="pagination-next"
        disabled={page === pages}
        onClick={() => handlePageClick(page + 1)}
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Paginate;