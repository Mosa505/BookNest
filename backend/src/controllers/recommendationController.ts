import { Request, Response } from 'express'
import * as recommendationService from '../services/recommendationService'

export const getRecommendations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50)

    const result = await recommendationService.getRecommendations(userId, limit)

    res.json({
      success: true,
      data: result.recommendations || [],
    })
  } catch (error: any) {
    console.error('Error getting recommendations:', error.message)
    res.status(500).json({ error: 'Failed to get recommendations' })
  }
}

export const getSimilarBooks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bookId } = req.params
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 20)

    if (!bookId) {
      res.status(400).json({ error: 'Book ID is required' })
      return
    }

    const result = await recommendationService.getSimilarBooks(bookId, limit)

    res.json({
      success: true,
      data: result.similar || [],
    })
  } catch (error: any) {
    console.error('Error getting similar books:', error.message)
    res.status(500).json({ error: 'Failed to get similar books' })
  }
}
