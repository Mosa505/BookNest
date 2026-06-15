import { Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabase'
import * as aiService from '../services/aiService'

export const defineWord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { word } = req.body

    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      res.status(400).json({ error: 'Word is required' })
      return
    }

    const result = await aiService.defineWord(word.trim())

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Error defining word:', error.message)
    res.status(500).json({ error: 'Failed to fetch definition' })
  }
}

export const simplifySentence = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { sentence, cefr_level } = req.body

    if (!sentence || !cefr_level) {
      res.status(400).json({ error: 'Sentence and CEFR level are required' })
      return
    }

    res.status(501).json({ error: 'Simplify sentence is currently being migrated to Gemini.' })
  } catch (error: any) {
    console.error('Error simplifying sentence:', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getQuizQuestions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bookId = req.params.bookId
    const cefrLevel = req.query.cefr_level as string
    const numQuestions = Math.min(Math.max(Number(req.query.numQuestions || 5), 3), 15)

    if (!bookId) {
      res.status(400).json({ error: 'Book ID is required' })
      return
    }

    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .select('title, description, content, difficulty')
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    const content = book.content || book.description || book.title
    const difficulty = book.difficulty || cefrLevel || 'B1'

    const quizData = await aiService.generateQuiz({
      sourceType: 'pdf',
      summary: content,
      questionCount: numQuestions,
      difficulty: 'medium',
      cefrLevel: difficulty
    })

    res.json({
      success: true,
      data: quizData,
    })
  } catch (error: any) {
    console.error('Error getting quiz questions:', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const generateQuizStandalone = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const sourceType = (req.body.sourceType || 'pdf').trim().toLowerCase()
    const summary = req.body.summary || ''
    const topic = req.body.topic || ''
    const questionCount = Math.min(Math.max(Number(req.body.questionCount || 5), 3), 15)
    const difficulty = req.body.difficulty || 'medium'
    const cefrLevel = (req.body.cefrLevel || '').trim().toUpperCase()
    const pdfFile = req.file

    if (!['pdf', 'topic'].includes(sourceType)) {
      res.status(400).json({ error: 'Invalid sourceType. Use "pdf" or "topic".' })
      return
    }

    if (sourceType === 'pdf' && !summary.trim() && !pdfFile) {
      res.status(400).json({ error: 'Please provide either a PDF file or a text summary.' })
      return
    }

    const result = await aiService.generateQuiz({
      sourceType: sourceType as 'pdf' | 'topic',
      summary,
      topic,
      pdfBuffer: pdfFile?.buffer,
      questionCount,
      difficulty,
      cefrLevel
    })

    res.json(result)
  } catch (error: any) {
    console.error('Error generating quiz:', error.message)
    res.status(500).json({ error: error.message || 'Failed to generate quiz.' })
  }
}

export const classifyLevel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const summary = req.body.summary || ''
    const pdfFile = req.file

    if (!summary.trim() && !pdfFile) {
      res.status(400).json({ error: 'Please provide either a PDF file or a text summary.' })
      return
    }

    const result = await aiService.classifyLevel({
      summary,
      pdfBuffer: pdfFile?.buffer
    })

    res.json({
      cefrLevel: result.cefrLevel,
      documentName: pdfFile?.originalname || 'summary-input',
      classificationRecord: {
        documentName: pdfFile?.originalname || 'summary-input',
        cefrLevel: result.cefrLevel,
      },
    })
  } catch (error: any) {
    console.error('Error classifying level:', error.message)
    res.status(500).json({ error: error.message || 'Failed to classify level.' })
  }
}

export const submitQuiz = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { bookId, answers, score, total_questions } = req.body

    if (!bookId || answers === undefined || score === undefined) {
      res.status(400).json({ error: 'Book ID, answers, and score are required' })
      return
    }

    if (typeof score !== 'number' || score < 0 || score > 100) {
      res.status(400).json({ error: 'Score must be between 0 and 100' })
      return
    }

    const { data: quizResult, error: quizError } = await supabaseAdmin
      .from('quiz_results')
      .insert({
        user_id: userId,
        book_id: bookId,
        answers: JSON.stringify(answers),
        score,
        total_questions: total_questions || 0,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (quizError) throw quizError

    if (score >= 70) {
      await supabaseAdmin
        .from('user_progress')
        .update({ is_completed: true })
        .eq('user_id', userId)
        .eq('book_id', bookId)
    }

    const newAchievements: any[] = []

    try {
      const { data: achievements } = await supabaseAdmin
        .from('achievements')
        .select('*')
        .order('id')

      if (achievements) {
        for (const achievement of achievements) {
          let qualifies = false

          const { count: booksCompleted } = await supabaseAdmin
            .from('user_progress')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_completed', true)

          const { count: wordsLearned } = await supabaseAdmin
            .from('vocabulary')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('mastery_level', 1)

          switch (achievement.name) {
            case 'First Steps':
              qualifies = (booksCompleted || 0) >= 1
              break
            case 'Bookworm':
              qualifies = (booksCompleted || 0) >= 5
              break
            case 'Book Collector':
              qualifies = (booksCompleted || 0) >= 10
              break
            case 'Vocabulary Apprentice':
              qualifies = (wordsLearned || 0) >= 10
              break
            case 'Vocabulary Master':
              qualifies = (wordsLearned || 0) >= 50
              break
            case 'Perfect Score':
              qualifies = score === 100
              break
            case 'Reader':
              qualifies = score >= 70
              break
          }

          if (qualifies) {
            const { data: existing } = await supabaseAdmin
              .from('user_achievements')
              .select('id')
              .eq('user_id', userId)
              .eq('achievement_id', achievement.id)
              .single()

            if (!existing) {
              const { data: earned } = await supabaseAdmin
                .from('user_achievements')
                .insert({
                  user_id: userId,
                  achievement_id: achievement.id,
                  earned_at: new Date().toISOString(),
                })
                .select()
                .single()

              if (earned) {
                newAchievements.push({
                  ...achievement,
                  earned_at: earned.earned_at,
                })
              }
            }
          }
        }
      }
    } catch (achievementError) {
      console.error('Error checking achievements:', achievementError)
    }

    res.json({
      success: true,
      data: {
        quiz_result: quizResult,
        new_achievements: newAchievements,
        message: score >= 70 ? 'Quiz passed! Book marked as completed.' : 'Quiz submitted. Keep practicing!',
      },
    })
  } catch (error: any) {
    console.error('Error submitting quiz:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}