import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { booksService } from '../../services/books.service'
import Spinner from '../../components/ui/Spinner'

const ageGroups = [
  { label: '3-5', color: 'from-pink-400 to-rose-400', bg: 'bg-pink-50', text: 'text-pink-700' },
  { label: '5-8', color: 'from-purple-400 to-fuchsia-400', bg: 'bg-purple-50', text: 'text-purple-700' },
  { label: '8-12', color: 'from-amber-400 to-orange-400', bg: 'bg-amber-50', text: 'text-amber-700' },
]

const specialFeatures = [
  {
    emoji: '📖',
    title: 'Interactive Stories',
    description: 'Engaging stories with fun illustrations that bring reading to life.',
    gradient: 'from-pink-100 to-pink-200',
    border: 'border-pink-200',
    link: '/kids',
  },
  {
    emoji: '🎮',
    title: 'Fun Quizzes',
    description: 'Play exciting quizzes after each story to test comprehension.',
    gradient: 'from-purple-100 to-purple-200',
    border: 'border-purple-200',
    link: '/kids#books',
  },
  {
    emoji: '⭐',
    title: 'Earn Rewards',
    description: 'Collect stars and badges as you read more stories.',
    gradient: 'from-yellow-100 to-amber-200',
    border: 'border-yellow-200',
    link: '/kids/badges',
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    description: 'Write down your favorite parts and new words you learn.',
    gradient: 'from-green-100 to-emerald-200',
    border: 'border-green-200',
    link: '/kids#notes',
  },
]

export default function KidsPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAge, setSelectedAge] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await booksService.getKidsBooks(selectedAge)
        setBooks(result.data || [])
      } catch {
        try {
          const result = await booksService.getAll({ category: 'Kids', limit: 20 })
          setBooks(result.data || [])
        } catch {
          // Silent fail
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedAge])

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const result = await achievementsService.getKidsAchievements()
        setAchievements(result)
      } catch {
        // Silent fail
      }
    }
    fetchAchievements()
  }, [])

  // Divide books into sections
  const littleReaders = books.slice(0, 8)
  const growingReaders = books.slice(8, 16)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white">
      {/* Kids Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-30 blur-2xl" />
          <div className="absolute top-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-2xl" />
          <div className="absolute bottom-10 left-1/3 w-28 h-28 bg-yellow-200 rounded-full opacity-30 blur-2xl" />
          {/* Stars */}
          <div className="absolute top-16 left-[20%] text-yellow-400 text-2xl animate-pulse">⭐</div>
          <div className="absolute top-32 right-[25%] text-pink-400 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute top-12 right-[15%] text-purple-400 text-lg animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
              <span className="text-xl">📚</span>
              <span className="text-sm font-medium text-pink-600">Welcome to Kids Corner!</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
                Amazing Stories
              </span>
              <br />
              <span className="text-brand-900">For Amazing Kids!</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-brand-500 max-w-md mx-auto">
              Discover magical stories, learn new words, and go on exciting adventures through reading!
            </p>

            {/* Age Group Selector */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {ageGroups.map((group) => (
                <button
                  key={group.label}
                  onClick={() => setSelectedAge(group.label)}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                    selectedAge === group.label
                      ? `bg-gradient-to-r ${group.color} text-white scale-105`
                      : `${group.bg} ${group.text} hover:opacity-90`
                  }`}
                >
                  Ages {group.label}
                </button>
              ))}
              {selectedAge && (
                <button
                  onClick={() => setSelectedAge(null)}
                  className="px-6 py-3.5 rounded-2xl font-bold text-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Show All
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-brand-900 flex items-center justify-center gap-2">
              <span className="text-pink-500">💖</span>
              What Makes Us Special?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {specialFeatures.map((feature, idx) => (
              <Link
                key={idx}
                to={feature.link}
                className={`block p-6 rounded-3xl bg-gradient-to-br ${feature.gradient} border-4 ${feature.border} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center hover:scale-105`}
              >
                <span className="text-6xl block mb-3 animate-bounce-slow">{feature.emoji}</span>
                <h3 className="text-lg font-bold font-heading text-brand-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-brand-600 leading-relaxed">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Little Readers Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {littleReaders.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl">🐣</span>
                    <h3 className="text-xl font-bold font-heading text-pink-600">Little Readers</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-pink-200 to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {littleReaders.map((book) => (
                      <KidsBookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              )}

              {growingReaders.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl">🌱</span>
                    <h3 className="text-xl font-bold font-heading text-purple-600">Growing Readers</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {growingReaders.map((book) => (
                      <KidsBookCard key={book.id} book={book} variant="purple" />
                    ))}
                  </div>
                </div>
              )}

              {books.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-6xl block mb-4">📚</span>
                  <h3 className="text-xl font-bold text-brand-900 mb-2">Coming Soon!</h3>
                  <p className="text-brand-500">Amazing kids stories are being added. Check back soon!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-brand-900">My Rewards</h2>
            </div>
            <button
              onClick={() => setShowRewards(!showRewards)}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-bold hover:bg-yellow-200 transition-colors"
            >
              {showRewards ? 'Hide' : 'Show All'}
            </button>
          </div>

          {showRewards && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 text-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="text-4xl mb-2">🏆</div>
                  <h4 className="font-bold text-sm text-brand-900">{achievement.name}</h4>
                  <p className="text-xs text-brand-500 mt-1">{achievement.description}</p>
                </div>
              ))}
              {achievements.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-brand-500">Complete quizzes and read books to earn rewards!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reading Adventure CTA */}
      <section className="py-16 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 p-10 md:p-14 text-center text-white shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 text-6xl">📖</div>
              <div className="absolute bottom-4 right-8 text-6xl">🌈</div>
              <div className="absolute top-1/2 left-1/4 text-4xl">⭐</div>
            </div>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">
                Your Reading Adventure!
              </h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">
                Start your magical reading journey today!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { emoji: '📖', value: `${books.length} Stories`, label: 'Available' },
                  { emoji: '⭐', value: `${achievements.length} Badges`, label: 'To Earn' },
                  { emoji: '🎯', value: 'Fun Quizzes', label: 'To Play' },
                ].map((item, idx) => (
                  <div key={idx} className="px-6 py-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <span className="text-2xl block">{item.emoji}</span>
                    <p className="font-bold text-sm mt-1">{item.value}</p>
                    <p className="text-xs text-white/70">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col items-center gap-2">
                <Link to="/kids/badges">
                  <button className="px-8 py-3 bg-white text-pink-600 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    View All Badges! 🏆
                  </button>
                </Link>
                {/* Social-like icons */}
                <div className="flex gap-3 mt-4">
                  {['📘', '📗', '📙', '📕'].map((emoji, idx) => (
                    <span key={idx} className="text-2xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer">{emoji}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Kids-themed Book Card
function KidsBookCard({ book, variant = 'pink' }) {
  const coverUrl = book?.cover_image_url || 'https://placehold.co/300x400/fce7f3/be185d?text=📖'

  const borderColor = variant === 'purple' ? 'border-purple-200 hover:border-purple-300' : 'border-pink-200 hover:border-pink-300'
  const bgColor = variant === 'purple' ? 'bg-purple-50' : 'bg-pink-50'

  return (
    <div className={`group block rounded-2xl border-2 ${borderColor} ${bgColor} shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1`}>
      <Link to={`/kids/books/${book.id}/read`} className="block">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h4 className="font-heading font-bold text-sm text-brand-900 truncate group-hover:text-pink-600 transition-colors">
            {book.title}
          </h4>
          <p className="text-xs text-brand-500 mt-0.5 truncate">{book.author}</p>
          {book.rating && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-400 text-xs">⭐</span>
              <span className="text-xs font-medium text-brand-600">{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="px-3 pb-3 flex gap-2">
        <Link
          to={`/kids/books/${book.id}/read`}
          className="flex-1 text-center py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-bold hover:bg-pink-200 transition-colors"
        >
          📖 Read
        </Link>
        <Link
          to={`/kids/books/${book.id}/quiz`}
          className="flex-1 text-center py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200 transition-colors"
        >
          🎮 Quiz
        </Link>
        <Link
          to={`/kids/books/${book.id}/notes`}
          className="flex-1 text-center py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
        >
          📝 Note
        </Link>
      </div>
    </div>
  )
}
