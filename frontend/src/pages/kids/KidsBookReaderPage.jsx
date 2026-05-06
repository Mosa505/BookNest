import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { booksService } from '../../services/books.service'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'

export default function KidsBookReaderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fontSize, setFontSize] = useState(18)

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await booksService.getById(id)
        if (!data) {
          setError('Book not found')
        } else {
          setBook(data)
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load book')
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [id])

  function handleFontSizeChange(delta) {
    setFontSize((prev) => Math.max(14, Math.min(28, prev + delta)))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <EmptyState
            title="Oops! Book not found"
            description={error}
            action={
              <Link to="/kids">
                <Button className="bg-pink-500 hover:bg-pink-600">
                  Back to Kids Corner 🏠
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white kids-theme">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-pink-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(`/kids`)}
            className="flex items-center gap-2 text-pink-600 hover:text-pink-800 font-bold"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold text-brand-900 truncate max-w-xs">{book.title}</h1>
            <p className="text-xs text-brand-500">{book.author}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFontSizeChange(-2)}
              className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 font-bold hover:bg-pink-200"
            >
              A-
            </button>
            <span className="text-sm font-medium text-brand-600 w-8 text-center">{fontSize}</span>
            <button
              onClick={() => handleFontSizeChange(2)}
              className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 font-bold hover:bg-pink-200"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border-4 border-pink-200 shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">📖</span>
            <h2 className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {book.title}
            </h2>
            <p className="text-brand-600 mt-2">by {book.author}</p>
          </div>

          {book.content ? (
            <div className="max-w-2xl mx-auto">
              {book.content.split('\n\n').map((paragraph, idx) => (
                <div key={idx} className="mb-8 p-6 bg-white rounded-2xl shadow-lg border-2 border-pink-100">
                  <p
                    className="text-justify leading-relaxed text-brand-800"
                    style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
                  >
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">📝</span>
              <p className="text-brand-500">No content available for this book yet.</p>
            </div>
          )}

          {/* Quiz Button */}
          <div className="mt-12 pt-8 border-t-4 border-pink-100 text-center">
            <Link to={`/kids/books/${id}/quiz`}>
              <Button className="bg-purple-500 hover:bg-purple-600 text-lg py-3 px-8">
                🎮 Take the Quiz!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
