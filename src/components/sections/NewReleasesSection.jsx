import React, { useState, useEffect } from "react";
import "./styles/NewReleasesSection.css";
import MovieCard from "../common/MovieCard";
import Loader from "../common/Loader";
import request, { getImageUrl } from "../../requestMethod";

const NewReleasesSection = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        const response = await request.get("/movie/now_playing");

        // Format movies data
        const movies = response.data.results.slice(0, 5).map((movie) => {
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
                  : movie.genre_ids[0] === 10751
                  ? "Family"
                  : movie.genre_ids[0] === 14
                  ? "Fantasy"
                  : movie.genre_ids[0] === 10770
                  ? "TV Movie"
                  : "Movie"
                : "Movie",
          };
        });

        setNewReleases(movies);
        setError(null);
      } catch (err) {
        setError("Failed to load new releases");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (loading) {
    return (
      <section className="new-releases-section loading">
        <Loader size="md" text="Loading new releases..." type="movie" />
      </section>
    );
  }

  if (error) {
    return <section className="new-releases-section error">{error}</section>;
  }

  return (
    <section className="new-releases-section">
      <h2 className="new-releases-title">New Releases</h2>
      <div className="new-releases-grid">
        {newReleases.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </section>
  );
};

export default NewReleasesSection;
