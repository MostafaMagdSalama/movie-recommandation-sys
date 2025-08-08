const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export const tmdbApi = {
  // Get popular movies for initial swiping
  getPopularMovies: async (page = 1) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    )
    return response.json()
  },

  // Discover movies by genre
  discoverMovies: async (genreIds = [], page = 1) => {
    const genreQuery = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : ''
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}${genreQuery}&sort_by=popularity.desc`
    )
    return response.json()
  },

  // Get movie recommendations based on a movie ID
  getRecommendations: async (movieId) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}`
    )
    return response.json()
  },

  // Get all genres
  getGenres: async () => {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    )
    return response.json()
  },

  // Get movie details including videos (trailers)
  getMovieDetails: async (movieId) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos`
    )
    return response.json()
  },

  // Helper function to get full image URL
  getImageUrl: (path) => {
    return path ? `${TMDB_IMAGE_BASE_URL}${path}` : null
  },

  // Helper function to get YouTube trailer URL
  getTrailerUrl: (videos) => {
    if (!videos || !videos.results) return null
    const trailer = videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    )
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
  }
}
