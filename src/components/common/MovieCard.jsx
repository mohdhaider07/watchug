import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/MovieCard.css";
import { FaStar, FaPlay } from "react-icons/fa";

const MovieCard = ({
  id,
  image,
  title,
  quality,
  rating,
  genre,
  meta,
}) => {
  const navigate = useNavigate();

  // Function to navigate to movie details page
  const handleMovieClick = () => {
    console.log(`Navigating to movie with ID: ${id}`);
    if (id) {
      navigate(`/movie/${id}`);
    } else {
      console.error("Movie ID is undefined or null");
    }
  };

  // If there's no ID, don't try to navigate
  if (!id) {
    console.warn("MovieCard received no ID prop", { title });
    return (
      <div className="movie-card">
        {/* ...existing code... */}
      </div>
    );
  }

  return (
    <div className="movie-card" onClick={handleMovieClick}>
      <div className="movie-card-img-wrap">
        <span className="movie-card-quality hide-on-hover">{quality}</span>
        {rating && (
          <span className="movie-card-rating show-on-hover">
            <FaStar className="movie-card-star" />{rating}
          </span>
        )}
        <div className="movie-card-img-gradient"></div>
        <img src={image} alt={title} className="movie-card-img" />
        <div className="movie-card-play-wrap">
          <button className="movie-card-play-btn" 
          >
            <FaPlay className="movie-card-play-icon" />
          </button>
        </div>
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{title}</h3>
        <div className="movie-card-meta">
          <span>{meta}</span>
          <span className="movie-card-genre">{genre}</span>
        </div>
        
        
      </div>
    </div>
  );
};

export default MovieCard;