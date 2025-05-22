import React from "react";
import "./styles/Footer.css";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      <div>
        <h3 className="footer-title">watchug</h3>
        <p className="footer-desc">
          Your ultimate destination for movies and TV shows. Stream your
          favorites anytime, anywhere.
        </p>
      </div>
      <div>
        <h4 className="footer-heading">Categories</h4>
        <ul className="footer-list">
          <li>
            <a href="#">Action</a>
          </li>
          <li>
            <a href="#">Comedy</a>
          </li>
          <li>
            <a href="#">Drama</a>
          </li>
          <li>
            <a href="#">Horror</a>
          </li>
          <li>
            <a href="#">Sci-Fi</a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="footer-heading">Quick Links</h4>
        <ul className="footer-list">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">My List</a>
          </li>
          <li>
            <a href="#">New Releases</a>
          </li>
          <li>
            <a href="#">Trending</a>
          </li>
          <li>
            <a href="#">Help Center</a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="footer-heading">Connect With Us</h4>
        <div className="footer-socials">
          <a href="#" className="footer-social">
            <FaFacebook />
          </a>
          <a href="#" className="footer-social">
            <FaTwitter />
          </a>
          <a href="#" className="footer-social">
            <FaInstagram />
          </a>
          <a href="#" className="footer-social">
            <FaYoutube />
          </a>
        </div>
        <p className="footer-app-desc">Download our app</p>
        <div className="footer-apps">
          <a href="#" className="footer-app">
            <FaApple /> App Store
          </a>
          <a href="#" className="footer-app">
            <FaGooglePlay /> Play Store
          </a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 watchug. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
