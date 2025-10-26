-- Create quizzes table for storing quiz definitions
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  questions JSONB NOT NULL,
  estimated_time INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create quiz_responses table for storing user quiz submissions
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  synced BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for quiz_responses
CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz_id ON quiz_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_synced ON quiz_responses(synced);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON quiz_responses(created_at DESC);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_quiz ON quiz_responses(user_id, quiz_id);

-- Create trigger to automatically update updated_at for quizzes
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically update updated_at for quiz_responses
CREATE TRIGGER update_quiz_responses_updated_at
  BEFORE UPDATE ON quiz_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE quizzes IS 'Stores quiz definitions and questions';
COMMENT ON COLUMN quizzes.id IS 'Unique identifier for the quiz';
COMMENT ON COLUMN quizzes.title IS 'Title of the quiz';
COMMENT ON COLUMN quizzes.description IS 'Description of the quiz';
COMMENT ON COLUMN quizzes.questions IS 'JSON array of quiz questions';
COMMENT ON COLUMN quizzes.estimated_time IS 'Estimated time to complete in minutes';

COMMENT ON TABLE quiz_responses IS 'Stores user responses to quizzes';
COMMENT ON COLUMN quiz_responses.id IS 'Unique identifier for the response';
COMMENT ON COLUMN quiz_responses.quiz_id IS 'Reference to the quiz';
COMMENT ON COLUMN quiz_responses.user_id IS 'Reference to the user';
COMMENT ON COLUMN quiz_responses.responses IS 'JSON array of user answers';
COMMENT ON COLUMN quiz_responses.started_at IS 'Timestamp when the quiz was started';
COMMENT ON COLUMN quiz_responses.completed_at IS 'Timestamp when the quiz was completed';
COMMENT ON COLUMN quiz_responses.progress IS 'Quiz completion progress (0-100)';
COMMENT ON COLUMN quiz_responses.synced IS 'Whether the response has been synced from offline storage';
