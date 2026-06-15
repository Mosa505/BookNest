import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { booksService } from '../../services/books.service'
import { profileService } from '../../services/profile.service'
import BookCard from '../../components/shared/BookCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

export default function LandingPage() {
  const [trending, setTrending] = useState([])
  const [categories, setCategories] = useState([])
  const [topReaders, setTopReaders] = useState([])
  const [popularAuthors, setPopularAuthors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [trendingData, categoriesData, topReadersData, authorsData] = await Promise.all([
          booksService.getRecommended(12),
          booksService.getCategories(),
          profileService.getTopReaders(),
          booksService.getPopularAuthors(),
        ])
        setTrending(trendingData || [])
        setCategories(categoriesData || [])
        setTopReaders(topReadersData || [])
        setPopularAuthors(authorsData || [])
      } catch {
        // Fail silently for landing page
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Curated Collection',
      description: 'Hand-picked books organized by genre and difficulty level for every reader.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Personalized',
      description: 'Get personalized recommendations based on your reading level and interests.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Ad-Free Reading',
      description: 'Enjoy uninterrupted reading without any distractions or advertisements.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Track Progress',
      description: 'Monitor your reading journey with detailed statistics and achievements.',
    },
  ]

  const spotlightBook = trending[0]
  const firstRow = trending.slice(0, 6)
  const secondRow = trending.slice(6, 12)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-brand-900 leading-tight">
              Discover Your Next
              <br />
              <span className="text-brand-700">Great Read</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-brand-500 max-w-xl mx-auto leading-relaxed">
              Immerse yourself in a curated collection of stories that inspire, educate, and transport you to new worlds.
            </p>
            <div className="mt-8">
              <Link to="/books">
                <Button size="lg" className="px-8 py-3.5 text-base shadow-lg hover:shadow-xl transition-shadow">
                  Start Exploring
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>

          {/* Book Covers Display */}
          <div className="mt-14 flex justify-center items-end gap-6 md:gap-10">
            <div className="w-32 md:w-44 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl -rotate-6 transform hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center p-4">
                <span className="text-white text-xl md:text-2xl font-bold font-heading text-center">DAN BROWN</span>
              </div>
            </div>
            <div className="w-36 md:w-52 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 z-10">
              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-white text-lg md:text-2xl font-bold font-heading">THE TELL-TALE HEART</span>
                <span className="text-amber-200 text-xs md:text-sm mt-2">AND OTHER WRITINGS</span>
                <span className="text-amber-100 text-xs mt-3">EDGAR ALLAN POE</span>
              </div>
            </div>
            <div className="w-32 md:w-44 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl rotate-6 transform hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center p-4">
                <span className="text-white text-lg md:text-xl font-bold font-heading text-center">WHAT END OF PARADISE</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-brand-900">10k+</p>
              <p className="text-sm text-brand-500 mt-1">Books Available</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-brand-900">1.2k+</p>
              <p className="text-sm text-brand-500 mt-1">Kids books</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-brand-900">50k+</p>
              <p className="text-sm text-brand-500 mt-1">Active Readers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose BookNest? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-900">
              Why Choose BookNest?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="text-center p-8 bg-white rounded-2xl border border-brand-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold font-heading text-brand-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-brand-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      {spotlightBook && (
        <section className="py-16 bg-brand-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-heading text-brand-900 text-center mb-12">Spotlight</h2>
            <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
              <div className="w-48 md:w-64 flex-shrink-0">
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl bg-cream">
                  <img
                    src={spotlightBook.cover_image_url || 'https://placehold.co/400x600/f5e6d3/8b6f47?text=No+Cover'}
                    alt={spotlightBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                {spotlightBook.category && (
                  <span className="inline-block px-3 py-1 bg-brand-200 text-brand-800 text-xs font-medium rounded-full mb-3">
                    {spotlightBook.category}
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold font-heading text-brand-900">{spotlightBook.title}</h3>
                <p className="text-brand-500 mt-1">By {spotlightBook.author}</p>
                <p className="text-brand-600 mt-4 leading-relaxed line-clamp-4">
                  {spotlightBook.description || 'A captivating book that has captured the hearts of thousands. This masterpiece takes you on a life-changing journey, full of hope and wonder.'}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <Link to={`/books/${spotlightBook.id}/read`}>
                    <Button>Start Reading</Button>
                  </Link>
                  <Link to={`/books/${spotlightBook.id}`}>
                    <Button variant="secondary">Add to Library</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Readers */}
      {topReaders.length > 0 && (
        <section className="py-12 bg-white border-b border-brand-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-semibold font-heading text-brand-900 mb-6">📚 Top Readers</h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {topReaders.map((reader, idx) => {
                const hours = (Math.round((reader.total_site_time_seconds / 3600) * 10) / 10).toFixed(1)
                const initial = (reader.full_name || 'R').charAt(0).toUpperCase()
                return (
                  <div key={reader.id} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:shadow-lg transition-all overflow-hidden">
                      {reader.avatar_url ? (
                        <img src={reader.avatar_url} alt={reader.full_name || 'Reader'} className="w-full h-full object-cover" />
                      ) : (
                        initial
                      )}
                    </div>
                    <span className="text-xs text-brand-600 font-medium truncate max-w-[80px] text-center">
                      {reader.full_name || `Reader ${idx + 1}`}
                    </span>
                    <span className="text-[10px] text-brand-400 -mt-1">{hours} hrs</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Book Grids */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {firstRow.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold font-heading text-brand-900">📖 Trending Now</h3>
                    <Link to="/books" className="text-sm text-brand-600 hover:text-brand-900 font-medium transition-colors flex items-center gap-1">
                      View All
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {firstRow.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              )}

              {secondRow.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold font-heading text-brand-900">🌟 Popular Picks</h3>
                    <Link to="/books" className="text-sm text-brand-600 hover:text-brand-900 font-medium transition-colors flex items-center gap-1">
                      View All
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {secondRow.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Popular Authors */}
      {popularAuthors.length > 0 && (
        <section className="py-16 bg-brand-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold font-heading text-brand-900 mb-2">Popular Authors</h2>
            <p className="text-sm text-brand-500 mb-8">Discover works from our most-read authors</p>
            <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-thin">
              {popularAuthors.map((author, idx) => (
                <Link
                  key={idx}
                  to={`/books?search=${encodeURIComponent(author)}`}
                  className="flex flex-col items-center gap-3 flex-shrink-0 group"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-200 to-brand-400 flex items-center justify-center text-white text-2xl font-bold shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                    {author.charAt(0)}
                  </div>
                  <span className="text-sm text-brand-700 font-medium group-hover:text-brand-900 transition-colors whitespace-nowrap">{author.split(' ').slice(-1)[0]}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join Our Reading Community */}
      <section className="py-20 bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
            <circle cx="100" cy="200" r="150" stroke="white" strokeWidth="0.5" />
            <circle cx="700" cy="200" r="200" stroke="white" strokeWidth="0.5" />
            <circle cx="400" cy="100" r="100" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Join Our Reading Community</h2>
          <p className="text-brand-300 text-base max-w-xl mx-auto mb-12">
            Be part of a growing community of passionate readers and lifelong learners.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: '📚', value: '50K+', label: 'Books Read' },
              { icon: '👥', value: '10,000+', label: 'Members' },
              { icon: '⭐', value: '10k+', label: 'Reviews' },
              { icon: '🌍', value: '500+', label: 'Authors' },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-3xl block mb-2">{stat.icon}</span>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-brand-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
