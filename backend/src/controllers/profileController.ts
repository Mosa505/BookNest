import { Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabase'

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }

    const currentYear = new Date().getFullYear()
    const yearStart = `${currentYear}-01-01`

    const [
      vocabRes,
      completedRes,
      quizRes,
      timeRes,
    ] = await Promise.all([
      supabaseAdmin
        .from('vocabulary')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseAdmin
        .from('user_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_completed', true),
      supabaseAdmin
        .from('quiz_results')
        .select('score, id')
        .eq('user_id', userId),
      supabaseAdmin
        .from('user_progress')
        .select('time_spent_seconds, updated_at')
        .eq('user_id', userId)
        .gte('updated_at', yearStart), // Only count time spent this year
    ])

    const timeData = timeRes.data || []
    const quizData = quizRes.data || []

    const totalReadTime = timeData.reduce(
      (sum: number, p: any) => sum + (p.time_spent_seconds || 0),
      0,
    ) || 0

    const avgScore =
      quizData.length > 0
        ? Math.round(quizData.reduce((sum: number, q: any) => sum + (q.score || 0), 0) / quizData.length)
        : 0

    const stats = {
      wordsLearned: vocabRes.count || 0,
      booksCompleted: completedRes.count || 0,
      averageQuizScore: avgScore,
      totalQuizzes: quizData.length,
      totalReadingTimeHours: Math.round((totalReadTime / 3600) * 10) / 10,
    }

    res.json({
      success: true,
      data: {
        id: profile.id,
        full_name: profile.full_name,
        cefr_level: profile.cefr_level,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        created_at: profile.created_at,
        reading_goal: profile.reading_goal || 12,
        reading_goal_year: profile.reading_goal_year || currentYear,
        total_site_time_seconds: profile.total_site_time_seconds || 0,
        stats,
      },
    })
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id
    const { full_name, bio, avatar_url, total_site_time_seconds } = req.body

    // Build update object dynamically
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (full_name !== undefined) updates.full_name = full_name || null
    if (bio !== undefined) updates.bio = bio || null
    if (avatar_url !== undefined) updates.avatar_url = avatar_url || null

    // Handle total_site_time_seconds - increment existing value
    if (total_site_time_seconds !== undefined) {
      const { data: currentProfile } = await supabaseAdmin
        .from('profiles')
        .select('total_site_time_seconds')
        .eq('id', userId)
        .single()

      updates.total_site_time_seconds = (currentProfile?.total_site_time_seconds || 0) + total_site_time_seconds
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const updateLevel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id
    const { cefr_level } = req.body

    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    if (!validLevels.includes(cefr_level)) {
      res.status(400).json({ error: 'Invalid CEFR level' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        cefr_level,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error updating level:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getTopReaders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, avatar_url, total_site_time_seconds')
      .order('total_site_time_seconds', { ascending: false })
      .limit(6)

    if (error) throw error

    res.json({
      success: true,
      data: data || [],
    })
  } catch (error: any) {
    console.error('Error fetching top readers:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const updateReadingGoal = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id
    const { reading_goal, reading_goal_year } = req.body

    const year = reading_goal_year || new Date().getFullYear()
    const goal = parseInt(reading_goal) || 12

    if (goal < 1 || goal > 365) {
      res.status(400).json({ error: 'Goal must be between 1 and 365 books' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        reading_goal: goal,
        reading_goal_year: year,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error updating reading goal:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}