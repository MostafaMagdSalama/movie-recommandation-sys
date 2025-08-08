import React from 'react';
import { tmdbApi } from '../lib/tmdb';
import { Star, Calendar, Clock } from 'lucide-react';

const MovieCard = ({ movie }) => {
  if (!movie) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-500">No movie data</p>
        </div>
      </div>
    );
  }

  const imageUrl = movie.poster_path ? tmdbApi.getImageUrl(movie.poster_path) : null;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A';

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col touch-manipulation relative">
      {/* Movie Poster */}
      <div className="relative flex-shrink-0 h-64 sm:h-80 bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={movie.title || 'Movie poster'}
            className="w-full h-full object-cover"
            loading="lazy"
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
            <div className="text-3xl sm:text-4xl mb-2">🎬</div>
            <p className="text-gray-600 text-xs sm:text-sm">No Image</p>
          </div>
        </div>
        
        {/* Rating Badge */}
        {rating !== 'N/A' && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{rating}</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {movie.title || 'Unknown Title'}
        </h3>
        
        <div className="flex items-center text-gray-500 mb-2 sm:mb-3 space-x-3 sm:space-x-4">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span className="text-xs">{releaseYear}</span>
          </div>
          {movie.runtime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span className="text-xs">{movie.runtime}min</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4 flex-1 leading-relaxed">
          {movie.overview || 'No description available for this movie.'}
        </p>

        {/* Genres */}
        {movie.genre_ids && movie.genre_ids.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {movie.genre_ids.slice(0, 2).map((genreId, index) => (
              <span
                key={genreId}
                className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
              >
                {getGenreName(genreId)}
              </span>
            ))}
            {movie.genre_ids.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{movie.genre_ids.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get genre names
const getGenreName = (genreId) => {
  const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  return genres[genreId] || `Genre ${genreId}`;
};

export default MovieCard;
