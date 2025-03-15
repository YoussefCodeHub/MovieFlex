import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "../styles/Genres.css";

const genreList = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 12, name: "Adventure" },
  { id: 80, name: "Crime" }
];

const API_KEY = "86ec1d5d795ec899a15d7d6264c25474";
const BASE_URL = "https://api.themoviedb.org/3";

const Genres = ({ theme }) => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(genreId ? parseInt(genreId) : null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // If coming from a specific genre route, set the selected genre
    if (genreId) {
      setSelectedGenre(parseInt(genreId));
    }
  }, [genreId]);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (!selectedGenre) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${page}&language=en-US`
        );
        const data = await response.json();
        
        setMovies(data.results || []);
        setTotalPages(data.total_pages > 10 ? 10 : data.total_pages); // Limit to 10 pages max
        setLoading(false);
      } catch (error) {
        console.error("Error fetching genre movies:", error);
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [selectedGenre, page]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setPage(1); // Reset to first page when changing genres
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get current genre name
  const currentGenreName = selectedGenre 
    ? genreList.find(genre => genre.id === selectedGenre)?.name || "Unknown Genre"
    : "All Genres";

  return (
    <div className={`genres-page ${theme}`}>
      <div className="container pt-5">
        <h1 className="page-title">Movie Genres</h1>
        
        <div className="genre-buttons">
          {genreList.map((genre) => (
            <button
              key={genre.id}
              className={`genre-button ${selectedGenre === genre.id ? "active" : ""}`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {selectedGenre ? (
          <>
            <h2 className="genre-title">{currentGenreName} Movies</h2>
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : movies.length === 0 ? (
              <div className="no-movies">No movies found for this genre.</div>
            ) : (
              <>
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
                      Previous
                    </button>
                    
                    <div className="page-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(num => 
                          num === 1 || 
                          num === totalPages || 
                          (num >= page - 1 && num <= page + 1)
                        )
                        .map((num, idx, arr) => (
                          <React.Fragment key={num}>
                            <button
                              className={`page-number ${page === num ? "active" : ""}`}
                              onClick={() => handlePageChange(num)}
                            >
                              {num}
                            </button>
                            
                            {idx < arr.length - 1 && arr[idx + 1] - num > 1 && (
                              <span className="page-ellipsis">...</span>
                            )}
                          </React.Fragment>
                        ))}
                    </div>
                    
                    <button 
                      className="pagination-button"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="genre-selection-prompt">
            Please select a genre from above to explore movies.
          </div>
        )}
      </div>
    </div>
  );
};

export default Genres;