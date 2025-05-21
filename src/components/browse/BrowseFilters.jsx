import React from "react";

/**
 * Filters component for the browse page
 */
const BrowseFilters = ({ 
  showFilters,
  contentType,
  genres,
  selectedGenres,
  selectedYear,
  sortBy,
  years,
  handleContentTypeChange,
  handleGenreChange,
  handleYearChange,
  handleSortChange,
  handleClearFilters
}) => {
  return (
    <div className={`filters-container ${showFilters ? 'show' : ''}`}>
      <div className="filters">
        <div className="filter-section">
          <h3>Content Type</h3>
          <div className="filter-options">
            <button 
              className={contentType === "all" ? "active" : ""}
              onClick={() => handleContentTypeChange("all")}
            >
              All
            </button>
            <button 
              className={contentType === "popular" ? "active" : ""}
              onClick={() => handleContentTypeChange("popular")}
            >
              Popular
            </button>
            <button 
              className={contentType === "movies" ? "active" : ""}
              onClick={() => handleContentTypeChange("movies")}
            >
              Movies
            </button>
            <button 
              className={contentType === "tvshows" ? "active" : ""}
              onClick={() => handleContentTypeChange("tvshows")}
            >
              TV Shows
            </button>
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Genre</h3>
          <div className="filter-options filter-genre">
            {genres.map(genre => (
              <button 
                key={genre.id}
                className={selectedGenres.includes(genre.id) ? "active" : ""}
                onClick={() => handleGenreChange(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Year</h3>
          <div className="filter-options">
            <select 
              value={selectedYear} 
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Sort By</h3>
          <div className="filter-options">
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="popularity.desc">Popularity (High to Low)</option>
              <option value="popularity.asc">Popularity (Low to High)</option>
              <option value="vote_average.desc">Rating (High to Low)</option>
              <option value="vote_average.asc">Rating (Low to High)</option>
              <option value="primary_release_date.desc">Release Date (Newest)</option>
              <option value="primary_release_date.asc">Release Date (Oldest)</option>
              {contentType === "tvshows" && (
                <>
                  <option value="first_air_date.desc">First Air Date (Newest)</option>
                  <option value="first_air_date.asc">First Air Date (Oldest)</option>
                </>
              )}
            </select>
          </div>
        </div>
        
        <div className="filter-actions">
          <button 
            className="clear-filters-btn"
            onClick={handleClearFilters}
            disabled={selectedGenres.length === 0 && !selectedYear && sortBy === "popularity.desc"}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseFilters;