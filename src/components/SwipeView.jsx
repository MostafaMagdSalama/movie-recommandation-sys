import React, { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, RotateCw, XCircle } from 'lucide-react';
import { movieService } from '../services/movieService';
import MovieCard from './MovieCard';
import SwipeCard from './SwipeCard';

const SwipeView = ({ userId, onSwipeComplete, onBack }) => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load movies when component mounts
  useEffect(() => {
    if (userId) {
      loadMovies();
    }
  }, [userId]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await movieService.getMoviesForSwiping(userId);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.movies && result.movies.length > 0) {
        setMovies(result.movies);
        setError('');
      } else {
        setError('No movies available for swiping.');
      }
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Failed to load movies. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    const movie = movies[currentIndex];
    if (!movie) return;

    let voteType;
    switch (direction) {
      case 'left':
        voteType = 'dislike';
        break;
      case 'right':
        voteType = 'like';
        break;
      default:
        return; // Don't process up/down swipes
    }

    try {
      // Save the swipe to database
      const result = await movieService.saveSwipe(userId, movie.id, voteType, movie);
      
      if (result.error) {
        console.error('Error saving swipe:', result.error);
        setError('Failed to save your preference. Please try again.');
        return;
      }

      // Update swipe count
      const newCount = swipeCount + 1;
      setSwipeCount(newCount);

      // Check if we've completed 10 swipes
      if (newCount >= 10) {
        onSwipeComplete();
        return;
      }

      // Move to next movie
      setCurrentIndex(prevIndex => prevIndex + 1);
      
    } catch (err) {
      console.error('Error in handleSwipe:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const swipeManually = (direction) => {
    if (currentIndex >= 0 && currentIndex < movies.length) {
      handleSwipe(direction);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadMovies}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // No movies state
  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Movies Available</h3>
            <p className="text-gray-600 mb-6">We couldn't find any movies for you to swipe. Please try again later.</p>
            <div className="space-y-3">
              <button
                onClick={loadMovies}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Refresh Movies
              </button>
              <button
                onClick={onBack}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50 safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2 -ml-2 rounded-lg active:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Discover Movies</h1>
            
            <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              {swipeCount}/10
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(swipeCount / 10) * 100}%` }}
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">
              {10 - swipeCount} movies remaining
            </p>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 relative z-10 overflow-hidden">
        <div className="swipe-container relative max-h-full">
          {movies.map((movie, index) => {
            // Only show current card and next cards (not previous/swiped cards)
            if (index < currentIndex || index > currentIndex + 2) return null;
            
            const zIndex = movies.length - index;
            const isCurrentCard = index === currentIndex;
            const cardPosition = index - currentIndex; // 0 = current, 1 = next, 2 = after next
            
            // Calculate visual effects for card stacking
            const scale = 1 - (cardPosition * 0.05); // Each card slightly smaller
            const translateY = cardPosition * 8; // Each card slightly lower
            const opacity = cardPosition === 0 ? 1 : 0.7; // Current card fully visible
            
            return (
              <div
                key={movie.id}
                className="swipe-card"
                style={{ 
                  zIndex,
                  pointerEvents: isCurrentCard ? 'auto' : 'none',
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity: opacity,
                  transition: 'all 0.3s ease-out'
                }}
              >
                {isCurrentCard ? (
                  <SwipeCard onSwipe={handleSwipe}>
                    <MovieCard movie={movie} />
                  </SwipeCard>
                ) : (
                  <MovieCard movie={movie} />
                )}
              </div>
            );
          })}
          
          {/* Show current movie info */}
          {currentIndex >= 0 && movies[currentIndex] && (
            <div className="absolute -bottom-12 sm:-bottom-16 left-0 right-0 text-center">
              <p className="text-xs sm:text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 mx-auto inline-block">
                {movies.length - currentIndex} of {movies.length}
              </p>
            </div>
          )}
        </div>
      </div>



      {/* Desktop/Tablet Buttons - Only show on desktop/tablet */}
      {isDesktop && (
        <div className="bg-gradient-to-r from-gray-50 to-white py-8 border-t border-gray-100">
          <div className="max-w-md mx-auto px-6">
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => swipeManually('left')}
                disabled={currentIndex >= movies.length || movies.length === 0}
                className="group flex flex-col items-center justify-center px-6 py-3 bg-white border-2 border-red-200 hover:border-red-300 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="p-3 bg-red-50 rounded-full mb-2 group-hover:bg-red-100 transition-colors">
                  <ThumbsDown className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-medium text-gray-700">Dislike</span>
              </button>
              
              <button
                onClick={() => swipeManually('right')}
                disabled={currentIndex >= movies.length || movies.length === 0}
                className="group flex flex-col items-center justify-center px-6 py-3 bg-white border-2 border-green-200 hover:border-green-300 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <div className="p-3 bg-green-50 rounded-full mb-2 group-hover:bg-green-100 transition-colors">
                  <ThumbsUp className="h-6 w-6 text-green-500 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-medium text-gray-700">Like</span>
              </button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600 font-medium">
                Drag cards or click buttons to rate movies
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile swipe instruction - enhanced */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-t-2 border-indigo-200 safe-area-bottom sm:hidden">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-2 rounded-full mb-1">
                <ThumbsDown className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-xs font-medium text-gray-600">Dislike</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-indigo-800">
                Swipe or tap to rate
              </p>
              <p className="text-xs text-indigo-600">
                {10 - swipeCount} more to get recommendations
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-2 rounded-full mb-1">
                <ThumbsUp className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-xs font-medium text-gray-600">Like</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeView;
