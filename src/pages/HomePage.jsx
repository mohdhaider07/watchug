import React from "react";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/sections/HeroSection";
import TrendingSection from "../components/sections/TrendingSection";
import NewReleasesSection from "../components/sections/NewReleasesSection";
import Footer from "../components/layout/Footer";
import LovedMoviesSection from "../components/sections/LovedMoviesSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <LovedMoviesSection />
      <TrendingSection />
      <NewReleasesSection />
    </>
  );
};

export default HomePage;
