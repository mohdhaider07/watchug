import axios from "axios";

// Use environment variables instead of hardcoded values
const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY || "0643687a18f07a026a250fabe9d230e3";
const BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/";

// Create a simple request object
const request = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Helper function to get image URLs from TMDB
export const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/500x750";
  return `${IMAGE_BASE_URL}original${path}`;
};

export default request;
