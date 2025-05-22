import React, { useState, useEffect } from "react";
import "./styles/TrendingSection.css";
import MovieCard from "../common/MovieCard";
import Loader from "../common/Loader";
import { tmdbRequest, getImageUrl } from "../../requestMethod";

const TrendingSection = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        const response = await tmdbRequest.get("/trending/movie/day");

        // Format movies data
        const movies = response.data.results.map((movie) => {
          // Generate random duration between 1h 30m and 3h 0m
          const minutes = Math.floor(Math.random() * 90) + 90; // 90 to 180 minutes
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          const randomDuration = `${hours}h ${remainingMinutes}m`;

          return {
            id: movie.id,
            title: movie.title,
            image: getImageUrl(movie.poster_path),
            quality: movie.vote_average > 7.5 ? "4K" : "1080p",
            rating: movie.vote_average.toFixed(1),
            meta: `${
              movie.release_date ? movie.release_date.split("-")[0] : ""
            } • ${randomDuration}`,
            genre:
              movie.genre_ids && movie.genre_ids.length > 0
                ? movie.genre_ids[0] === 28
                  ? "Action"
                  : movie.genre_ids[0] === 35
                  ? "Comedy"
                  : movie.genre_ids[0] === 18
                  ? "Drama"
                  : movie.genre_ids[0] === 27
                  ? "Horror"
                  : movie.genre_ids[0] === 878
                  ? "Sci-Fi"
                  : "Action"
                : "Action",
          };
        });

        setTrendingMovies(movies);
        setError(null);
      } catch (err) {
        setError("Failed to load trending movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  if (loading) {
    return (
      <section className="trending-section loading">
        <Loader size="md" text="Loading trending movies..." type="film" />
      </section>
    );
  }

  if (error) {
    return <section className="trending-section error">{error}</section>;
  }

  return (
    <section className="trending-section">
      <h2 className="trending-title">Trending Today</h2>
      <div className="movie-scroll-row">
        {trendingMovies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
