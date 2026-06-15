import { Router } from 'express'
import { authenticateJWT } from '../middleware/auth'
import {
  getBooks,
  getBookById,
  getCategories,
  getTrending,
  getRecommended,
  getPopularAuthors,
  uploadCover,
  uploadContent,
  handleUploadCover,
  handleUploadContent,
  deleteFile,
} from '../controllers/bookController'

const router = Router()

// Book routes - specific routes BEFORE parameterized routes
router.get('/', authenticateJWT, getBooks)
router.get('/trending', authenticateJWT, getTrending)
router.get('/recommended', authenticateJWT, getRecommended)
router.get('/popular-authors', authenticateJWT, getPopularAuthors)
router.get('/categories', authenticateJWT, getCategories)
router.get('/:id', authenticateJWT, getBookById)

// File upload routes
router.post('/:id/upload-cover', authenticateJWT, uploadCover, handleUploadCover)
router.post('/:id/upload-content', authenticateJWT, uploadContent, handleUploadContent)
router.delete('/:id/delete-file/:type', authenticateJWT, deleteFile)

export default router
