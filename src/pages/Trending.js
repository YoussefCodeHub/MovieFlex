import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { fetchTrendingMovies } from "../services/API";
import "../styles/Trending.css";

const Trending = ({ theme }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [timeWindow, setTimeWindow] = useState("week");

  const timeWindows = [
    { value: "day", name: "Today" },
    { value: "week", name: "This Week" }
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchTrendingMovies(timeWindow, page);
        
        // Filter out movies with missing essential data
        const validMovies = data.results?.filter(movie => 
          movie && movie.id && (movie.poster_path || movie.backdrop_path)
        ) || [];
        
        setMovies(validMovies);
        setTotalPages(data.total_pages > 10 ? 10 : data.total_pages); // Limit to 10 pages max
      } catch (error) {
        console.error("Error fetching trending movies:", error);
        setMovies([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, timeWindow]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      
      // Update URL with the new page parameter
      const url = new URL(window.location);
      url.searchParams.set('page', newPage);
      url.searchParams.set('time', timeWindow);
      window.history.pushState({}, '', url);
    }
  };

  const handleTimeWindowChange = (e) => {
    const newTimeWindow = e.target.value;
    setTimeWindow(newTimeWindow);
    setPage(1); // Reset to first page when changing time window
    
    // Update URL with the new time window parameter and reset page to 1
    const url = new URL(window.location);
    url.searchParams.set('time', newTimeWindow);
    url.searchParams.set('page', 1);
    window.history.pushState({}, '', url);
  };

  // Effect to sync with URL parameters on initial load
  useEffect(() => {
    const url = new URL(window.location);
    const pageParam = url.searchParams.get('page');
    const timeParam = url.searchParams.get('time');
    
    if (pageParam && !isNaN(parseInt(pageParam))) {
      setPage(parseInt(pageParam));
    }
    
    if (timeParam && timeWindows.some(t => t.value === timeParam)) {
      setTimeWindow(timeParam);
    }
  }, []);

  // Helper function to generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Logic for showing ellipsis and surrounding pages
    if (page > 3) {
      pageNumbers.push('...');
    }
    
    // Show current page and 1 page before and after (if they exist)
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }
    
    if (page < totalPages - 2) {
      pageNumbers.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className={`trending-page ${theme}`}>
      <div className="container pt-5">
        <div className="trending-header">
          <h1 className="page-title">Trending Movies</h1>
          <div className="time-selector">
            <label htmlFor="time-select">Time Frame:</label>
            <select 
              id="time-select" 
              value={timeWindow} 
              onChange={handleTimeWindowChange}
              className={`time-select ${theme}`}
            >
              {timeWindows.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : movies.length === 0 ? (
          <div className="no-movies">No trending movies found.</div>
        ) : (
          <>
            <div className="trending-note">
              Discover the most popular movies that everyone is watching 
              {timeWindow === "day" ? " today" : " this week"}.
            </div>
            
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="pagination-button"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <span className="pagination-arrow">«</span> Prev
                </button>
                
                <div className="page-numbers">
                  {getPageNumbers().map((num, idx) => (
                    <React.Fragment key={idx}>
                      {num === '...' ? (
                        <span className="page-ellipsis">...</span>
                      ) : (
                        <button
                          className={`page-number ${page === num ? "active" : ""}`}
                          onClick={() => handlePageChange(num)}
                        >
                          {num}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                <button 
                  className="pagination-button"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next <span className="pagination-arrow">»</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Trending;