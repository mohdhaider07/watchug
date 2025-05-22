import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetails from "./pages/MovieDetails";
import BrowsePage from "./pages/BrowsePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import "./App.css";

function App() {
  return (
    <div id="webcrumbs">
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv/:id" element={<MovieDetails />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
