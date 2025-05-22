import axios from "axios";

// TMDB API config
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

// Your backend API config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// TMDB request instance
export const tmdbRequest = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Backend API request instance
export const apiRequest = axios.create({
  baseURL: API_BASE_URL,
});

// Helper function to get image URLs from TMDB
export const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/500x750";
  return `${IMAGE_BASE_URL}original${path}`;
};

// For backward compatibility (optional, can remove if not needed)
export default tmdbRequest;
