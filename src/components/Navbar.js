import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";
import { getMovieSuggestions, logoutUser } from "../services/API";
import SearchSuggestions from "../components/SearchSuggestions";

/**
 * Enhanced Navbar Component - Main navigation bar for MovieApp
 * @param {object} props - Component props
 * @param {function} props.toggleTheme - Function to toggle between light and dark themes
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {object} props.user - Currently logged in user or null
 * @param {function} props.onUserUpdate - Function to update user state in parent component
 * @returns {JSX.Element} Rendered Navbar component
 */
const Navbar = ({ toggleTheme, theme, user, onUserUpdate }) => {
  // Determine if the current theme is dark
  const isDarkTheme = theme === "dark";
  
  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  // State for search suggestions
  const [suggestions, setSuggestions] = useState([]);
  // State to track if suggestions are visible
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Ref to detect clicks outside the search component
  const searchContainerRef = useRef(null);
  // State for dropdown menu
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Get current location for active link highlighting
  const location = useLocation();
  
  // For programmatic navigation
  const navigate = useNavigate();

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    onUserUpdate(null);
    navigate("/");
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.user-menu-container') === null) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get search suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        const results = await getMovieSuggestions(searchQuery.trim());
        // Add the search query to each result for reference
        const resultsWithQuery = results.map(item => ({
          ...item,
          searchQuery: searchQuery.trim()
        }));
        setSuggestions(resultsWithQuery);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hide suggestions when navigating
  useEffect(() => {
    setShowSuggestions(false);
  }, [location.pathname]);
  
  // Function to check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Handle genre click - direct navigation instead of using Link
  const handleGenreClick = (genre) => {
    // Navigate directly to the genre page without going through the category selection
    navigate(`/genre/${genre.toLowerCase()}`);
  };
  
  return (
    <nav className={`navbar navbar-expand-lg fixed-top solid-navbar ${isDarkTheme ? "navbar-dark dark-navbar" : "navbar-light light-navbar"}`}>
      <div className="container">
        {/* App Logo/Brand */}
        <Link className="navbar-brand" to="/">
          <div className="logo-container">
            <span className="logo-text">MOVIE<span className="logo-highlight">FLiX</span></span>
          </div>
        </Link>
        
        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Collapsible Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-container d-flex align-items-center justify-content-between w-100">
            {/* Navigation Links */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/') ? 'active-link' : ''}`} 
                  to="/"
                >
                  <span className="nav-text">Home</span>
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a 
                  className={`nav-link dropdown-toggle ${location.pathname.includes('/genre') ? 'active-link' : ''}`} 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <span className="nav-text">Genres</span>
                </a>
                <ul 
                  className={`dropdown-menu dropdown-menu-animated ${isDarkTheme ? 'dark-dropdown-menu' : ''}`} 
                  aria-labelledby="navbarDropdown"
                >
                  <li><span className="dropdown-item genre-item" onClick={() => handleGenreClick('action')}>Action</span></li>
                  <li><span className="dropdown-item genre-item" onClick={() => handleGenreClick('comedy')}>Comedy</span></li>
                  <li><span className="dropdown-item genre-item" onClick={() => handleGenreClick('drama')}>Drama</span></li>
                  <li><span className="dropdown-item genre-item" onClick={() => handleGenreClick('thriller')}>Thriller</span></li>
                  <li><span className="dropdown-item genre-item" onClick={() => handleGenreClick('animation')}>Animation</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/genres">All Genres</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/trending') ? 'active-link' : ''}`} 
                  to="/trending"
                >
                  <span className="nav-text">Trending</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/upcoming') ? 'active-link' : ''}`} 
                  to="/upcoming"
                >
                  <span className="nav-text">Upcoming</span>
                </Link>
              </li>
            </ul>
            
            {/* Right Side Container: Search + Login + Theme */}
            <div className="nav-right-container d-flex align-items-center">
              {/* Search Form */}
              <div className="search-section" ref={searchContainerRef}>
                <form className="search-form" onSubmit={handleSearch}>
                  <div className="search-container">
                    <input
                      className="form-control search-input"
                      type="search"
                      placeholder="Search movies..."
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.trim().length > 2 && setShowSuggestions(true)}
                    />
                    <button
                      className={`btn search-button ${isDarkTheme ? "btn-light" : "btn-dark"}`}
                      type="submit"
                    >
                      Search
                    </button>
                  </div>
                </form>
                {showSuggestions && (
                  <SearchSuggestions 
                    suggestions={suggestions} 
                    theme={theme} 
                    onSuggestionClick={() => setShowSuggestions(false)} 
                  />
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="nav-buttons d-flex align-items-center">
                {user ? (
                  <div className="user-menu-container">
                    <button 
                      className="btn btn-outline-primary user-menu-btn"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      {user.name.split(' ')[0]}
                    </button>
                    
                    {showUserMenu && (
                      <div className={`user-dropdown-menu ${isDarkTheme ? 'dark-dropdown-menu' : ''}`}>
                        <div className="dropdown-item user-info">
                          <div className="user-email">{user.email}</div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="btn btn-primary login-btn">
                    Login
                  </Link>
                )}
                
                <button 
                  className="btn theme-btn ms-3" 
                  onClick={toggleTheme}
                >
                  {isDarkTheme ? "☀️ Light" : "🌙 Dark"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;