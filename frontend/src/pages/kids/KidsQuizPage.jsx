import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { booksService } from '../../services/books.service'
import { readerService } from '../../services/reader.service'
import { achievementsService } from '../../services/achievements.service'
import QuizComponent from '../../components/shared/QuizComponent'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function KidsQuizPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const bookData = await booksService.getById(id)
        setBook(bookData)

        const quizData = await readerService.getQuiz(id, { numQuestions: 5 })
        setQuestions(quizData.questions || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  async function handleSubmit(totalQuestions, answers, score) {
    try {
      await readerService.submitQuiz(id, answers, score, totalQuestions)

      if (score === 100) {
        try {
          await achievementsService.getUserAchievements()
        } catch {
          // Silent fail
        }
      }

      window.location.href = `/kids/books/${id}/quiz/results?score=${score}&total=${totalQuestions}`
    } catch {
      alert('Failed to submit quiz. Please try again!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white flex justify-center items-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-pink-600 font-bold">Loading your quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <EmptyState
            title="Oops! Quiz not found"
            description={error}
            action={
              <Link to={`/kids`}>
                <button className="px-6 py-3 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 transition-colors">
                  Back to Kids Corner 🏠
                </button>
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <EmptyState
            icon={<span className="text-8xl">🎮</span>}
            title="No questions yet!"
            description="The quiz is being prepared. Try another book!"
            action={
              <Link to={`/kids`}>
                <button className="px-6 py-3 bg-purple-500 text-white font-bold rounded-2xl hover:bg-purple-600 transition-colors">
                  Choose Another Book 📚
                </button>
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white py-8 kids-theme">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link to={`/kids`} className="text-sm text-pink-600 hover:text-pink-800 inline-flex items-center gap-1 font-bold">
            <span>←</span>
            Back to Kids Corner
          </Link>
        </div>

        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">🎮</span>
          <h1 className="text-3xl md:text-4xl font-bold font-heading bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Fun Quiz Time!
          </h1>
          <p className="text-brand-600 mt-2 font-medium">{book.title}</p>
        </div>

        <div className="bg-white rounded-3xl border-4 border-pink-200 shadow-2xl p-8 max-w-2xl mx-auto">
          <QuizComponent questions={questions} onSubmit={handleSubmit} bookTitle={book.title} />
        </div>
      </div>
    </div>
  )
}
