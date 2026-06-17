-- Create a function to get random books for recommendation fallback
CREATE OR REPLACE FUNCTION get_random_books(limit_count INTEGER)
RETURNS SETOF books
LANGUAGE sql
AS $$
  SELECT * FROM books ORDER BY RANDOM() LIMIT limit_count;
$$;

