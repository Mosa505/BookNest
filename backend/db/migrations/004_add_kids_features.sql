-- Migration: Add Kids Section Features
-- Description: Adds kids-specific achievements and enhances the schema for the kids section
-- Compatible with Supabase PostgreSQL

-- Insert kids-specific achievements (idempotent)
INSERT INTO achievements (name, description, badge_color, criteria_json) VALUES
('Little Reader', 'Read your first kids book', '#FF69B4', '{"type":"book_completed","category":"Kids","count":1}'),
('Quiz Whiz Kid', 'Score 100% on a kids book quiz', '#FFD700', '{"type":"quiz_score","category":"Kids","score":100}'),
('Note Buddy', 'Write your first note on a kids book', '#87CEEB', '{"type":"note_created","category":"Kids","count":1}'),
('Story Explorer', 'Read 3 kids books', '#32CD32', '{"type":"book_completed","category":"Kids","count":3}'),
('Super Reader', 'Read 5 kids books', '#FF1493', '{"type":"book_completed","category":"Kids","count":5}')
ON CONFLICT (name) DO NOTHING;

-- Add age_group column to books table for better kids section filtering
ALTER TABLE books ADD COLUMN IF NOT EXISTS age_group TEXT CHECK (age_group IN ('3-5', '5-8', '8-12'));

-- Add index for age_group queries
CREATE INDEX IF NOT EXISTS idx_books_age_group ON books(age_group);

-- Add partial index for category='Kids' queries
CREATE INDEX IF NOT EXISTS idx_books_kids ON books(category) WHERE category = 'Kids';

-- Update existing kids books with age_group based on difficulty
UPDATE books SET age_group = '3-5' WHERE category = 'Kids' AND difficulty = 'A1' AND age_group IS NULL;
UPDATE books SET age_group = '5-8' WHERE category = 'Kids' AND difficulty = 'A2' AND age_group IS NULL;
UPDATE books SET age_group = '8-12' WHERE category = 'Kids' AND difficulty = 'B1' AND age_group IS NULL;

-- Add trigger to automatically set age_group based on difficulty for new kids books
CREATE OR REPLACE FUNCTION set_kids_age_group()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.category = 'Kids' AND NEW.age_group IS NULL THEN
    IF NEW.difficulty = 'A1' THEN
      NEW.age_group = '3-5';
    ELSIF NEW.difficulty = 'A2' THEN
      NEW.age_group = '5-8';
    ELSIF NEW.difficulty = 'B1' THEN
      NEW.age_group = '8-12';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_kids_age_group ON books;
CREATE TRIGGER trigger_set_kids_age_group
BEFORE INSERT OR UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION set_kids_age_group();
