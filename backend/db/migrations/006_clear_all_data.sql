-- Migration: Clear all data from the database
-- Description: Deletes all rows from every table while preserving schema.
-- Uses TRUNCATE CASCADE to handle foreign key dependencies automatically.
-- WARNING: This cannot be undone. All user data, books, progress, etc. will be lost.

-- Also clear the ML model ID mapping tables
TRUNCATE TABLE
    book_model_ids,
    user_model_ids;

-- Reset sequences for SERIAL columns (int_id) so new inserts start from 1
TRUNCATE TABLE
    refresh_tokens,
    user_achievements,
    quiz_results,
    notes,
    vocabulary,
    user_progress,
    profiles,
    achievements,
    categories,
    books,
    auth_users
RESTART IDENTITY
CASCADE;

-- Reset the int_id sequences for books and auth_users
ALTER SEQUENCE IF EXISTS auth_users_int_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS books_int_id_seq RESTART WITH 1;

-- Vacuum to reclaim storage
VACUUM ANALYZE;
