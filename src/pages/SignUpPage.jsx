import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/SignPages.css";
import { apiRequest } from "../requestMethod";

const MOVIE_COLLAGE_URL = "/poster.jpeg";

const SignUpPage = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      const res = await apiRequest.post("/auth/signup", {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    }
  };

  return (
    <div className="sign-page-root">
      <div
        className="sign-page-left sign-poster-bg"
        style={{ backgroundImage: `url('${MOVIE_COLLAGE_URL}')` }}
      ></div>
      <div className="sign-page-right">
        <div className="sign-logo-gradient">watchug</div>
        <h2 className="sign-title">Create Account</h2>
        <p className="sign-subtitle">Sign up to get started</p>
        <form className="sign-form" onSubmit={handleSubmit}>
          <input
            className="sign-input"
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
          <input
            className="sign-input"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <input
            className="sign-input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          <input
            className="sign-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <input
            className="sign-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          {error && <div className="sign-error">{error}</div>}
          <button className="sign-btn" type="submit">
            Sign Up
          </button>
        </form>
        <div className="sign-bottom-text">
          Already have an account?{" "}
          <Link to="/signin" className="sign-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
