import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { searchMovies } from '../services/API';
import '../styles/SearchResults.css';

const SearchResults = ({ theme }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        setLoading(true);
        const data = await searchMovies(query, currentPage);
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 0);
        setLoading(false);
      } else {
        setMovies([]);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination-container">
        <button 
          className={`pagination-btn ${theme === 'dark' ? 'dark' : 'light'}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          className={`pagination-btn ${theme === 'dark' ? 'dark' : 'light'}`} 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="search-results-container">
      <h2 className="search-title">
        {query ? `Search Results for "${query}"` : 'Search Results'}
      </h2>
      
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {movies.length === 0 ? (
            <div className="no-results">
              {query ? `No movies found matching "${query}"` : 'Please enter a search term'}
            </div>
          ) : (
            <>
              <div className="movies-grid">
                {movies.map((movie) => (
                  <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                    <div className={`movie-poster-container ${theme === 'dark' ? 'dark' : 'light'}`}>
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="movie-poster"
                        />
                      ) : (
                        <div className="no-poster">No Image Available</div>
                      )}
                      <div className="movie-info">
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-year">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                        <div className="movie-rating">
                          <span className="rating-value">
                            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {renderPagination()}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;