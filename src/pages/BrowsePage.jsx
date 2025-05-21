import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/BrowsePage.css";
import MovieCard from "../components/common/MovieCard";
import Loader from "../components/common/Loader";
import Footer from "../components/layout/Footer";
import request, { getImageUrl } from "../requestMethod";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const BrowsePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Get content type from URL or default to 'popular'
  const [contentType, setContentType] = useState(searchParams.get("type") || "popular");
  
  // Content states
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    genre: searchParams.get("genre") || "",
    year: searchParams.get("year") || "",
    sort: searchParams.get("sort") || "popularity.desc",
    query: searchParams.get("query") || "",
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);

  // Generate years (current year to 1990)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsList = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
    setYears(yearsList);
  }, []);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const mediaType = contentType === "tvshows" ? "tv" : "movie";
        const response = await request.get(`/genre/${mediaType}/list`);
        setGenres(response.data.genres);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    
    fetchGenres();
  }, [contentType]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("type", contentType);
    if (filters.genre) params.set("genre", filters.genre);
    if (filters.year) params.set("year", filters.year);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.query) params.set("query", filters.query);
    if (page > 1) params.set("page", page);
    
    navigate(`/browse?${params.toString()}`, { replace: true });
  }, [contentType, filters, page, navigate]);

  // Fetch content based on content type and filters
  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint;
      let params = { page };

      // Handle search query
      if (filters.query) {
        endpoint = "/search/multi";
        params.query = filters.query;
      } else {
        // Determine endpoint based on content type
        switch (contentType) {
          case "popular":
            endpoint = "/movie/popular";
            break;
          case "movies":
            endpoint = "/discover/movie";
            break;
          case "tvshows":
            endpoint = "/discover/tv";
            break;
          default:
            endpoint = "/movie/popular";
        }
        
        // Add filters to params
        if (filters.genre) params.with_genres = filters.genre;
        if (filters.year) {
          if (contentType === "tvshows") {
            params.first_air_date_year = filters.year;
          } else {
            params.primary_release_year = filters.year;
          }
        }
        if (filters.sort) params.sort_by = filters.sort;
      }

      const response = await request.get(endpoint, { params });
      
      const isTvShow = contentType === "tvshows" || 
                      (filters.query && response.data.results.some(item => item.media_type === "tv"));
      
      // Format content
      const formattedContent = response.data.results
        .filter(item => {
          if (filters.query) {
            return item.media_type === "movie" || item.media_type === "tv";
          }
          return true;
        })
        .map(item => {
          // Determine if it's a TV show
          const isTV = isTvShow || item.media_type === "tv";
          
          // Generate random duration for movies
          const minutes = Math.floor(Math.random() * 90) + 90;
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          const randomDuration = `${hours}h ${remainingMinutes}m`;
          
          return {
            id: item.id,
            title: isTV ? item.name : item.title,
            image: getImageUrl(item.poster_path),
            quality: item.vote_average > 7.5 ? "4K" : "HD",
            rating: item.vote_average.toFixed(1),
            meta: `${
              (isTV ? item.first_air_date : item.release_date)?.split("-")[0] || ""
            } • ${isTV ? "TV Series" : randomDuration}`,
            genre:
              item.genre_ids && item.genre_ids.length > 0
                ? getGenreName(item.genre_ids[0])
                : isTV ? "TV Show" : "Movie",
            mediaType: isTV ? "tv" : "movie", // Store media type for navigation
          };
        });
      
      setContent(formattedContent);
      setTotalPages(response.data.total_pages > 20 ? 20 : response.data.total_pages); // Limit to 20 pages
    } catch (err) {
      console.error("Failed to fetch content", err);
      setError("Failed to load content. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [contentType, filters, page]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Get genre name from ID
  const getGenreName = (genreId) => {
    const genre = genres.find(g => g.id === genreId);
    return genre ? genre.name : contentType === "tvshows" ? "TV Show" : "Movie";
  };

  // Handle content type change
  const handleContentTypeChange = (type) => {
    setContentType(type);
    setPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div className="browse-page">
        <div className="browse-header">
          <div className="browse-title-section">
            <h1>
              {filters.query 
                ? `Search Results for "${filters.query}"`
                : contentType === "popular" 
                  ? "Popular Movies" 
                  : contentType === "movies" 
                    ? "Movies" 
                    : "TV Shows"}
            </h1>
            <button 
              className="filter-toggle-btn" 
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <FaTimes /> : <FaFilter />} Filters
            </button>
          </div>

          <div className="browse-tabs">
            <button 
              className={`browse-tab ${contentType === "popular" ? "active" : ""}`}
              onClick={() => handleContentTypeChange("popular")}
            >
              Popular
            </button>
            <button 
              className={`browse-tab ${contentType === "movies" ? "active" : ""}`}
              onClick={() => handleContentTypeChange("movies")}
            >
              Movies
            </button>
            <button 
              className={`browse-tab ${contentType === "tvshows" ? "active" : ""}`}
              onClick={() => handleContentTypeChange("tvshows")}
            >
              TV Shows
            </button>
          </div>

          <form className="browse-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search titles..."
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>

          {showFilters && (
            <div className="browse-filters">
              <div className="filter-group">
                <label htmlFor="genre-filter">Genre</label>
                <select 
                  id="genre-filter" 
                  value={filters.genre} 
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="year-filter">Year</label>
                <select 
                  id="year-filter" 
                  value={filters.year} 
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="sort-filter">Sort By</label>
                <select 
                  id="sort-filter" 
                  value={filters.sort} 
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="vote_average.desc">Rating (High to Low)</option>
                  <option value="vote_average.asc">Rating (Low to High)</option>
                  {contentType !== "tvshows" ? (
                    <>
                      <option value="primary_release_date.desc">Release Date (New to Old)</option>
                      <option value="primary_release_date.asc">Release Date (Old to New)</option>
                    </>
                  ) : (
                    <>
                      <option value="first_air_date.desc">Air Date (New to Old)</option>
                      <option value="first_air_date.asc">Air Date (Old to New)</option>
                    </>
                  )}
                </select>
              </div>

              {Object.values(filters).some(value => value) && (
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setFilters({
                      genre: "",
                      year: "",
                      sort: "popularity.desc",
                      query: "",
                    });
                    setPage(1);
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="browse-content">
          {loading ? (
            <div className="browse-loading">
              <Loader size="lg" text="Loading content..." type="film" />
            </div>
          ) : error ? (
            <div className="browse-error">{error}</div>
          ) : content.length > 0 ? (
            <>
              <div className="browse-grid">
                {content.map(item => (
                  <MovieCard 
                    key={`${item.mediaType}-${item.id}`}
                    {...item} 
                    // Pass mediaType to navigate correctly to movies or TV shows
                    navigateTo={`/${item.mediaType}/${item.id}`}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="browse-pagination">
                  <button 
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="page-btn"
                  >
                    Previous
                  </button>
                  
                  <div className="page-numbers">
                    {page > 1 && (
                      <button onClick={() => handlePageChange(1)} className="page-btn">
                        1
                      </button>
                    )}
                    
                    {page > 3 && <span className="page-ellipsis">...</span>}
                    
                    {page > 2 && (
                      <button onClick={() => handlePageChange(page - 1)} className="page-btn">
                        {page - 1}
                      </button>
                    )}
                    
                    <button className="page-btn active">{page}</button>
                    
                    {page < totalPages - 1 && (
                      <button onClick={() => handlePageChange(page + 1)} className="page-btn">
                        {page + 1}
                      </button>
                    )}
                    
                    {page < totalPages - 2 && <span className="page-ellipsis">...</span>}
                    
                    {page < totalPages && (
                      <button onClick={() => handlePageChange(totalPages)} className="page-btn">
                        {totalPages}
                      </button>
                    )}
                  </div>
                  
                  <button 
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="page-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="browse-no-results">
              No results found. Try different filters or search terms.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowsePage;