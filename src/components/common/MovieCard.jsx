import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../requestMethod";
import "./styles/MovieCard.css";
import { FaStar, FaPlay, FaHeart } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const MovieCard = memo(({ id, image, title, quality, rating, genre, meta }) => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [isLoved, setIsLoved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hooks must be called unconditionally
  const handleMovieClick = useCallback(() => {
    if (id) {
      navigate(`/movie/${id}`);
    }
  }, [id, navigate]);

  const handleHeartClick = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!user) {
        navigate("/signin");
        return;
      }
      setLoading(true);
      try {
        if (isLoved) {
          await apiRequest.delete(`/user/loved/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoved(false);
        } else {
          await apiRequest.post(
            "/user/loved",
            { movieId: id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsLoved(true);
        }
      } catch (err) {
        // Optionally handle error
        console.error("Error updating loved status:", err);
      } finally {
        setLoading(false);
      }
    },
    [user, token, id, isLoved, navigate]
  );

  if (!id) {
    return <div className="movie-card"></div>;
  }

  return (
    <div className="movie-card">
      <div className="movie-card-img-wrap">
        <span className="movie-card-quality hide-on-hover">{quality}</span>
        {rating && (
          <span className="movie-card-rating show-on-hover">
            <FaStar className="movie-card-star" />
            {rating}
          </span>
        )}
        {/* Heart icon - top left, only visible on hover */}
        <button
          className="movie-card-heart-btn show-on-hover-left"
          onClick={handleHeartClick}
          title={isLoved ? "Unlove" : "Love"}
          disabled={loading}
        >
          <FaHeart fill={isLoved ? "#9333ea" : "#3f3f46"} size={22} />
        </button>
        <div className="movie-card-img-gradient"></div>
        <img
          src={image}
          alt={title}
          className="movie-card-img"
          loading="lazy"
        />
        <div className="movie-card-play-wrap">
          <button onClick={handleMovieClick} className="movie-card-play-btn">
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
});

export default MovieCard;
