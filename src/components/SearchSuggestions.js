import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SearchSuggestions.css';

const SearchSuggestions = ({ suggestions, theme, onSuggestionClick }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={`search-suggestions ${theme === 'dark' ? 'dark' : 'light'}`}>
      <ul className="suggestions-list">
        {suggestions.map(movie => (
          <li key={movie.id} className="suggestion-item" onClick={() => onSuggestionClick()}>
            <Link to={`/movie/${movie.id}`} className="suggestion-link">
              <div className="suggestion-content">
                {movie.posterPath ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`} 
                    alt={movie.title} 
                    className="suggestion-poster"
                  />
                ) : (
                  <div className="no-poster-small">No Image</div>
                )}
                <div className="suggestion-info">
                  <span className="suggestion-title">{movie.title}</span>
                  <span className="suggestion-year">{movie.releaseYear}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
        <li className="view-all-item">
          <Link 
            to={suggestions.length > 0 ? `/search?query=${encodeURIComponent(suggestions[0].searchQuery)}` : '/search'} 
            className="view-all-link"
            onClick={onSuggestionClick}
          >
            View all results
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SearchSuggestions;