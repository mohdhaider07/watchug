import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * Enhanced pagination component for browse results with improved UI
 */
const BrowsePagination = ({ page, totalPages, setPage }) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  // Generate pagination numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Add ellipsis if there are more than 5 pages and we're not at the beginning
    if (page > 3) {
      pages.push('ellipsis');
    }
    
    // Add pages around current page
    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if there are more than 5 pages and we're not at the end
    if (page < totalPages - 2) {
      pages.push('ellipsis');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    // Scroll to top of results when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(newPage);
  };

  return (
    <div className="browse-pagination">
      <button 
        className="page-btn"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>
      
      <div className="page-numbers">
        {getPageNumbers().map((pageNumber, index) => 
          pageNumber === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
          ) : (
            <button
              key={pageNumber}
              className={`page-btn ${pageNumber === page ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
              disabled={pageNumber === page}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === page ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
      
      <button 
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default BrowsePagination;