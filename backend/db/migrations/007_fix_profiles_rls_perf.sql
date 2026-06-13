-- Migration: Fix RLS policy performance on profiles
-- Description: Wraps auth.uid() in a subquery to avoid per-row re-evaluation.
-- Run this in the Supabase Dashboard SQL Editor.

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate with InitPlan optimization (SELECT subquery caches auth.uid() once per statement)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);
