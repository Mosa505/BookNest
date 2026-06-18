import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { profileService } from '../../services/profile.service'
import { booksService } from '../../services/books.service'
import { vocabularyService } from '../../services/vocabulary.service'
import { achievementsService } from '../../services/achievements.service'
import { recommendationService } from '../../services/recommendation.service'
import BookCard from '../../components/shared/BookCard'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import ProgressBar from '../../components/ui/ProgressBar'
import { CefrBadge } from '../../components/ui/Badge'
import { formatReadingTime } from '../../utils/formatters'

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [trending, setTrending] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [vocabStats, setVocabStats] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileData, trendingData, recoData, vocabStatsData, achievementsData] = await Promise.all([
          profileService.get(),
          booksService.getTrending(8),
          recommendationService.getForUser(6).catch(() => []),
          vocabularyService.getStats(),
          achievementsService.getUserAchievements(),
        ])
        setProfile(profileData)
        setTrending(trendingData || [])
        setRecommendations(recoData || [])
        setVocabStats(vocabStatsData)
        setAchievements(achievementsData?.data || [])
      } catch {
        // Some data might fail, show what we have
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const stats = profile?.stats || {}

  const quickActions = [
    {
      to: '/books',
      icon: '📚',
      label: 'Browse Books',
      description: 'Discover new reads',
    },
    {
      to: '/categories',
      icon: '📂',
      label: 'Categories',
      description: 'Explore by genre',
    },
    {
      to: '/learn-language',
      icon: '🎯',
      label: 'Learn Language',
      description: 'Improve your level',
    },
    {
      to: '/kids',
      icon: '🧸',
      label: 'Kids Section',
      description: 'Stories for kids',
    },
    {
      to: '/vocabulary',
      icon: '📝',
      label: 'Vocabulary',
      description: 'Word bank',
    },
    {
      to: '/classify-level',
      icon: '📊',
      label: 'Classify Level',
      description: 'Test your CEFR',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="mb-8 p-6 md:p-8 bg-gradient-to-r from-brand-100 to-brand-200 rounded-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-brand-900">
              Welcome back, {user?.full_name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-brand-600 mt-1">
              {profile?.cefr_level ? (
                <span className="inline-flex items-center gap-2">
                  Your level: <CefrBadge level={profile.cefr_level} />
                </span>
              ) : (
                'Ready for your next reading adventure?'
              )}
            </p>
          </div>
          <Link to="/books">
            <Button>Find a Book</Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex flex-col items-center gap-2 p-5 bg-white rounded-2xl border border-brand-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-sm font-semibold text-brand-900">{action.label}</span>
            <span className="text-xs text-brand-400">{action.description}</span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Words Learned', value: vocabStats?.total_words || 0, icon: '📚', bg: 'from-blue-50 to-blue-100' },
          { label: 'Words Mastered', value: vocabStats?.mastered_words || 0, icon: '🎯', bg: 'from-green-50 to-green-100' },
          { label: 'Books Completed', value: stats.booksCompleted || 0, icon: '✅', bg: 'from-amber-50 to-amber-100' },
          { label: 'Reading Time', value: formatReadingTime(stats.totalReadingTimeHours * 3600), icon: '⏱️', bg: 'from-purple-50 to-purple-100' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-brand-900">{stat.value}</p>
                <p className="text-xs text-brand-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Activity */}
      <div className="bg-white rounded-2xl border border-brand-200 shadow-card p-6 mb-8">
        <h3 className="font-heading font-semibold text-brand-900 mb-4">📊 Reading Activity</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-brand-600">This Week</span>
          <span className="text-sm font-semibold text-brand-900">{stats.totalReadingTimeHours?.toFixed(1) || 0} hours</span>
        </div>
        <ProgressBar value={Math.min((stats.totalReadingTimeHours || 0) / 10 * 100, 100)} max={100} />
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold font-heading text-brand-900 mb-4">🏆 Recent Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {achievements.slice(0, 6).map((a) => (
              <div
                key={a.achievement?.id || a.id}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <span className="text-lg">🏆</span>
                <span className="text-sm font-medium text-amber-900">{a.achievements?.name || 'Achievement'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended for You */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold font-heading text-brand-900">🎯 Recommended for You</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {recommendations.slice(0, 6).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Books */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold font-heading text-brand-900">📖 Trending Books</h2>
          <Link to="/books">
            <Button variant="ghost" size="sm">
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
        {trending.length === 0 ? (
          <EmptyState title="No books yet" description="Check back soon for trending reads." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {trending.slice(0, 6).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
