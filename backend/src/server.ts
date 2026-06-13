import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// Load .env from project root (works for both src/ and build/ directories)
const rootEnvPath = path.resolve(__dirname, '../../.env')
const backendEnvPath = path.resolve(__dirname, '../.env')
const envPath = require('fs').existsSync(rootEnvPath) ? rootEnvPath : backendEnvPath
dotenv.config({ path: envPath })
console.log(`Loading env from: ${envPath}`)

import authRoutes from './routes/authRoutes'
import profileRoutes from './routes/profileRoutes'
import bookRoutes from './routes/bookRoutes'
import progressRoutes from './routes/progressRoutes'
import notesRoutes from './routes/notesRoutes'
import vocabularyRoutes from './routes/vocabularyRoutes'
import aiRoutes from './routes/aiRoutes'
import achievementsRoutes from './routes/achievementsRoutes'
import adminRoutes from './routes/adminRoutes'
import recommendationRoutes from './routes/recommendationRoutes'
import {
  sanitizeSQLPatterns,
  validateQueryLength,
} from './middleware/validation'
import swaggerOptions from './config/swagger'

const app = express()
const PORT = process.env.PORT || 5000

// Swagger configuration
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  }),
)
app.use(express.json())

// Security middleware
app.use(validateQueryLength(1000))
app.use(sanitizeSQLPatterns)

// Swagger UI
app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', swaggerUi.setup(swaggerSpec, { explorer: true }))

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/vocabulary', vocabularyRoutes)
app.use('/api/reader', aiRoutes)
app.use('/api/achievements', achievementsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Something went wrong!' })
})

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(
    `🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`,
  )
  console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n📛 Shutting down gracefully...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

export default app
