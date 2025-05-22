import React, { useEffect, useState } from "react";
import MovieCard from "../common/MovieCard";
import Loader from "../common/Loader";
import { useUser } from "../../context/UserContext";
import { getImageUrl, tmdbRequest, apiRequest } from "../../requestMethod";

const LovedMoviesSection = () => {
  const { user, token } = useUser();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLovedMovies = async () => {
      if (!user) {
        setMovies([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Fetch loved movie IDs from backend
        const res = await apiRequest.get("/user/loved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lovedMovies = res.data.lovedMovies || [];
        if (!lovedMovies.length) {
          setMovies([]);
          setLoading(false);
          return;
        }
        // Fetch details for each loved movie ID from TMDB
        const promises = lovedMovies.map((id) =>
          tmdbRequest.get(`/movie/${id}`)
        );
        const results = await Promise.all(promises);
        // Sort by release date descending (newest first)
        const sortedMovies = results
          .map((res) => ({
            id: res.data.id,
            title: res.data.title,
            image: getImageUrl(res.data.poster_path),
            rating: res.data.vote_average?.toFixed(1),
            quality: res.data.vote_average > 7.5 ? "4K" : "1080p",
            meta: res.data.release_date
              ? res.data.release_date.split("-")[0]
              : "",
            genre:
              res.data.genres && res.data.genres.length > 0
                ? res.data.genres[0].name
                : "Movie",
            release_date: res.data.release_date || "0000-00-00",
          }))
          .sort((a, b) => (b.release_date > a.release_date ? 1 : -1));
        setMovies(sortedMovies);
      } catch (err) {
        setMovies([]);
        setError("Failed to load loved movies.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLovedMovies();
  }, [user, token]);

  if (!user) return null;

  return (
    <section
      className="loved-movies-section"
      style={{ padding: "32px 40px 0 40px" }}
    >
      <h2
        style={{
          color: "#ef4444",
          fontWeight: 700,
          fontSize: "2rem",
          marginBottom: 24,
        }}
      >
        Loved Movies
      </h2>
      {loading ? (
        <Loader size="md" text="Loading loved movies..." type="movie" />
      ) : error ? (
        <div style={{ color: "#ef4444", textAlign: "center", padding: 24 }}>
          {error}
        </div>
      ) : movies.length === 0 ? (
        <div style={{ color: "#a1a1aa", textAlign: "center", padding: 24 }}>
          No loved movies available
        </div>
      ) : (
        <div className="movie-scroll-row">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default LovedMoviesSection;
