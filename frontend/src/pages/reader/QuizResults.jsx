import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { achievementsService } from '../../services/achievements.service'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function QuizResults() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [newAchievements, setNewAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const score = parseFloat(searchParams.get('score') || '0')
  const total = parseInt(searchParams.get('total') || '0')
  const passed = score >= 70

  async function fetchAchievements() {
    setLoading(true)
    setError(null)
    try {
      const achievementData = await achievementsService.check(id)
      setNewAchievements(achievementData?.newAchievements || [])
    } catch {
      setError('Failed to load achievements')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAchievements()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-red-600">{error}</p>
        <Button size="sm" onClick={fetchAchievements}>Retry</Button>
      </div>
    )
  }

  const scoreColor = passed ? 'text-green-600' : 'text-red-600'
  const bgColor = passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`rounded-2xl border p-8 text-center ${bgColor}`}>
        {passed ? (
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ) : (
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m0 0l2 2m-6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}

        <h1 className="text-2xl font-bold font-heading text-brand-900">
          {passed ? 'Quiz Passed!' : 'Keep Practicing'}
        </h1>

        <p className={`text-5xl font-bold mt-4 ${scoreColor}`}>
          {score.toFixed(0)}%
        </p>
        <p className="text-sm text-brand-500 mt-1">
          You got {Math.round((score / 100) * total)} out of {total} questions correct
        </p>

        {passed && (
          <p className="text-sm text-green-700 mt-3 font-medium">
            Book marked as completed!
          </p>
        )}

        {newAchievements.length > 0 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-medium text-amber-900 mb-2">New Achievements Earned!</h3>
            <div className="flex flex-wrap gap-2">
              {newAchievements.map((a) => (
                <span key={a.id} className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-sm font-medium">
                  {a.name || 'Achievement'}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={`/books/${id}`}>
            <Button>Back to Book</Button>
          </Link>
          {!passed && (
            <Link to={`/books/${id}/quiz`}>
              <Button variant="secondary">Retry Quiz</Button>
            </Link>
          )}
          <Link to="/books">
            <Button variant="ghost">Browse More Books</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
