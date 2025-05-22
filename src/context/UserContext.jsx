import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [lovedMovies, setLovedMovies] = useState([]);

  useEffect(() => {
    // Load user/token/lovedMovies from localStorage on mount
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedLoved = localStorage.getItem("lovedMovies");
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedLoved) setLovedMovies(JSON.parse(storedLoved));
  }, []);

  const fetchLovedMovies = async (tokenData) => {
    try {
      const res = await fetch("/api/user/loved", {
        headers: { Authorization: `Bearer ${tokenData || token}` },
      });
      const data = await res.json();
      setLovedMovies(data.lovedMovies || []);
      localStorage.setItem(
        "lovedMovies",
        JSON.stringify(data.lovedMovies || [])
      );
    } catch (err) {
      setLovedMovies([]);
    }
  };

  const addLovedMovie = async (movieId) => {
    try {
      const res = await fetch("/api/user/loved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId }),
      });
      const data = await res.json();
      setLovedMovies(data.lovedMovies || []);
      localStorage.setItem(
        "lovedMovies",
        JSON.stringify(data.lovedMovies || [])
      );
    } catch (err) {}
  };

  const removeLovedMovie = async (movieId) => {
    try {
      const res = await fetch(`/api/user/loved/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLovedMovies(data.lovedMovies || []);
      localStorage.setItem(
        "lovedMovies",
        JSON.stringify(data.lovedMovies || [])
      );
    } catch (err) {}
  };

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    fetchLovedMovies(tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setLovedMovies([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lovedMovies");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        lovedMovies,
        fetchLovedMovies,
        addLovedMovie,
        removeLovedMovie,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
