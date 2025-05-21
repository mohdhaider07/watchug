import React from "react";
import MovieCard from "../common/MovieCard";
import Loader from "../common/Loader";

/**
 * Component to display search/browse results with loading and error states
 */
const BrowseResults = ({ 
  loading, 
  error, 
  items, 
  fetchContent,
  contentType 
}) => {
  if (loading) {
    return (
      <div className="browse-loading">
        <Loader size="lg" text="Loading content..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="browse-error">
        <p>{error}</p>
        <button 
          className="filter-toggle-btn" 
          onClick={fetchContent}
          style={{ margin: '1rem auto', display: 'block' }}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="browse-no-results">
        <h2>No results found</h2>
        <p>Try adjusting your filters or search query</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="browse-results-info" style={{ marginBottom: '1rem', color: '#d1d5db' }}>
        <p>Showing {items.length} results</p>
      </div>
      <div className="browse-grid">
        {items.map(item => {
          // Handle different formats between movie and TV show objects
          const mediaType = item.media_type || (contentType === "tvshows" ? "tv" : "movie");
          const id = item.id;
          const title = mediaType === "tv" ? item.name : item.title;
          const releaseDate = mediaType === "tv" ? item.first_air_date : item.release_date;
          const rating = item.vote_average;
          
          // Generate duration for consistency with other parts of the app
          const minutes = Math.floor(Math.random() * 90) + 90; // 90 to 180 minutes
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          const randomDuration = `${hours}h ${remainingMinutes}m`;
          
          // Format the year and duration for the meta display
          const year = releaseDate ? releaseDate.split("-")[0] : "";
          const meta = `${year} • ${randomDuration}`;
          
          // Determine quality badge based on rating
          const quality = parseFloat(rating) > 7.5 ? "4K" : "HD";
          
          return (
            <MovieCard
              key={`${mediaType}-${id}`}
              id={id}
              title={title}
              image={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/placeholder-poster.jpg"}
              rating={rating ? rating.toFixed(1) : "N/A"}
              quality={quality}
              meta={meta}
              genre={mediaType === "tv" ? "TV Series" : "Movie"}
              mediaType={mediaType}
            />
          );
        })}
      </div>
    </>
  );
};

export default BrowseResults;