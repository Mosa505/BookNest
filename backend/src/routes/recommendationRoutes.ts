import { Router } from 'express'
import { authenticateJWT } from '../middleware/auth'
import {
  getRecommendations,
  getSimilarBooks,
} from '../controllers/recommendationController'

const router = Router()

router.get('/', authenticateJWT, getRecommendations)
router.get('/similar/:bookId', authenticateJWT, getSimilarBooks)

export default router
