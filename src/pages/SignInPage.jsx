import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/SignPages.css";
import { apiRequest } from "../requestMethod";
import { useUser } from "../context/UserContext";

const MOVIE_COLLAGE_URL = "/poster.jpeg";

const SignInPage = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiRequest.post("/auth/login", {
        identifier: form.identifier,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
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
        <h2 className="sign-title">Welcome Back</h2>
        <p className="sign-subtitle">Sign in to your account</p>
        <form className="sign-form" onSubmit={handleSubmit}>
          <input
            className="sign-input"
            type="text"
            name="identifier"
            placeholder="Email or Username"
            value={form.identifier}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <input
            className="sign-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          {error && <div className="sign-error">{error}</div>}
          <button className="sign-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>
        <div className="sign-bottom-text">
          Don't have an account?{" "}
          <Link to="/signup" className="sign-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
