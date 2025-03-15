const API_KEY = "86ec1d5d795ec899a15d7d6264c25474";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetch popular movies
 * Returns a list of currently popular movies
 */
export const fetchPopularMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
};

/**
 * Fetch top rated movies
 * Returns a list of top rated movies
 */
export const fetchTopRatedMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
};

/**
 * Fetch now playing movies
 * Returns a list of movies that are currently in theaters
 */
export const fetchNowPlayingMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
};

/**
 * Fetch movie trailer
 * Returns YouTube URL for the movie trailer if available
 */
export const fetchMovieTrailer = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    const trailer = data.results.find((vid) => vid.site === "YouTube" && vid.type === "Trailer");
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch {
    return null;
  }
};

/**
 * Fetch detailed information about a specific movie
 * Returns comprehensive movie details including budget, revenue, etc.
 */
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

/**
 * Fetch similar movies based on a movie ID
 * Returns a list of movies that are similar to the specified movie
 */
export const fetchSimilarMovies = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
};

/**
 * Fetch movie watch providers (where to watch)
 * Returns information about where to watch/stream the movie
 */
export const fetchMovieWatchProviders = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results?.US || null; // Return US providers or null if not available
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return null;
  }
};

/**
 * Fetch trending movies
 * Returns a list of movies that are trending for the specified time window and page
 * @param {string} timeWindow - 'day' or 'week'
 * @param {number} page - Page number of results to fetch
 * @returns {Object} - Object containing results array and pagination info
 */
export const fetchTrendingMovies = async (timeWindow = 'week', page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Return the full data object with results and pagination info
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return { results: [], total_pages: 0, total_results: 0, page: 1 };
  }
};

/**
 * Search for movies by query
 * Returns a list of movies that match the search query
 * @param {string} query - The search query
 * @param {number} page - Page number of results to fetch
 * @returns {Object} - Object containing results array and pagination info
 */
export const searchMovies = async (query, page = 1) => {
  try {
    if (!query || query.trim() === '') {
      return { results: [], total_pages: 0, total_results: 0, page: 1 };
    }
    
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], total_pages: 0, total_results: 0, page: 1 };
  }
};

/**
 * Get movie search suggestions based on partial query
 * Returns a list of movie suggestions for autocomplete
 * @param {string} query - The partial search query
 * @returns {Array} - Array of movie suggestions (limited to 5)
 */
export const getMovieSuggestions = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    // Return only the first 5 results for suggestions
    return data.results.slice(0, 5).map(movie => ({
      id: movie.id,
      title: movie.title,
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
      posterPath: movie.poster_path
    }));
  } catch (error) {
    console.error("Error getting movie suggestions:", error);
    return [];
  }
};

// handling Login Page

/**
 * Authenticate user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} - Authentication result with success flag and user data or error message
 */
export const loginUser = async (email, password) => {
  try {
    // In a real application, this would make an API call to your backend
    // For demo purposes, we'll simulate a successful login with demo credentials
    // or fail for any other credentials
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email === "demo@example.com" && password === "password123") {
      // Successful login
      const userData = {
        id: "user123",
        name: "Demo User",
        email: "demo@example.com",
        profilePic: null
      };
      
      // Store user data in localStorage
      localStorage.setItem("movieflix_user", JSON.stringify(userData));
      
      return {
        success: true,
        user: userData
      };
    } else {
      // Failed login
      return {
        success: false,
        message: "Invalid email or password"
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An error occurred during login"
    };
  }
};

/**
 * Log out the current user
 * Removes user data from localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem("movieflix_user");
  return { success: true };
};

/**
 * Check if user is currently logged in
 * @returns {Object|null} - User data if logged in, null otherwise
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("movieflix_user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};