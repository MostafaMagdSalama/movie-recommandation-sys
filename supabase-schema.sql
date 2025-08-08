-- Movie Recommendation System Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create the swipes table
CREATE TABLE public.swipes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike', 'not_sure')),
    movie_title TEXT,
    movie_genres INTEGER[],
    movie_poster TEXT,
    movie_overview TEXT,
    movie_rating DECIMAL(3,1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_swipes_user_id ON public.swipes(user_id);
CREATE INDEX idx_swipes_movie_id ON public.swipes(movie_id);
CREATE INDEX idx_swipes_vote_type ON public.swipes(vote_type);
CREATE INDEX idx_swipes_created_at ON public.swipes(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own swipes
CREATE POLICY "Users can view their own swipes" ON public.swipes
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own swipes
CREATE POLICY "Users can insert their own swipes" ON public.swipes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own swipes
CREATE POLICY "Users can update their own swipes" ON public.swipes
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own swipes
CREATE POLICY "Users can delete their own swipes" ON public.swipes
    FOR DELETE USING (auth.uid() = user_id);

-- Optional: Create a view for liked movies with additional info
CREATE OR REPLACE VIEW public.liked_movies AS
SELECT 
    s.*,
    COUNT(*) OVER (PARTITION BY s.user_id) as total_likes
FROM public.swipes s
WHERE s.vote_type = 'like'
ORDER BY s.created_at DESC;

-- Grant necessary permissions
GRANT ALL ON public.swipes TO authenticated;
GRANT ALL ON public.liked_movies TO authenticated;
GRANT USAGE ON SEQUENCE public.swipes_id_seq TO authenticated;
