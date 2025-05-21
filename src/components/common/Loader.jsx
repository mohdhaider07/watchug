import React from "react";
import "./styles/Loader.css";
import { BiFilm, BiCameraMovie, BiMoviePlay } from "react-icons/bi";

/**
 * Reusable Loader component with movie-themed animations
 * @param {Object} props
 * @param {string} props.size - Size of the loader: "sm", "md", or "lg"
 * @param {string} props.text - Text to display below the loader
 * @param {string} props.type - Type of icon to show: "film", "movie", or "camera"
 */
const Loader = ({ size = "md", text = "Loading...", type = "film" }) => {
  // Determine icon size based on the size prop
  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 32;
      case "lg":
        return 64;
      case "md":
      default:
        return 48;
    }
  };

  // Determine which icon to render
  const renderIcon = () => {
    const iconSize = getIconSize();

    switch (type) {
      case "movie":
        return <BiMoviePlay size={iconSize} />;
      case "camera":
        return <BiCameraMovie size={iconSize} />;
      case "film":
      default:
        return <BiFilm size={iconSize} />;
    }
  };

  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-animation">{renderIcon()}</div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

export default Loader;