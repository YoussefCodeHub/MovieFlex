import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { fetchMovieTrailer } from "../services/API";
import { Link } from "react-router-dom";
import "../styles/MovieCard.css";

const MovieCard = ({ movie }) => {
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [playTrailer, setPlayTrailer] = useState(false);

  useEffect(() => {
    // Fetch trailer data on hover, but don't play it automatically
    if (isHovering && !trailer) {
      setIsLoading(true);
      fetchMovieTrailer(movie.id)
        .then((url) => {
          setTrailer(url);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
    
    // Reset play state when not hovering
    if (!isHovering) {
      setPlayTrailer(false);
    }
  }, [movie.id, isHovering, trailer]);

  // Format release date to show year only
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  return (
    <div className="movie-card-container">
      <div
        className="movie-card"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Show trailer if play button was clicked and trailer is available */}
        {playTrailer && trailer ? (
          <div className="trailer-container">
            <ReactPlayer
              url={trailer}
              controls={true}
              playing={true}
              muted={true}
              width="100%"
              height="100%"
              config={{
                youtube: {
                  playerVars: { showinfo: 0, controls: 1, modestbranding: 1 }
                }
              }}
            />
          </div>
        ) : (
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : "/movie-placeholder.png"
            }
            alt={movie.title}
            className="movie-poster"
          />
        )}

        {/* Loading indicator for trailer */}
        {isHovering && isLoading && (
          <div className="loading-trailer">
            <div className="spinner"></div>
          </div>
        )}

        {/* Overlay buttons when hovering */}
        {isHovering && !playTrailer && !isLoading && (
          <div className="movie-hover-overlay">
            <div className="overlay-buttons">
              <button 
                className="trailer-button"
                onClick={(e) => {
                  e.preventDefault();
                  setPlayTrailer(true);
                }}
              >
                Watch Trailer
              </button>
              <a 
                href={`/movie/${movie.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="details-button"
                onClick={(e) => e.stopPropagation()}
              >
                Movie Details
              </a>
            </div>
          </div>
        )}

        <div className="movie-info">
          <h3>{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</span>
            {releaseYear && <span className="movie-year">{releaseYear}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;