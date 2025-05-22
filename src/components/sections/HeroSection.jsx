import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HeroSection.css";
import { FaStar, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { tmdbRequest, getImageUrl } from "../../requestMethod";

const HeroSection = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  // Fetch popular movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await tmdbRequest.get("/movie/popular");
        // Get top 5 movies for the hero slider
        const heroMovies = response.data.results.slice(0, 5).map((movie) => ({
          id: movie.id,
          title: movie.title,
          image: getImageUrl(movie.backdrop_path),
          rating: movie.vote_average.toFixed(1),
          quality: movie.vote_average > 7.5 ? "4K" : "1080p",
          year: movie.release_date.split("-")[0],
          country: "USA", // Not available in API, using default
          desc: movie.overview,
        }));
        setMovies(heroMovies);
        setError(null);
      } catch (err) {
        setError("Failed to load featured movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const goToPrev = () => {
    setIsChanging(true);
    setCurrent((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setIsChanging(true);
    setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  // Navigate to movie details page
  const handleNavigateToMovie = () => {
    navigate(`/movie/${hero.id}`);
  };

  // Reset animation state after transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChanging(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [current]);

  // Loading state
  if (loading) {
    return (
      <div className="hero-section loading">Loading featured movies...</div>
    );
  }

  // Error state
  if (error) {
    return <div className="hero-section error">{error}</div>;
  }

  // No movies found
  if (movies.length === 0) {
    return (
      <div className="hero-section empty">No featured movies available</div>
    );
  }

  const hero = movies[current];

  return (
    <section className="hero-section">
      <div className="hero-gradient"></div>
      <div
        className={`hero-image-container ${
          isChanging ? "flash-animation" : ""
        }`}
        onClick={handleNavigateToMovie}
        style={{ cursor: "pointer" }}
      >
        <img src={hero.image} alt={hero.title} className="hero-bg-img" />
      </div>
      <div className="hero-content">
        <h1
          className="hero-title"
          onClick={handleNavigateToMovie}
          style={{ cursor: "pointer" }}
        >
          {hero.title}
        </h1>
        <div className="hero-meta">
          <span className="hero-rating">
            <FaStar className="hero-star" />
            {hero.rating}
          </span>
          <span className="hero-quality">{hero.quality}</span>
          <span className="hero-country">{hero.country}</span>
          <span className="hero-year">{hero.year}</span>
        </div>
        <p className="hero-desc">{hero.desc}</p>
        <button className="hero-watch-btn" onClick={handleNavigateToMovie}>
          <FaPlay className="hero-play" />
          Watch now
        </button>
      </div>
      <div className="hero-dots">
        {movies.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot${idx === current ? " active" : ""}`}
            onClick={() => setCurrent(idx)}
          ></button>
        ))}
      </div>
      <div className="hero-arrows">
        <button className="hero-arrow" onClick={goToPrev}>
          <FaChevronLeft />
        </button>
        <button className="hero-arrow" onClick={goToNext}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
