import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/MovieDetails.css";
import { FaStar, FaPlay, FaArrowLeft } from "react-icons/fa";
import request, { getImageUrl } from "../requestMethod";
import Footer from "../components/layout/Footer";
import MovieCard from "../components/common/MovieCard";
import Loader from "../components/common/Loader";

const MovieDetails = () => {
  const { id } = useParams(); // Get movie ID from URL
  const navigate = useNavigate(); // For navigation
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Get detailed movie info with credits and similar movies
        const response = await request.get(`/movie/${id}`, {
          params: { append_to_response: "credits,similar,videos" }
        });
        
        setMovie({
          id: response.data.id,
          title: response.data.title,
          backdrop: getImageUrl(response.data.backdrop_path),
          poster: getImageUrl(response.data.poster_path),
          overview: response.data.overview,
          rating: response.data.vote_average.toFixed(1),
          year: response.data.release_date?.split('-')[0] || '',
          runtime: response.data.runtime,
          genres: response.data.genres,
          tagline: response.data.tagline,
          cast: response.data.credits?.cast?.slice(0, 5) || [],
          director: response.data.credits?.crew?.find(person => person.job === "Director")?.name || 'Unknown',
          trailer: response.data.videos?.results?.find(video => 
            video.type === "Trailer" && video.site === "YouTube"
          )?.key || null
        });
        
        // Format similar movies
        if (response.data.similar?.results) {
          const similar = response.data.similar.results.slice(0, 4).map(movie => {
            // Generate random duration between 1h 30m and 3h 0m
            const minutes = Math.floor(Math.random() * 90) + 90; // 90 to 180 minutes
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            const randomDuration = `${hours}h ${remainingMinutes}m`;

            return {
              id: movie.id,
              title: movie.title,
              image: getImageUrl(movie.poster_path),
              rating: movie.vote_average.toFixed(1),
              quality: movie.vote_average > 7.5 ? "4K" : "1080p",
              meta: `${movie.release_date ? movie.release_date.split('-')[0] : ''} • ${randomDuration}`,
              genre: movie.genre_ids && movie.genre_ids.length > 0 ? 
                movie.genre_ids[0] === 28 ? "Action" :
                movie.genre_ids[0] === 35 ? "Comedy" :
                movie.genre_ids[0] === 18 ? "Drama" :
                movie.genre_ids[0] === 27 ? "Horror" :
                movie.genre_ids[0] === 878 ? "Sci-Fi" : "Movie"
                : "Movie"
            };
          });
          setSimilarMovies(similar);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Handle back button click
  const handleBack = () => {
    navigate('/'); // Navigate back to home page
  };

  if (loading) {
    return (
      <div className="movie-details-loading">
        <Loader size="lg" text="Loading movie details..." type="camera" />
      </div>
    );
  }

  if (error || !movie) {
    return <div className="movie-details-error">{error || "Movie not found"}</div>;
  }

  return (
    <>
      <div className="movie-details">
        {/* Backdrop and gradient overlay */}
        <div className="movie-backdrop">
          <img src={movie.backdrop} alt={movie.title} />
          <div className="backdrop-gradient"></div>
        </div>
        
        {/* Back button */}
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>
        
        {/* Main content */}
        <div className="movie-content">
          <div className="movie-poster">
            <img src={movie.poster} alt={movie.title} />
            <button className="watch-button">
              <FaPlay /> Watch Now
            </button>
          </div>
          
          <div className="movie-info">
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}
            
            <div className="movie-meta">
              <span className="movie-rating">
                <FaStar /> {movie.rating}
              </span>
              <span className="movie-year">{movie.year}</span>
              <span className="movie-runtime">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>
            
            <div className="movie-genres">
              {movie.genres.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="movie-overview">
              <h2>Overview</h2>
              <p>{movie.overview}</p>
            </div>
            
            <div className="movie-credits">
              <div className="movie-director">
                <h3>Director</h3>
                <p>{movie.director}</p>
              </div>
              
              <div className="movie-cast">
                <h3>Cast</h3>
                <div className="cast-list">
                  {movie.cast.map(person => (
                    <div key={person.id} className="cast-member">
                      <div className="cast-photo">
                        {person.profile_path ? (
                          <img 
                            src={getImageUrl(person.profile_path)} 
                            alt={person.name} 
                          />
                        ) : (
                          <div className="placeholder-avatar">{person.name[0]}</div>
                        )}
                      </div>
                      <p>{person.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {movie.trailer && (
              <div className="movie-trailer">
                <h2>Trailer</h2>
                <div className="trailer-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailer}`}
                    title={`${movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="similar-movies">
            <h2>Similar Movies</h2>
            <div className="similar-movies-grid">
              {similarMovies.map(movie => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default MovieDetails;