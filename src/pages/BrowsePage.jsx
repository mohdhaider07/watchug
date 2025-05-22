import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BrowseHeader from "../components/browse/BrowseHeader";
import BrowseFilters from "../components/browse/BrowseFilters";
import BrowseResults from "../components/browse/BrowseResults";
import BrowsePagination from "../components/browse/BrowsePagination";
import request from "../requestMethod";
import "./styles/BrowsePage.css";

const BrowsePage = () => {
  // Router
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Extract query parameters
  const initialType = queryParams.get("type") || "all"; // all, popular, movies, tvshows
  const initialQuery = queryParams.get("query") || "";
  const initialGenre = queryParams.get("genre") || "";
  const initialYear = queryParams.get("year") || "";
  const initialSort = queryParams.get("sort") || "popularity.desc";

  // State
  const [contentType, setContentType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(
    initialGenre ? initialGenre.split(",").map(Number) : []
  );
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(initialYear || "");
  const [sortBy, setSortBy] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  // Generate years from 1900 to current year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let year = currentYear; year >= 1900; year--) {
      yearArray.push(year.toString());
    }
    setYears(yearArray);
  }, []);

  // Fetch genres when the component mounts or content type changes
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Determine endpoint based on content type
        const endpoint =
          contentType === "tvshows" ? "genre/tv/list" : "genre/movie/list";
        const { data } = await request.get(endpoint);
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setGenres([]);
      }
    };

    fetchGenres();
  }, [contentType]);

  // Update URL with current filters
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();

    if (contentType && contentType !== "all") params.set("type", contentType);
    if (searchQuery) params.set("query", searchQuery);
    if (selectedGenres.length) params.set("genre", selectedGenres.join(","));
    if (selectedYear) params.set("year", selectedYear);
    if (sortBy !== "popularity.desc") params.set("sort", sortBy);
    if (page > 1) params.set("page", page.toString());

    navigate(`/browse?${params.toString()}`, { replace: true });
  }, [
    contentType,
    searchQuery,
    selectedGenres,
    selectedYear,
    sortBy,
    page,
    navigate,
  ]);

  // Fetch content based on filters
  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint;
      let params = {
        page,
      };

      // Add sort parameter based on content type
      if (sortBy) {
        // Handle different sort parameters for TV shows
        if (
          contentType === "tvshows" &&
          sortBy.startsWith("primary_release_date")
        ) {
          // Convert movie date parameter to TV date parameter
          params.sort_by = sortBy.replace(
            "primary_release_date",
            "first_air_date"
          );
        } else {
          params.sort_by = sortBy;
        }
      }

      // Handle search query
      if (searchQuery) {
        endpoint = "search/multi";
        params.query = searchQuery;
      }
      // Handle content type
      else {
        switch (contentType) {
          case "popular":
            endpoint = "movie/popular";
            break;
          case "movies":
            endpoint = "discover/movie";
            break;
          case "tvshows":
            endpoint = "discover/tv";
            break;
          default:
            endpoint = "trending/all/week";
        }
      }

      // Add year filter if selected
      if (selectedYear) {
        if (contentType === "tvshows") {
          params.first_air_date_year = selectedYear;
        } else {
          params.primary_release_year = selectedYear;
        }
      }

      // Add genre filter if selected
      if (selectedGenres.length > 0) {
        params.with_genres = selectedGenres.join(",");
      }

      console.log("API Request:", { endpoint, params });

      // Get the data
      const { data } = await request.get(endpoint, { params });

      // Process the results based on the endpoint
      let processedResults;
      if (searchQuery && endpoint === "search/multi") {
        // Filter out people and other non-movie/tv results
        processedResults = data.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );
      } else {
        processedResults = data.results;
      }

      setItems(processedResults || []);
      setTotalPages(Math.min(data.total_pages || 0, 100)); // API limit is 500 pages, but we're limiting to 100
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, contentType, searchQuery, selectedGenres, selectedYear, sortBy]);

  // Apply filters and fetch content
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Update URL when filters change
  useEffect(() => {
    updateURLParams();
  }, [
    contentType,
    searchQuery,
    selectedGenres,
    selectedYear,
    sortBy,
    page,
    updateURLParams,
  ]);

  // Handle filter changes
  const handleContentTypeChange = (type) => {
    setContentType(type);
    setPage(1);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
    setPage(1);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSelectedYear("");
    setSortBy("popularity.desc");
    setPage(1);

    // Preserve only the content type in the URL
    const params = new URLSearchParams();
    if (contentType !== "all") params.set("type", contentType);
    navigate(`/browse?${params.toString()}`, { replace: true });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("searchQuery");
    setSearchQuery(query);
    setPage(1);
  };

  // Get the page title based on content type and search query
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }

    switch (contentType) {
      case "popular":
        return "Popular Movies";
      case "movies":
        return "Browse Movies";
      case "tvshows":
        return "Browse TV Shows";
      default:
        return "Browse All";
    }
  };

  return (
    <>
      <div className="browse-page">
        {/* Header with search and filter toggle */}
        <BrowseHeader
          title={getPageTitle()}
          searchQuery={searchQuery}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          handleSearch={handleSearch}
        />

        {/* Filters section */}
        <BrowseFilters
          showFilters={showFilters}
          contentType={contentType}
          genres={genres}
          selectedGenres={selectedGenres}
          selectedYear={selectedYear}
          sortBy={sortBy}
          years={years}
          handleContentTypeChange={handleContentTypeChange}
          handleGenreChange={handleGenreChange}
          handleYearChange={handleYearChange}
          handleSortChange={handleSortChange}
          handleClearFilters={handleClearFilters}
        />

        {/* Results section */}
        <div className="browse-content">
          <BrowseResults
            loading={loading}
            error={error}
            items={items}
            fetchContent={fetchContent}
            contentType={contentType}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <BrowsePagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BrowsePage;
