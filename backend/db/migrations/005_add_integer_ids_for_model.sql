-- Migration: Add integer ID columns for recommendation model compatibility
-- Description: Adds auto-incrementing integer IDs to auth_users and books
--              so the SVD++ recommendation model can use them for predictions

-- Add int_id to auth_users
ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS int_id SERIAL UNIQUE;

-- Add int_id to books
ALTER TABLE books ADD COLUMN IF NOT EXISTS int_id SERIAL UNIQUE;

-- Create indexes for fast lookups by int_id
CREATE INDEX IF NOT EXISTS idx_auth_users_int_id ON auth_users(int_id);
CREATE INDEX IF NOT EXISTS idx_books_int_id ON books(int_id);
