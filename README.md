# MovieSwipe - Tinder for Movies 🎬

A responsive web application that helps users discover their perfect movies through a Tinder-like swiping interface. Built with React, Vite, TailwindCSS, and powered by Supabase and TMDB API.

## Features

- **Swipe Interface**: Intuitive Tinder-like swiping through movie cards
- **Smart Recommendations**: AI-powered movie suggestions based on your preferences
- **User Authentication**: Secure email/password authentication via Supabase
- **Responsive Design**: Beautiful, mobile-first UI with TailwindCSS
- **Movie Data**: Rich movie information from The Movie Database (TMDB)
- **Preference Learning**: Analyzes your likes to recommend similar movies
- **Trailer Integration**: Direct links to movie trailers on YouTube

## Tech Stack

- **Frontend**: Vite + React + TailwindCSS
- **Swipe UI**: react-tinder-card
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Movie API**: The Movie Database (TMDB)
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_TMDB_API_KEY`: Your TMDB API key

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Enable email authentication in your Supabase dashboard

### 4. TMDB API Setup

1. Create an account at [The Movie Database](https://www.themoviedb.org/)
2. Go to Settings > API and request an API key
3. Add your API key to the `.env` file

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to start swiping!

## How It Works

1. **Sign Up/Login**: Users authenticate with email and password
2. **Home Screen**: Welcome screen with instructions and start button
3. **Swiping**: Users swipe through 10 movies, choosing:
   - 👍 Like (swipe right)
   - 👎 Dislike (swipe left)  
   - 🤷 Not Sure (tap button)
4. **Recommendation**: After 10 swipes, the app analyzes preferences and suggests a movie
5. **Accept or Get Another**: Users can accept the recommendation or get a new one

## Database Schema

The app uses a single `swipes` table to store user preferences:

```sql
- id: Primary key
- user_id: Reference to authenticated user
- movie_id: TMDB movie ID
- vote_type: 'like', 'dislike', or 'not_sure'
- movie_title: Movie title for quick reference
- movie_genres: Array of genre IDs
- movie_poster: Poster image path
- movie_overview: Movie description
- movie_rating: TMDB rating
- created_at: Timestamp
```

## API Integration

### TMDB API Endpoints Used:
- `/movie/popular` - Get popular movies for swiping
- `/discover/movie` - Discover movies by genre preferences
- `/movie/{id}` - Get detailed movie information
- `/movie/{id}/recommendations` - Get similar movies
- `/genre/movie/list` - Get all movie genres

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

If you encounter any issues:
1. Check that all environment variables are set correctly
2. Ensure your Supabase database schema is properly set up
3. Verify your TMDB API key is valid
4. Check the browser console for any error messages

Happy movie swiping! 🍿
