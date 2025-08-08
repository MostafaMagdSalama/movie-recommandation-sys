import { tmdbApi } from '../lib/tmdb'

// Use real TMDB API for movies, but localStorage for user data (no Supabase)
const USE_TMDB_API = true; // Use real TMDB API for movie data
const USE_LOCAL_STORAGE_ONLY = true; // Save user data to localStorage only (no Supabase)

// Mock movie data for offline mode
const MOCK_MOVIES = [
  {
    id: 550,
    title: "Fight Club",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    genre_ids: [18, 53]
  },
  {
    id: 13,
    title: "Forrest Gump",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events.",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    release_date: "1994-06-23",
    vote_average: 8.5,
    genre_ids: [35, 18, 10749]
  },
  {
    id: 155,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-16",
    vote_average: 9.0,
    genre_ids: [28, 80, 18]
  },
  {
    id: 680,
    title: "Pulp Fiction",
    overview: "A burger-loving hit man, his philosophical partner, and a drug-addled gangster's moll become involved in a very strange affair.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    release_date: "1994-09-10",
    vote_average: 8.9,
    genre_ids: [80, 18]
  },
  {
    id: 122,
    title: "The Lord of the Rings: The Return of the King",
    overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor.",
    poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    release_date: "2003-12-01",
    vote_average: 8.9,
    genre_ids: [12, 18, 14]
  },
  {
    id: 424,
    title: "Schindler's List",
    overview: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives during the Holocaust.",
    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    release_date: "1993-11-30",
    vote_average: 8.9,
    genre_ids: [18, 36, 10752]
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    release_date: "1994-09-23",
    vote_average: 9.3,
    genre_ids: [18, 80]
  },
  {
    id: 238,
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    release_date: "1972-03-14",
    vote_average: 9.2,
    genre_ids: [80, 18]
  },
  {
    id: 240,
    title: "The Godfather: Part II",
    overview: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    poster_path: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    release_date: "1974-12-20",
    vote_average: 9.0,
    genre_ids: [80, 18]
  },
  {
    id: 496243,
    title: "Parasite",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    release_date: "2019-05-30",
    vote_average: 8.5,
    genre_ids: [35, 18, 53]
  },
  {
    id: 19404,
    title: "Dilwale Dulhania Le Jayenge",
    overview: "Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values.",
    poster_path: "/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
    release_date: "1995-10-20",
    vote_average: 8.7,
    genre_ids: [35, 18, 10749]
  },
  {
    id: 389,
    title: "12 Angry Men",
    overview: "The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father.",
    poster_path: "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
    release_date: "1957-04-10",
    vote_average: 8.9,
    genre_ids: [18]
  },
  {
    id: 129,
    title: "Spirited Away",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    release_date: "2001-07-20",
    vote_average: 8.6,
    genre_ids: [16, 10751, 14]
  },
  {
    id: 324857,
    title: "Spider-Man: Into the Spider-Verse",
    overview: "Struggling to find his place in the world while juggling school and family, Brooklyn teenager Miles Morales is unexpectedly bitten by a radioactive spider.",
    poster_path: "/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    release_date: "2018-12-06",
    vote_average: 8.4,
    genre_ids: [28, 16, 878]
  },
  {
    id: 372058,
    title: "Your Name.",
    overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.",
    poster_path: "/q719jXXEzOoYaps6babgKnONONX.jpg",
    release_date: "2016-08-26",
    vote_average: 8.5,
    genre_ids: [16, 18, 10749]
  }
];

export const movieService = {
  // Save a user's swipe (like/dislike/not sure)
  saveSwipe: async (userId, movieId, voteType, movieData) => {
    // Always use localStorage for user data storage
    console.log('Saving swipe to localStorage');
    const swipes = JSON.parse(localStorage.getItem(`swipes_${userId}`) || '[]');
    const newSwipe = {
      id: Date.now(),
      user_id: userId,
      movie_id: movieId,
      vote_type: voteType,
      movie_title: movieData.title,
      movie_genres: movieData.genre_ids,
      movie_poster: movieData.poster_path,
      movie_overview: movieData.overview,
      movie_rating: movieData.vote_average,
      created_at: new Date().toISOString()
    };
    swipes.push(newSwipe);
    localStorage.setItem(`swipes_${userId}`, JSON.stringify(swipes));
    return { data: [newSwipe], error: null };
  },

  // Get user's swipe history
  getUserSwipes: async (userId) => {
    const { data, error } = await supabase
      .from('swipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get user's liked movies
  getLikedMovies: async (userId) => {
    // Always use localStorage for user data
    console.log('Getting liked movies from localStorage');
    const swipes = JSON.parse(localStorage.getItem(`swipes_${userId}`) || '[]');
    const likedMovies = swipes.filter(swipe => swipe.vote_type === 'like');
    return { data: likedMovies, error: null };
  },

  // Get movies already swiped by user
  getSwipedMovieIds: async (userId) => {
    // Always use localStorage for user data
    console.log('Getting swiped movie IDs from localStorage');
    const swipes = JSON.parse(localStorage.getItem(`swipes_${userId}`) || '[]');
    const movieIds = swipes.map(swipe => Number(swipe.movie_id));
    return { data: movieIds, error: null };
  },

  // Track recommended movies in memory to prevent duplicates in current session
  recommendedMovieIds: new Set(),
  
  // Clear recommended movies cache (useful for testing)
  clearRecommendedCache: function() {
    this.recommendedMovieIds.clear();
  },

  // Analyze user preferences and get recommendation
  getRecommendation: async function(userId, excludeMovieId = null) {
    try {
      // Get user's liked movies
      const { data: likedMovies, error: likedError } = await this.getLikedMovies(userId);
      if (likedError) {
        console.warn('Error getting liked movies, falling back to popular movies:', likedError);
        // Continue with empty array instead of failing
      }
      
      // Get already swiped movie IDs to filter out
      const { data: swipedIds, error: swipedError } = await this.getSwipedMovieIds(userId);
      if (swipedError) {
        console.warn('Error getting swiped movies, may show duplicates:', swipedError);
        // Continue with empty array instead of failing
      }
      
      // Combine swiped IDs with previously recommended IDs in this session
      const allExcludedIds = new Set([
        ...(Array.isArray(swipedIds) ? swipedIds : []),
        ...Array.from(this.recommendedMovieIds)
      ]);
      
      // If we're excluding a specific movie (from Recommend Another), add it to the excluded list
      if (excludeMovieId != null) {
        allExcludedIds.add(Number(excludeMovieId));
      }

      // Debug logging
      console.log('Recommendation Debug:', {
        swipedIds: swipedIds?.length || 0,
        recommendedIds: this.recommendedMovieIds.size,
        excludeMovieId,
        totalExcluded: allExcludedIds.size,
        excludedList: Array.from(allExcludedIds)
      });

      if (likedError || !likedMovies || likedMovies.length === 0) {
        // If no likes, return a popular movie that hasn't been seen
        const popularMovies = await tmdbApi.getPopularMovies()
        const unseenPopular = popularMovies.results.filter(
          movie => !Array.from(allExcludedIds).includes(movie.id)
        )
        
        if (unseenPopular.length === 0) {
          return { 
            movie: null, 
            error: 'No more movies available. Try swiping more movies first!',
            reason: null
          };
        }
        
        return { 
          movie: unseenPopular[0], 
          error: null,
          reason: 'Popular movie (no preferences yet)'
        };
      }

      // Count genre preferences
      const genreCounts = {}
      likedMovies.forEach(movie => {
        if (movie.movie_genres) {
          movie.movie_genres.forEach(genreId => {
            genreCounts[genreId] = (genreCounts[genreId] || 0) + 1
          })
        }
      })

      // Get top preferred genres (minimum 1, maximum 3)
      const topGenres = Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([genreId]) => parseInt(genreId));

      // Try to find a movie in preferred genres first
      if (topGenres.length > 0) {
        // Use TMDB API for recommendations
        console.log('Getting recommendations from TMDB API');
        
        // If we have liked genres, try to find movies in those genres
        if (topGenres.length > 0) {
          const genreMovies = await tmdbApi.discoverMovies(topGenres, 1);
          const unseenMovies = genreMovies.results.filter(
            movie => !allExcludedIds.has(movie.id)
          );
          
          if (unseenMovies.length > 0) {
            // Add to recommended set to prevent showing it again
            this.recommendedMovieIds.add(unseenMovies[0].id);
            return {
              movie: unseenMovies[0],
              error: null,
              reason: `Based on your preference for genres: ${topGenres.join(', ')}`
            };
          }
        }

        // If no movies found in preferred genres, try popular movies
        const popularMovies = await tmdbApi.getPopularMovies();
        const unseenPopular = popularMovies.results.filter(
          movie => !allExcludedIds.has(movie.id)
        );
        
        if (unseenPopular.length > 0) {
          // Add to recommended set to prevent showing it again
          this.recommendedMovieIds.add(unseenPopular[0].id);
          return {
            movie: unseenPopular[0],
            error: null,
            reason: 'Popular movie (no matches in your preferred genres)'
          };
        }
      }

      // If no movies found in preferred genres, try popular movies
      const popularMovies = await tmdbApi.getPopularMovies();
      const unseenPopular = popularMovies.results.filter(
        movie => !allExcludedIds.has(movie.id)
      );
      
      if (unseenPopular.length > 0) {
        // Add to recommended set to prevent showing it again
        this.recommendedMovieIds.add(unseenPopular[0].id);
        return {
          movie: unseenPopular[0],
          error: null,
          reason: 'Popular movie (no matches in your preferred genres)'
        };
      }

      // If we still don't have a movie, return an error
      return {
        movie: null,
        error: 'No more movies available. Try swiping more movies first!',
        reason: null
      };

    } catch (error) {
      console.error('Error getting recommendation:', error)
      return { movie: null, error: error.message, reason: null }
    }
  },

  // Get fresh movies for swiping (excluding already swiped)
  getMoviesForSwiping: async (userId, page = 1) => {
    try {
      // Get already swiped movie IDs from localStorage
      const { data: swipedIds } = await movieService.getSwipedMovieIds(userId)
      console.log('Swiped movie IDs count:', swipedIds.length);
      
      let allUnseenMovies = [];
      let currentPage = page;
      const maxPages = 5; // Try up to 5 pages to find unseen movies
      
      // Keep fetching pages until we have enough unseen movies or hit max pages
      while (allUnseenMovies.length < 10 && currentPage <= maxPages) {
        console.log(`Getting movies from TMDB API - Page ${currentPage}`);
        const popularMovies = await tmdbApi.getPopularMovies(currentPage);
        console.log(`Page ${currentPage}: ${popularMovies.results?.length} movies received`);
        
        // Filter out already swiped movies
        const unseenMovies = popularMovies.results.filter(
          movie => !swipedIds.includes(movie.id)
        );
        
        console.log(`Page ${currentPage}: ${unseenMovies.length} unseen movies`);
        allUnseenMovies = [...allUnseenMovies, ...unseenMovies];
        currentPage++;
        
        // If we found enough movies, break early
        if (allUnseenMovies.length >= 20) break;
      }
      
      console.log(`Total unseen movies found: ${allUnseenMovies.length}`);
      console.log('First few unseen movies:', allUnseenMovies.slice(0, 3).map(m => ({id: m.id, title: m.title})));

      // If still no movies found, fall back to mock data
      if (allUnseenMovies.length === 0) {
        console.log('No unseen movies found in TMDB, using mock data fallback');
        const unseenMockMovies = MOCK_MOVIES.filter(
          movie => !swipedIds.includes(movie.id)
        );
        const shuffled = unseenMockMovies.sort(() => 0.5 - Math.random());
        return { movies: shuffled, error: null };
      }

      return { movies: allUnseenMovies, error: null }
    } catch (error) {
      console.error('Error getting movies from TMDB API, falling back to mock data:', error)
      // Fall back to mock data on API failure
      const { data: swipedIds } = await movieService.getSwipedMovieIds(userId)
      const unseenMovies = MOCK_MOVIES.filter(
        movie => !swipedIds.includes(movie.id)
      );
      const shuffled = unseenMovies.sort(() => 0.5 - Math.random());
      console.log('Using mock data fallback, movies count:', shuffled.length);
      return { movies: shuffled, error: null };
    }
  }
}
