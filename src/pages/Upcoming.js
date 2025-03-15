import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import "../styles/Upcoming.css";

const API_KEY = "86ec1d5d795ec899a15d7d6264c25474";
const BASE_URL = "https://api.themoviedb.org/3";

const Upcoming = ({ theme }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [region, setRegion] = useState("US");

  const regions = [
    { code: "ALL", name: "All Regions" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "JP", name: "Japan" },
    { code: "IN", name: "India" },
    { code: "AU", name: "Australia" }
  ];

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      setLoading(true);
      try {
        // Construct the API URL based on whether we're fetching all regions or a specific one
        let apiUrl = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`;
        if (region !== "ALL") {
          apiUrl += `&region=${region}`;
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter out movies with missing essential data
        const validMovies = data.results?.filter(movie => 
          movie && movie.id && (movie.poster_path || movie.backdrop_path)
        ) || [];
        
        setMovies(validMovies);
        setTotalPages(data.total_pages > 10 ? 10 : data.total_pages); // Limit to 10 pages max
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        setMovies([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, [page, region]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      
      // Update URL with the new page parameter
      const url = new URL(window.location);
      url.searchParams.set('page', newPage);
      url.searchParams.set('region', region);
      window.history.pushState({}, '', url);
    }
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setRegion(newRegion);
    setPage(1); // Reset to first page when changing region
    
    // Update URL with the new region parameter and reset page to 1
    const url = new URL(window.location);
    url.searchParams.set('region', newRegion);
    url.searchParams.set('page', 1);
    window.history.pushState({}, '', url);
  };

  // Effect to sync with URL parameters on initial load
  useEffect(() => {
    const url = new URL(window.location);
    const pageParam = url.searchParams.get('page');
    const regionParam = url.searchParams.get('region');
    
    if (pageParam && !isNaN(parseInt(pageParam))) {
      setPage(parseInt(pageParam));
    }
    
    if (regionParam && regions.some(r => r.code === regionParam)) {
      setRegion(regionParam);
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
    <div className={`upcoming-page ${theme}`}>
      <div className="container pt-5">
        <div className="upcoming-header">
          <h1 className="page-title">Upcoming Movies</h1>
          <div className="region-selector">
            <label htmlFor="region-select">Region:</label>
            <select 
              id="region-select" 
              value={region} 
              onChange={handleRegionChange}
              className={`region-select ${theme}`}
            >
              {regions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
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
          <div className="no-movies">No upcoming movies found for this region.</div>
        ) : (
          <>
            <div className="release-dates-note">
              * Release dates may vary by region. 
              {region === "ALL" 
                ? "Showing upcoming releases from all regions." 
                : `Showing upcoming releases for ${regions.find(r => r.code === region)?.name}.`
              }
            </div>
            
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {/* Pagination - Modified to match the Trending component */}
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

export default Upcoming;