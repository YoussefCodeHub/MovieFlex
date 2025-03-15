import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { fetchMovieDetails, fetchMovieTrailer, fetchSimilarMovies, fetchMovieWatchProviders, fetchTrendingMovies } from "../services/API";
import MovieCard from "../components/MovieCard";
import "../styles/MovieDetails.css";

const MovieDetails = ({ theme }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [showWatchOptions, setShowWatchOptions] = useState(false); // New state for watch options modal
  const scrollContainerRef = useRef(null);
  const trendingScrollContainerRef = useRef(null);

  useEffect(() => {
    // Reset state when movie ID changes
    setMovie(null);
    setTrailer(null);
    setWatchProviders(null);
    setSimilarMovies([]);
    setTrendingMovies([]);
    setLoading(true);
    setPlayTrailer(false);
    setShowWatchOptions(false);

    // Fetch movie data
    const loadMovieData = async () => {
      try {
        // Fetch movie details, trailer, providers, similar movies, and trending movies in parallel
        const [movieData, trailerUrl, providers, similar, trending] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieTrailer(id),
          fetchMovieWatchProviders(id),
          fetchSimilarMovies(id),
          fetchTrendingMovies()
        ]);

        setMovie(movieData);
        setTrailer(trailerUrl);
        setWatchProviders(providers);
        setSimilarMovies(similar);
        setTrendingMovies(trending);
      } catch (error) {
        console.error("Error loading movie data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [id]);

  // Format movie runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format movie release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Get TMDB watch page URL
  const getTMDBWatchPage = () => {
    return `https://www.themoviedb.org/movie/${id}/watch`;
  };

  // Scroll similar movies
  const scrollSimilarMovies = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Scroll trending movies
  const scrollTrendingMovies = (direction) => {
    if (trendingScrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      trendingScrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Handle external link navigation
  const openExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className={`movie-details-loading ${theme}`}>
        <div className="spinner-large"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={`movie-details-error ${theme}`}>
        <h2>Movie not found</h2>
        <p>Sorry, we couldn't find the movie you're looking for.</p>
      </div>
    );
  }

  return (
    <div className={`movie-details ${theme}`}>
      {/* Backdrop image */}
      <div
        className="movie-backdrop"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none"
        }}
      >
        <div className="backdrop-overlay"></div>
      </div>
      <div className="movie-details-content">
        {/* Movie poster and info */}
        <div className="movie-details-main">
          <div className="movie-poster-container">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/movie-placeholder.png"
              }
              alt={movie.title}
              className="movie-detail-poster"
            />
          </div>
          <div className="movie-info-container">
            <h1 className="movie-title">{movie.title}</h1>
           
            <div className="movie-meta-info">
              <span className="movie-year">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : ""}
              </span>
              <span className="separator">•</span>
              <span className="movie-runtime">{formatRuntime(movie.runtime)}</span>
              <span className="separator">•</span>
              <span className="movie-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            </div>
           
            <div className="movie-genres">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
           
            <div className="movie-overview">
              <h3>Overview</h3>
              <p>{movie.overview}</p>
            </div>
           
            <div className="movie-details-extra">
              <div className="detail-item">
                <span className="detail-label">Release Date:</span>
                <span className="detail-value">{formatReleaseDate(movie.release_date)}</span>
              </div>
             
              {movie.budget > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Budget:</span>
                  <span className="detail-value">
                    ${movie.budget.toLocaleString()}
                  </span>
                </div>
              )}
             
              {movie.revenue > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Revenue:</span>
                  <span className="detail-value">
                    ${movie.revenue.toLocaleString()}
                  </span>
                </div>
              )}
             
              {movie.production_companies?.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Production:</span>
                  <span className="detail-value">
                    {movie.production_companies.map(company => company.name).join(", ")}
                  </span>
                </div>
              )}
            </div>
           
            <div className="movie-action-buttons">
              {trailer && (
                <button
                  className="watch-trailer-button"
                  onClick={() => setPlayTrailer(true)}
                >
                  <span className="play-icon">▶</span> Watch Trailer
                </button>
              )}
              
              <button 
                className="watch-movie-button"
                onClick={() => setShowWatchOptions(true)}
              >
                <span className="play-icon">▶</span> Watch Movie
              </button>
            </div>
          </div>
        </div>
        {/* Trailer modal */}
        {playTrailer && trailer && (
          <div className="trailer-modal">
            <div className="trailer-modal-content">
              <button
                className="close-trailer"
                onClick={() => setPlayTrailer(false)}
              >
                ✕
              </button>
              <ReactPlayer
                url={trailer}
                controls
                playing
                width="100%"
                height="100%"
              />
            </div>
          </div>
        )}
        
        {/* Watch Options Modal */}
        {showWatchOptions && (
          <div className="watch-options-modal">
            <div className="watch-options-content">
              <button
                className="close-watch-options"
                onClick={() => setShowWatchOptions(false)}
              >
                ✕
              </button>
              <h2>Watch {movie.title}</h2>
              
              <div className="watch-providers-container">
                {watchProviders && (
                  <>
                    {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                      <div className="provider-section">
                        <h3>Stream</h3>
                        <div className="provider-list">
                          {watchProviders.flatrate.map(provider => (
                            <div key={provider.provider_id} className="provider-item">
                              <img 
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                                alt={provider.provider_name}
                                className="provider-logo"
                              />
                              <span>{provider.provider_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {watchProviders.rent && watchProviders.rent.length > 0 && (
                      <div className="provider-section">
                        <h3>Rent</h3>
                        <div className="provider-list">
                          {watchProviders.rent.map(provider => (
                            <div key={provider.provider_id} className="provider-item">
                              <img 
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                                alt={provider.provider_name}
                                className="provider-logo"
                              />
                              <span>{provider.provider_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {watchProviders.buy && watchProviders.buy.length > 0 && (
                      <div className="provider-section">
                        <h3>Buy</h3>
                        <div className="provider-list">
                          {watchProviders.buy.map(provider => (
                            <div key={provider.provider_id} className="provider-item">
                              <img 
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                                alt={provider.provider_name}
                                className="provider-logo"
                              />
                              <span>{provider.provider_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {watchProviders.link && (
                      <div className="watch-more-info">
                        <button 
                          className="watch-more-info-button"
                          onClick={() => openExternalLink(watchProviders.link)}
                        >
                          See All Watch Options
                        </button>
                      </div>
                    )}
                  </>
                )}
                
                {(!watchProviders || 
                  (!watchProviders.flatrate && !watchProviders.rent && !watchProviders.buy)) && (
                  <div className="no-providers">
                    <p>No streaming information available for your region.</p>
                    <button 
                      className="tmdb-link-button"
                      onClick={() => openExternalLink(getTMDBWatchPage())}
                    >
                      Check on TMDB
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Similar movies section */}
        {similarMovies.length > 0 && (
          <div className="similar-movies-section">
            <h2 className="section-title">Similar Movies</h2>
            <div className="similar-movies-navigation">
              <button 
                className="nav-arrow left"
                onClick={() => scrollSimilarMovies('left')}
              >
                &#10094;
              </button>
              <div className="similar-movies-scroll" ref={scrollContainerRef}>
                {similarMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
              <button 
                className="nav-arrow right"
                onClick={() => scrollSimilarMovies('right')}
              >
                &#10095;
              </button>
            </div>
          </div>
        )}
        
        {/* Trending movies section */}
        {trendingMovies.length > 0 && (
          <div className="similar-movies-section">
            <h2 className="section-title">Trending Now</h2>
            <div className="similar-movies-navigation">
              <button 
                className="nav-arrow left"
                onClick={() => scrollTrendingMovies('left')}
              >
                &#10094;
              </button>
              <div className="similar-movies-scroll" ref={trendingScrollContainerRef}>
                {trendingMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
              <button 
                className="nav-arrow right"
                onClick={() => scrollTrendingMovies('right')}
              >
                &#10095;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;