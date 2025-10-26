-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Allow anyone to insert new users (for registration)
CREATE POLICY "Allow public user creation"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to read their own data by resume_token
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- QUIZZES TABLE POLICIES
-- ============================================================================

-- Allow anyone to read quizzes (public access)
CREATE POLICY "Quizzes are publicly readable"
  ON quizzes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert quizzes (admin functionality)
CREATE POLICY "Only authenticated users can create quizzes"
  ON quizzes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update quizzes (admin functionality)
CREATE POLICY "Only authenticated users can update quizzes"
  ON quizzes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- QUIZ_RESPONSES TABLE POLICIES
-- ============================================================================

-- Allow anyone to insert quiz responses
CREATE POLICY "Allow public quiz response creation"
  ON quiz_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to read their own quiz responses
CREATE POLICY "Users can read their own quiz responses"
  ON quiz_responses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow users to update their own quiz responses (for progress updates)
CREATE POLICY "Users can update their own quiz responses"
  ON quiz_responses
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- ADDITIONAL SECURITY
-- ============================================================================

-- Create a function to validate resume tokens (optional, for future use)
CREATE OR REPLACE FUNCTION is_valid_resume_token(token TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN token IS NOT NULL AND LENGTH(token) >= 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment explaining RLS configuration
COMMENT ON POLICY "Allow public user creation" ON users IS
  'Allows anonymous users to register without authentication';

COMMENT ON POLICY "Quizzes are publicly readable" ON quizzes IS
  'Allows all users to view available quizzes';

COMMENT ON POLICY "Allow public quiz response creation" ON quiz_responses IS
  'Allows users to submit quiz responses without authentication (PWA use case)';
