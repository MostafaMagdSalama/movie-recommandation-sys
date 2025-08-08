# Database Setup Instructions

## The Problem
Your app is getting a 404 error because the `swipes` table doesn't exist in your Supabase database:
```
Error: Could not find the table 'public.swipes' in the schema cache
```

## Quick Fix (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project: `oofdpfwvkunwsnaegtcp`

### Step 2: Run the SQL Schema
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql` into the editor
4. Click **Run** button

### Step 3: Verify Setup
After running the SQL, you should see:
- ✅ Table `swipes` created
- ✅ Indexes created
- ✅ RLS policies enabled
- ✅ Permissions granted

### Step 4: Test Your App
1. Go back to your movie app
2. Try swiping on movies - it should work now!
3. The "Recommend Another" button should also work properly

## What This Creates

### `swipes` Table Structure:
- `id` - Unique identifier
- `user_id` - Links to authenticated user
- `movie_id` - TMDB movie ID
- `vote_type` - 'like', 'dislike', or 'not_sure'
- `movie_title` - Movie name
- `movie_genres` - Array of genre IDs
- `movie_poster` - Poster image path
- `movie_overview` - Movie description
- `movie_rating` - TMDB rating
- `created_at` - Timestamp

### Security Features:
- **Row Level Security (RLS)** - Users can only see their own swipes
- **Proper indexes** - Fast queries for recommendations
- **Data validation** - Ensures vote_type is valid

## Troubleshooting

### If you get permission errors:
1. Make sure you're signed in to Supabase
2. Verify you have admin access to the project
3. Try refreshing the page and running the SQL again

### If the app still doesn't work:
1. Check your `.env` file has the correct Supabase URL and key
2. Make sure your Supabase project is not paused
3. Check the browser console for any other errors

## Environment Variables
Make sure your `.env` file has:
```
VITE_SUPABASE_URL=https://oofdpfwvkunwsnaegtcp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_TMDB_API_KEY=your_tmdb_key_here
```

After setting up the database, your movie recommendation app should work perfectly! 🎬
