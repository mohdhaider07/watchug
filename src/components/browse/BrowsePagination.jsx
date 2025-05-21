import React from "react";

/**
 * Pagination component for browse results
 */
const BrowsePagination = ({ page, totalPages, setPage }) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  return (
    <div className="browse-pagination">
      <button 
        disabled={page === 1}
        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button 
        disabled={page === totalPages}
        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
      >
        Next
      </button>
    </div>
  );
};

export default BrowsePagination;