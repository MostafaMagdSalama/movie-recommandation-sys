import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { movieService } from '../services/movieService';
import { tmdbApi } from '../lib/tmdb';
import { ArrowLeft, Star, Calendar, Clock, Play, RotateCw, XCircle } from 'lucide-react';

const Recommendation = ({ recommendation, onAccept, onGetAnother, onBack, onStartOver }) => {
  const { user } = useAuth();
  const [movieDetails, setMovieDetails] = useState(null);
  const [gettingNew, setGettingNew] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [error, setError] = useState(null);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (recommendation) {
      fetchMovieDetails();
    }
  }, [recommendation]);

  useEffect(() => {
    if (user?.id) {
      getInitialRecommendation();
    }
  }, [user]);

  const getInitialRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await movieService.getRecommendation(user.id);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.movie) {
        setRecommendation(result);
        
        // Get detailed movie info including trailers
        try {
          const details = await tmdbApi.getMovieDetails(result.movie.id);
          setMovieDetails(details);
        } catch (err) {
          console.error('Error getting movie details:', err);
          // Continue with basic movie info even if details fail
        }
      } else {
        setError('No recommendation available. Please swipe more movies first.');
      }
    } catch (err) {
      console.error('Error getting recommendation:', err);
      setError('Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAnother = async () => {
    try {
      setGettingNew(true);
      setError(null);
      
      // Get the current movie ID to exclude it
      const currentMovieId = recommendation?.movie?.id;
      
      // Get new recommendation, excluding the current movie
      const result = await movieService.getRecommendation(user.id, currentMovieId);
      
      if (result.error) {
        if (result.error.includes('no more movies')) {
          setError('You\'ve seen all our recommendations! Try swiping more movies to get new suggestions.');
        } else {
          setError(result.error);
        }
        return;
      }
      
      if (result.movie) {
        setRecommendation(result);
        setMovieDetails(null); // Clear previous details
        
        // Get detailed movie info for the new recommendation
        try {
          const details = await tmdbApi.getMovieDetails(result.movie.id);
          setMovieDetails(details);
        } catch (err) {
          console.error('Error getting movie details:', err);
          // Continue with basic movie info even if details fail
        }
      } else {
        setError('No more recommendations available. Please swipe more movies first.');
      }
    } catch (err) {
      console.error('Error getting new recommendation:', err);
      setError('Failed to get a new recommendation. Please try again.');
    } finally {
      setGettingNew(false);
    }
  };

  const handleAccept = () => {
    // Show success message and go back to home
    alert('Great choice! Enjoy your movie! 🎬');
    onBack();
  };

  const getTrailerUrl = () => {
    if (!movieDetails?.videos?.results) return null;
    
    const trailer = movieDetails.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Finding the perfect movie for you...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !recommendation) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">No Recommendations Available</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-3">
              <button
                onClick={getInitialRecommendation}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => navigate('/swipe')}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Swipe More Movies
              </button>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Go Home
          </button>
        </div>
      </div>
    );
  }

  const movie = recommendation?.movie;
  const imageUrl = movie?.poster_path ? tmdbApi.getImageUrl(movie.poster_path) : null;
  const releaseYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie?.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A';
  const trailerUrl = getTrailerUrl();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 safe-area-top">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2 -ml-2 rounded-lg active:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Home</span>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Your Recommendation</h1>
            <div className="w-12 sm:w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3 sm:p-4 pb-20 sm:pb-4">
        {/* Error Banner */}
        {error && recommendation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2 sm:mr-3 flex-shrink-0" />
              <p className="text-yellow-800 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        {movie ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="lg:flex">
              {/* Movie Poster */}
              <div className="lg:w-2/5">
                <div className="relative h-80 sm:h-96 lg:h-full lg:min-h-[500px]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={movie.title || 'Movie poster'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback for missing/broken images */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-300"
                    style={{ display: imageUrl ? 'none' : 'flex' }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-gray-600">No Image Available</p>
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  {rating !== 'N/A' && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{rating}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Details */}
              <div className="lg:w-3/5 p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {movie.title || 'Unknown Title'}
                  </h2>
                  
                  <div className="flex items-center text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{releaseYear}</span>
                    </div>
                    {movieDetails?.runtime && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{movieDetails.runtime} min</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {movie.overview || 'No description available for this movie.'}
                </p>

                {/* Genres */}
                {movieDetails?.genres && movieDetails.genres.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation Reason */}
                {recommendation.reason && (
                  <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h3 className="text-sm font-semibold text-indigo-800 mb-2">Why we recommend this:</h3>
                    <p className="text-indigo-700">{recommendation.reason}</p>
                  </div>
                )}

                {/* Trailer */}
                {trailerUrl && (
                  <div className="mb-6">
                    <a
                      href={trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Trailer
                    </a>
                  </div>
                )}

                {/* Desktop Action Buttons - Simple mobile-style design */}
                {isDesktop && (
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleAccept}
                      className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                    >
                      Perfect! I'll Watch This
                    </button>
                    
                    <button
                      onClick={handleGetAnother}
                      disabled={gettingNew}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      {gettingNew ? (
                        <span className="flex items-center justify-center">
                          <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                          Finding Another...
                        </span>
                      ) : (
                        'Find Another One'
                      )}
                    </button>
                    
                    <button
                      onClick={onStartOver}
                      className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Swipe More Movies First
                    </button>
                  </div>
                )}

                {/* Mobile - No action buttons, just swipe instructions */}
                {!isDesktop && (
                  <div className="mt-6 text-center">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <p className="text-indigo-800 font-medium text-sm">
                        👆 Swipe up to see more details or use the back button to continue swiping
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Recommendation Available</h3>
              <p className="text-gray-600 mb-6">We need more information about your preferences to make a recommendation.</p>
              <button
                onClick={onStartOver}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Start Swiping Movies
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Actions */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={handleGetAnother}
              disabled={gettingNew}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {gettingNew ? (
                <span className="flex items-center justify-center">
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Finding...
                </span>
              ) : (
                'Find Another'
              )}
            </button>
            
            <button
              onClick={onStartOver}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              More Movies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
