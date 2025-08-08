-- Create the swipes table to store user movie preferences
CREATE TABLE IF NOT EXISTS swipes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike', 'not_sure')),
  movie_title TEXT,
  movie_genres INTEGER[],
  movie_poster TEXT,
  movie_overview TEXT,
  movie_rating DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_swipes_user_id ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_vote_type ON swipes(vote_type);
CREATE INDEX IF NOT EXISTS idx_swipes_created_at ON swipes(created_at);

-- Enable Row Level Security
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own swipes" ON swipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own swipes" ON swipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own swipes" ON swipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own swipes" ON swipes
  FOR DELETE USING (auth.uid() = user_id);
