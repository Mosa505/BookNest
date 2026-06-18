import { Router } from 'express'
import { authenticateJWT, requireAdmin } from '../middleware/auth'
import {
  getAchievements,
  getUserAchievements,
  getAchievementById,
  checkAchievements,
} from '../controllers/achievementsController'

const router = Router()

// Public routes - specific routes BEFORE parameterized routes
router.get('/', getAchievements)
router.get('/user', authenticateJWT, getUserAchievements)
router.get('/:id', getAchievementById)

// Protected routes
router.post('/check/:bookId', authenticateJWT, checkAchievements)

export default router
