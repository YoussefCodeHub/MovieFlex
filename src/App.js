import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Genres from "./pages/Genres";
import Upcoming from "./pages/Upcoming";
import Trending from './pages/Trending';
import SearchResults from './components/SearchResults';
import Login from "./pages/Login";
import { getCurrentUser } from "./services/API";
import "./styles/App.css";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [user, setUser] = useState(null);
  
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  
  // Check if user is logged in on app load
  useEffect(() => {
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);
  
  // Function to update user state when login/logout happens
  const handleUserUpdate = (userData) => {
    setUser(userData);
  };
  
  return (
    <Router>
      <div className={`app ${theme}`}>
        <Navbar toggleTheme={toggleTheme} theme={theme} user={user} onUserUpdate={handleUserUpdate} />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/movie/:id" element={<MovieDetails theme={theme} />} />
            <Route path="/genres" element={<Genres theme={theme} />} />
            <Route path="/genre/:genreId" element={<Genres theme={theme} />} />
            <Route path="/upcoming" element={<Upcoming theme={theme} />} />
            <Route path="/trending" element={<Trending theme={theme} />} />
            <Route path="/search" element={<SearchResults theme={theme} />} />
            <Route path="/login" element={<Login theme={theme} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
