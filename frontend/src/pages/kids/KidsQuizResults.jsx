import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { achievementsService } from '../../services/achievements.service'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function KidsQuizResults() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [newAchievements, setNewAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  const score = parseFloat(searchParams.get('score') || '0')
  const total = parseInt(searchParams.get('total') || '0')
  const passed = score >= 70

  useEffect(() => {
    async function fetchData() {
      try {
        const achievementData = await achievementsService.check(id)
        setNewAchievements(achievementData?.newAchievements || [])

        if (passed) {
          setShowConfetti(true)
          createConfetti()
        }
      } catch {
        // Achievements check is optional
      }
      setLoading(false)
    }
    fetchData()
  }, [id, passed])

  function createConfetti() {
    const colors = ['#FF69B4', '#FFD700', '#00CED1', '#FF6347', '#32CD32', '#9370DB']
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.left = Math.random() * 100 + 'vw'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 3 + 's'
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'
      document.body.appendChild(confetti)

      setTimeout(() => confetti.remove(), 5000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white py-8 kids-theme">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-8xl block mb-4 animate-bounce-slow">
            {passed ? '🎉' : '💪'}
          </span>
        </div>

        <div className={`rounded-3xl border-4 p-8 text-center ${
          passed ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-300'
        }`}>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            {passed ? 'You Did It! 🎉' : 'Keep Trying! 💪'}
          </h1>

          <div className={`text-8xl font-bold my-6 ${
            passed ? 'text-green-600' : 'text-orange-600'
          }`}>
            {score.toFixed(0)}%
          </div>

          <p className="text-lg text-brand-600 mb-4">
            You got {Math.round((score / 100) * total)} out of {total} questions correct!
          </p>

          {passed && (
            <div className="mb-6 p-4 bg-white/60 rounded-2xl">
              <span className="text-4xl">⭐</span>
              <p className="text-green-700 font-bold mt-2">Book completed! Great job!</p>
            </div>
          )}

          {newAchievements.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl">
              <h3 className="font-bold text-amber-900 mb-3 text-lg">🏆 New Badges Earned!</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {newAchievements.map((a) => (
                  <span key={a.id} className="px-4 py-2 bg-yellow-200 text-yellow-900 rounded-full text-sm font-bold">
                    🏆 {a.name || 'Achievement'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={`/kids`}>
              <Button className="py-3 px-6 text-lg bg-pink-500 hover:bg-pink-600">
                Back to Kids Corner 🏠
              </Button>
            </Link>
            {!passed && (
              <Link to={`/kids/books/${id}/quiz`}>
                <Button variant="secondary" className="py-3 px-6 text-lg">
                  Try Again! 🎮
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
