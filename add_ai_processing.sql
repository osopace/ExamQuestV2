-- Add AI tracking columns to questions
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS ai_processed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_provider TEXT,
ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ai_explanation TEXT,
ADD COLUMN IF NOT EXISTS topic_id UUID;

-- Create a partial index to make finding unprocessed questions lightning fast
CREATE INDEX IF NOT EXISTS idx_questions_unprocessed 
ON questions (ai_processed) 
WHERE ai_processed = false;

-- Ensure the unique index exists for upserting
-- This is what prevents duplicate questions when refetching
DROP INDEX IF EXISTS idx_questions_unique_source;
CREATE UNIQUE INDEX idx_questions_unique_source 
ON questions (aloc_id, subject, exam_type, year);