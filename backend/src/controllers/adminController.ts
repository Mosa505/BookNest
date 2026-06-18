import { Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabase'

export const getPlatformStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const [
      profilesRes,
      booksRes,
      categoriesRes,
      quizzesRes,
      achievementsRes,
      progressRes,
      completedRes,
      quizRes,
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('books').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('categories').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('quiz_results').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('achievements').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('user_progress').select('time_spent_seconds'),
      supabaseAdmin.from('user_progress').select('id', { count: 'exact', head: true }).eq('is_completed', true),
      supabaseAdmin.from('quiz_results').select('score'),
    ])

    const progressData = progressRes.data || []
    const quizData = quizRes.data || []

    const totalReadTime = progressData.reduce(
      (sum: number, p: any) => sum + (p.time_spent_seconds || 0),
      0,
    )

    const avgScore =
      quizData.length > 0
        ? quizData.reduce((sum: number, q: any) => sum + (q.score || 0), 0) / quizData.length
        : 0

    res.json({
      success: true,
      data: {
        total_users: profilesRes.count || 0,
        total_books: booksRes.count || 0,
        total_categories: categoriesRes.count || 0,
        total_quizzes_taken: quizzesRes.count || 0,
        total_achievements: achievementsRes.count || 0,
        total_reading_time_hours: Math.round((totalReadTime / 3600) * 100) / 100,
        total_books_completed: completedRes.count || 0,
        average_quiz_score: avgScore.toFixed(2),
      },
    })
  } catch (error: any) {
    console.error('Error fetching platform stats:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const createBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      title,
      author,
      description,
      category,
      content,
      age_group,
      difficulty,
      cover_image_url,
    } = req.body

    if (!title || !author || !description) {
      res.status(400).json({
        error: 'Title, author, and description are required',
      })
      return
    }

    const validAgeGroups = ['3-5', '5-8', '8-12']
    if (age_group && !validAgeGroups.includes(age_group)) {
      res.status(400).json({ error: 'Age group must be 3-5, 5-8, or 8-12' })
      return
    }

    const validDifficulties = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    if (difficulty && !validDifficulties.includes(difficulty)) {
      res.status(400).json({ error: 'Invalid difficulty level' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('books')
      .insert({
        title,
        author,
        description,
        category: category || null,
        content: content || null,
        age_group: age_group || null,
        difficulty: difficulty || 'B1',
        total_pages: 100,
        cover_image_url: cover_image_url || null,
        views: 0,
        rating: 0,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error creating book:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const updateBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bookId = req.params.id
    const {
      title,
      author,
      description,
      category,
      difficulty,
      total_pages,
      cover_image_url,
      rating,
      content,
      age_group,
    } = req.body

    const { data: check } = await supabaseAdmin
      .from('books')
      .select('id')
      .eq('id', bookId)
      .single()

    if (!check) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    const updates: any = { updated_at: new Date().toISOString() }

    if (title !== undefined) updates.title = title
    if (author !== undefined) updates.author = author
    if (description !== undefined) updates.description = description
    if (category !== undefined) updates.category = category
    if (difficulty !== undefined) {
      const validDifficulties = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
      if (!validDifficulties.includes(difficulty)) {
        res.status(400).json({ error: 'Invalid difficulty level' })
        return
      }
      updates.difficulty = difficulty
    }
    if (total_pages !== undefined) {
      const pages = parseInt(total_pages, 10)
      if (isNaN(pages) || pages <= 0) {
        res.status(400).json({ error: 'Total pages must be a positive number' })
        return
      }
      updates.total_pages = pages
    }
    if (cover_image_url !== undefined) updates.cover_image_url = cover_image_url
    if (rating !== undefined) {
      if (typeof rating !== 'number' || rating < 0 || rating > 5) {
        res.status(400).json({ error: 'Rating must be between 0 and 5' })
        return
      }
      updates.rating = rating
    }
    if (content !== undefined) updates.content = content
    if (age_group !== undefined) {
      const validAgeGroups = ['3-5', '5-8', '8-12']
      if (!validAgeGroups.includes(age_group)) {
        res.status(400).json({ error: 'Age group must be 3-5, 5-8, or 8-12' })
        return
      }
      updates.age_group = age_group
    }

    const { data, error } = await supabaseAdmin
      .from('books')
      .update(updates)
      .eq('id', bookId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error updating book:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const deleteBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bookId = req.params.id

    const { data: check } = await supabaseAdmin
      .from('books')
      .select('id')
      .eq('id', bookId)
      .single()

    if (!check) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    const { error } = await supabaseAdmin
      .from('books')
      .delete()
      .eq('id', bookId)

    if (error) throw error

    res.json({
      success: true,
      message: 'Book deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting book:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { limit = 50, offset = 0 } = req.query

    const limitNum = Math.min(parseInt(limit as string) || 50, 100)
    const offsetNum = Math.max(0, parseInt(offset as string) || 0)

    const { data, error, count } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, cefr_level, created_at, is_admin', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offsetNum, offsetNum + limitNum - 1)

    if (error) throw error

    const enriched = await Promise.all(
      (data || []).map(async (profile: any) => {
        const [{ count: booksCompleted }, { count: wordsLearned }] = await Promise.all([
          supabaseAdmin
            .from('user_progress')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', profile.id)
            .eq('is_completed', true),
          supabaseAdmin
            .from('vocabulary')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', profile.id),
        ])
        return { ...profile, isAdmin: profile.is_admin, books_completed: booksCompleted || 0, words_learned: wordsLearned || 0 }
      })
    )

    res.json({
      success: true,
      data: enriched,
      count: count || 0,
      limit: limitNum,
      offset: offsetNum,
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const makeUserAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.userId

    const { data: check } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (!check) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error making user admin:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const removeUserAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.userId

    const { data: check } = await supabaseAdmin
      .from('profiles')
      .select('id, is_admin')
      .eq('id', userId)
      .single()

    if (!check) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const { count: adminCount } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_admin', true)

    if ((adminCount || 0) <= 1 && check.is_admin) {
      res.status(400).json({ error: 'Cannot remove the last admin user' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_admin: false })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error removing user admin:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}