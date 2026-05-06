import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { booksService } from '../../services/books.service'
import BookReader from '../../components/shared/BookReader/BookReader'
import { useReader } from '../../hooks/useReader'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

export default function BookReaderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reader = useReader(id)

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await booksService.getById(id)
        if (!data) {
          setError('Book not found')
        } else if (data.content) {
          // Kids book with text content - redirect to kids reader
          navigate(`/kids/books/${id}/read`)
        } else if (!data?.content_url) {
          setError('This book has no content available.')
        } else {
          setBook(data)
          reader.setTotalPages(data.total_pages || 0)
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load book')
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [id, reader, navigate])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <EmptyState
          icon={
            <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          title="Cannot read book"
          description={error}
          action={
            <Button onClick={() => navigate(`/books/${id}`)} className="bg-white text-brand-900 hover:bg-brand-50">
              Back to Book
            </Button>
          }
        />
      </div>
    )
  }

  return <BookReader book={book} reader={reader} />
}
