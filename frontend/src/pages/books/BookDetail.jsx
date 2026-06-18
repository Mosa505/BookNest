import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { booksService } from '../../services/books.service'
import { progressService } from '../../services/progress.service'
import { recommendationService } from '../../services/recommendation.service'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import BookCard from '../../components/shared/BookCard'
import { CefrBadge } from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { getCompletionPercentage, formatDate } from '../../utils/formatters'

export default function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [progress, setProgress] = useState(null)
  const [similarBooks, setSimilarBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookData, similarData] = await Promise.all([
          booksService.getById(id),
          recommendationService.getSimilarBooks(id).catch(() => []),
        ])
        setBook(bookData)
        setSimilarBooks(similarData || [])

        try {
          const progressData = await progressService.getByBook(id)
          setProgress(progressData)
        } catch {
          // Progress might not exist yet
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load book')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          title="Book not found"
          description={error}
          action={
            <Link to="/books">
              <Button>Back to Books</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const completion = getCompletionPercentage(progress?.current_page || 0, book.total_pages || 100)
  const coverUrl = book.cover_image_url || 'https://placehold.co/400x600/f5e6d3/8b6f47?text=No+Cover'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/books" className="text-sm text-brand-600 hover:text-brand-900 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Books
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cover */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-card bg-cream">
              <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold font-heading text-brand-900">{book.title}</h1>
          <p className="text-lg text-brand-600 mt-1">by {book.author}</p>

          <div className="flex items-center gap-3 mt-4">
            <CefrBadge level={book.difficulty} />
            {book.category && (
              <span className="text-sm text-brand-500">{book.category}</span>
            )}
            {book.rating && (
              <div className="flex items-center gap-1 text-amber-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-medium">{book.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {book.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold font-heading text-brand-900 mb-2">Description</h2>
              <p className="text-brand-600 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Progress */}
          {progress && (
            <div className="mt-6 p-4 bg-white rounded-xl border border-brand-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-brand-900">Reading Progress</h3>
                <span className="text-sm text-brand-500">{completion}%</span>
              </div>
              <ProgressBar value={completion} max={100} showLabel />
              <p className="text-sm text-brand-500 mt-2">
                Page {progress.current_page} of {book.total_pages || '?'}
              </p>
            </div>
          )}

          {/* Meta */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-brand-200">
              <p className="text-sm text-brand-500">Total Pages</p>
              <p className="text-lg font-semibold text-brand-900">{book.total_pages || 'N/A'}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-brand-200">
              <p className="text-sm text-brand-500">Added</p>
              <p className="text-lg font-semibold text-brand-900">{formatDate(book.created_at)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            {book.content_url && (
              <Link to={`/books/${id}/read`}>
                <Button>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Read Book
                </Button>
              </Link>
            )}
            <Link to={`/books/${id}/quiz`}>
              <Button variant="secondary">Take Quiz</Button>
            </Link>
            <Link to={`/books/${id}/notes`}>
              <Button variant="secondary">View Notes</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Books */}
      {similarBooks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold font-heading text-brand-900 mb-6">
            📚 Readers Also Enjoyed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarBooks.slice(0, 6).map((similarBook) => (
              <BookCard key={similarBook.id} book={similarBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
