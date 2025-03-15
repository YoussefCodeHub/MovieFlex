import React, { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import MovieSlider from "../components/MovieSlider";
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchNowPlayingMovies
} from "../services/API";
import "../styles/Home.css";

const Home = ({ theme }) => {
  // State for different movie categories
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for scrolling the movie containers
  const popularRef = useRef(null);
  const topRatedRef = useRef(null);
  const nowPlayingRef = useRef(null);

  useEffect(() => {
    // Fetch all movie data in parallel
    const fetchAllMovies = async () => {
      setIsLoading(true);
      try {
        const [popular, topRated, nowPlaying] = await Promise.all([
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchNowPlayingMovies()
        ]);
        
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setNowPlayingMovies(nowPlaying);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  // Function to scroll movie container left or right
  const scrollMovies = (direction, ref) => {
    if (ref.current) {
      const cardWidth = 220; // Card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth * 3 : cardWidth * 3;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Helper function to render a movie section with navigation
  const renderMovieSection = (title, movies, ref) => (
    <div className="movie-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>
      
      <div className="slider-container">
        <button 
          className="nav-arrow nav-arrow-left"
          onClick={() => scrollMovies('left', ref)} 
          aria-label="Scroll left"
        >
          ❮
        </button>
        
        <div className="movie-container" ref={ref}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} theme={theme} />
          ))}
        </div>
        
        <button 
          className="nav-arrow nav-arrow-right"
          onClick={() => scrollMovies('right', ref)} 
          aria-label="Scroll right"
        >
          ❯
        </button>
      </div>
    </div>
  );

  return (
    <div className={`home ${theme}`}>
      {/* Hero section with movie slider */}
      <div className="hero-section">
        {!isLoading && <MovieSlider movies={popularMovies.slice(0, 5)} />}
      </div>

      {/* Content sections */}
      <div className="home-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading awesome movies...</p>
          </div>
        ) : (
          <>
            {renderMovieSection("Popular Movies", popularMovies, popularRef)}
            {renderMovieSection("Top Rated Movies", topRatedMovies, topRatedRef)}
            {renderMovieSection("Now Playing", nowPlayingMovies, nowPlayingRef)}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;