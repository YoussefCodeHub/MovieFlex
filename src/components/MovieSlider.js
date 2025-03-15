// MovieSlider.js
import React, { useState, useEffect } from 'react';
import { fetchPopularMovies, fetchMovieTrailer } from '../services/API';
import '../styles/MovieSlider.css';

const MovieSlider = () => {
  // State variables
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);
  
  // Fetch movies when component mounts
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      const data = await fetchPopularMovies();
      setMovies(data);
      setIsLoading(false);
      
      // Fetch trailer for the first movie
      if (data.length > 0) {
        const trailerUrl = await fetchMovieTrailer(data[0].id);
        setTrailer(trailerUrl);
      }
    };
    
    loadMovies();
  }, []);
  
  // Handle slide navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    loadTrailerForCurrentMovie((currentIndex + 1) % movies.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
    loadTrailerForCurrentMovie(currentIndex === 0 ? movies.length - 1 : currentIndex - 1);
  };
  
  // Load trailer for selected movie
  const loadTrailerForCurrentMovie = async (index) => {
    if (movies[index]) {
      const trailerUrl = await fetchMovieTrailer(movies[index].id);
      setTrailer(trailerUrl);
    }
  };
  
  // Handle movie click
  const handleMovieClick = async (index) => {
    setCurrentIndex(index);
    loadTrailerForCurrentMovie(index);
  };
  
  // Show loading message if data is being fetched
  if (isLoading) {
    return <div className="loading">Loading movies...</div>;
  }
  
  // Calculate which movies to show in the mini slider
  const visibleMovies = [];
  const totalVisible = 5; // Number of thumbnails to show
  
  for (let i = 0; i < totalVisible; i++) {
    const index = (currentIndex + i) % movies.length;
    visibleMovies.push(movies[index]);
  }
  
  return (
    <div className="movie-slider-container">
      {/* Featured movie section */}
      <div className="featured-movie">
        <div className="featured-backdrop" style={{ 
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movies[currentIndex]?.backdrop_path})` 
        }}>
          <div className="featured-content">
            <h1>{movies[currentIndex]?.title}</h1>
            <p className="overview">{movies[currentIndex]?.overview}</p>
            <div className="movie-meta">
              <span className="rating">⭐ {movies[currentIndex]?.vote_average}</span>
              <span className="year">{movies[currentIndex]?.release_date?.split('-')[0]}</span>
            </div>
            {trailer && (
              <a href={trailer} target="_blank" rel="noopener noreferrer" className="watch-trailer-btn">
                <span className="play-icon">▶</span> Watch Trailer
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Thumbnails slider */}
      <div className="thumbnails-slider">
        <button className="nav-btn prev-btn" onClick={prevSlide}>❮</button>
        <div className="thumbnails-container">
          {visibleMovies.map((movie, idx) => (
            <div 
              key={movie.id}
              className={`thumbnail ${idx === 0 ? 'active' : ''}`}
              onClick={() => handleMovieClick((currentIndex + idx) % movies.length)}
            >
              <img 
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                alt={movie.title} 
              />
              <div className="thumbnail-title">{movie.title}</div>
            </div>
          ))}
        </div>
        <button className="nav-btn next-btn" onClick={nextSlide}>❯</button>
      </div>
    </div>
  );
};

export default MovieSlider;