import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const rootEnvPath = path.resolve(__dirname, '../../../.env')
const backendEnvPath = path.resolve(__dirname, '../../.env')
const envPath = fs.existsSync(rootEnvPath) ? rootEnvPath : backendEnvPath
dotenv.config({ path: envPath })

const PYTHON_SERVICE_URL =
  process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:8000'

export const getRecommendations = async (
  userId: string,
  limit = 10,
): Promise<{ recommendations: any[] }> => {
  try {
    const response = await fetch(
      `${PYTHON_SERVICE_URL}/api/recommendations`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, limit }),
      },
    )

    if (!response.ok) {
      console.error(
        `Recommendation service error: ${response.status} ${response.statusText}`,
      )
      return { recommendations: [] }
    }

    const json = (await response.json()) as { recommendations: any[] }
    return { recommendations: json.recommendations || [] }
  } catch (error) {
    console.error('Failed to contact recommendation service:', error instanceof Error ? error.message : error)
    return { recommendations: [] }
  }
}

export const getSimilarBooks = async (
  bookId: string,
  limit = 6,
): Promise<{ similar: any[] }> => {
  try {
    const response = await fetch(
      `${PYTHON_SERVICE_URL}/api/similar-books`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId, limit }),
      },
    )

    if (!response.ok) {
      console.error(
        `Similar books service error: ${response.status} ${response.statusText}`,
      )
      return { similar: [] }
    }

    const json = (await response.json()) as { similar: any[] }
    return { similar: json.similar || [] }
  } catch (error) {
    console.error('Failed to contact recommendation service:', error instanceof Error ? error.message : error)
    return { similar: [] }
  }
}
