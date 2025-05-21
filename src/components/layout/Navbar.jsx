import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Navbar.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import request, { getImageUrl } from "../../requestMethod";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const navigate = useNavigate();

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle search input visibility
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  // Search for movies
  useEffect(() => {
    // Don't search if query is empty or too short
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    // Debounce search requests
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await request.get("/search/multi", {
          params: { query: searchQuery }
        });
        
        // Format and limit results
        const results = response.data.results
          .filter(item => item.media_type === "movie" || item.media_type === "tv")
          .slice(0, 5)
          .map(item => {
            const isTV = item.media_type === "tv";
            return {
              id: item.id,
              title: isTV ? item.name : item.title,
              image: getImageUrl(item.poster_path),
              year: isTV 
                ? (item.first_air_date ? item.first_air_date.split('-')[0] : '') 
                : (item.release_date ? item.release_date.split('-')[0] : ''),
              mediaType: item.media_type
            };
          });
        
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title">watchug</Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/browse">Browse</Link></li>
          <li><Link to="/browse?type=popular">Popular</Link></li>
          <li><Link to="/browse?type=movies">Movies</Link></li>
          <li><Link to="/browse?type=tvshows">TV Shows</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="navbar-search-container">
          <form onSubmit={handleSearchSubmit} ref={searchInputRef}>
            {showSearch && (
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search for movies & TV shows..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            )}
            <button 
              type={showSearch ? "submit" : "button"}
              className={`navbar-search ${showSearch ? 'active' : ''}`} 
              onClick={showSearch ? handleSearchSubmit : toggleSearch}
            >
              {showSearch ? <FaTimes /> : <FaSearch />}
            </button>
          </form>
          
          {/* Search Results Dropdown */}
          {showSearch && searchResults.length > 0 && (
            <div className="search-results" ref={searchResultsRef}>
              {searchResults.map(item => (
                <Link 
                  to={`/${item.mediaType}/${item.id}`}
                  key={`${item.mediaType}-${item.id}`} 
                  className="search-result-item"
                  onClick={() => setShowSearch(false)}
                >
                  <div className="search-result-img">
                    <img src={item.image || '/placeholder-poster.jpg'} alt={item.title} />
                  </div>
                  <div className="search-result-info">
                    <h4>{item.title}</h4>
                    <span>{item.year} • {item.mediaType === "tv" ? "TV Show" : "Movie"}</span>
                  </div>
                </Link>
              ))}
              
              <div className="search-results-footer">
                <button 
                  className="search-view-all"
                  onClick={() => {
                    navigate(`/browse?query=${encodeURIComponent(searchQuery)}`);
                    setShowSearch(false);
                  }}
                >
                  View all results
                </button>
              </div>
            </div>
          )}
          
          {/* Loading indicator */}
          {showSearch && loading && (
            <div className="search-loading">Loading...</div>
          )}
          
          {/* No results message */}
          {showSearch && searchQuery.length > 1 && !loading && searchResults.length === 0 && (
            <div className="search-no-results">No results found</div>
          )}
        </div>
        <a href="#" className="navbar-signin">Sign in</a>
        <a href="#" className="navbar-signup">Sign up</a>
      </div>
    </nav>
  );
};

export default Navbar;