-- Change quizzes.id from UUID to TEXT for human-readable IDs
-- This allows us to use IDs like "survey-30days" instead of random UUIDs

-- Drop existing foreign key constraint
ALTER TABLE quiz_responses DROP CONSTRAINT IF EXISTS quiz_responses_quiz_id_fkey;

-- Change the column types
ALTER TABLE quizzes ALTER COLUMN id SET DATA TYPE TEXT;
ALTER TABLE quiz_responses ALTER COLUMN quiz_id SET DATA TYPE TEXT;

-- Recreate the foreign key constraint
ALTER TABLE quiz_responses
  ADD CONSTRAINT quiz_responses_quiz_id_fkey
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE;

-- Comment
COMMENT ON COLUMN quizzes.id IS 'Human-readable quiz identifier (e.g., survey-30days)';
COMMENT ON COLUMN quiz_responses.quiz_id IS 'Reference to quiz by human-readable ID';
