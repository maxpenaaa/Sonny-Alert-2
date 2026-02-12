-- Fix RLS policies for monitors table

-- Disable RLS first to allow operations, then re-enable with proper policies
ALTER TABLE monitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own monitors" ON monitors;
DROP POLICY IF EXISTS "Users can insert their own monitors" ON monitors;
DROP POLICY IF EXISTS "Users can update their own monitors" ON monitors;
DROP POLICY IF EXISTS "Users can delete their own monitors" ON monitors;

-- Create policies for monitors table
CREATE POLICY "Users can view their own monitors"
  ON monitors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monitors"
  ON monitors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monitors"
  ON monitors FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monitors"
  ON monitors FOR DELETE
  USING (auth.uid() = user_id);

-- Also allow service role to bypass RLS (for edge functions)
ALTER TABLE monitors FORCE ROW LEVEL SECURITY;
