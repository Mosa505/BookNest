import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { achievementsService } from '../../services/achievements.service'
import Spinner from '../../components/ui/Spinner'

export default function KidsBadgesPage() {
  const [achievements, setAchievements] = useState([])
  const [userAchievements, setUserAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [allAchievements, userAchievementsData] = await Promise.all([
          achievementsService.getKidsAchievements(),
          achievementsService.getUserAchievements(),
        ])
        setAchievements(allAchievements)
        setUserAchievements(userAchievementsData || [])
      } catch {
        // Silent fail
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const isEarned = (achievementId) => {
    return userAchievements.some((ua) => ua.achievement_id === achievementId || ua.id === achievementId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white flex justify-center items-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-pink-600 font-bold">Loading your badges...</p>
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
          <span className="text-6xl block mb-4">🏆</span>
          <h1 className="text-3xl md:text-4xl font-bold font-heading bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
            My Badges!
          </h1>
          <p className="text-brand-600 mt-2 font-medium">
            You've earned {userAchievements.length} out of {achievements.length} badges!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const earned = isEarned(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`p-6 rounded-3xl border-4 text-center transition-all hover:scale-105 ${
                  earned
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-xl'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-6xl mb-3">{earned ? '🏆' : '🔒'}</div>
                <h4 className={`font-bold text-sm mb-1 ${earned ? 'text-brand-900' : 'text-gray-400'}`}>
                  {achievement.name}
                </h4>
                <p className={`text-xs ${earned ? 'text-brand-600' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
                {earned && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">
                      ✨ Earned!
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border-4 border-yellow-200">
            <span className="text-8xl block mb-4">🏆</span>
            <h3 className="text-2xl font-bold text-brand-900 mb-2">No badges yet!</h3>
            <p className="text-brand-500">Complete quizzes and read books to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  )
}
