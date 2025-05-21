import React from "react";
import { FaFilter, FaTimes, FaSearch } from "react-icons/fa";

/**
 * Header component for the browse page with title, search form and filter toggle
 */
const BrowseHeader = ({ 
  title, 
  searchQuery, 
  showFilters, 
  toggleFilters, 
  handleSearch 
}) => {
  return (
    <div className="browse-header">
      <div className="browse-title-section">
        <h1>{title}</h1>
        <button className="filter-toggle-btn" onClick={toggleFilters}>
          {showFilters ? <FaTimes /> : <FaFilter />}
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      
      {/* Search form */}
      <form className="browse-search" onSubmit={handleSearch}>
        <input 
          type="text" 
          name="searchQuery"
          placeholder="Search for movies and TV shows" 
          defaultValue={searchQuery}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default BrowseHeader;