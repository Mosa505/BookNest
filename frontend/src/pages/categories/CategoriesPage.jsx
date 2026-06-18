import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { booksService } from '../../services/books.service'
import BookCard from '../../components/shared/BookCard'
import Spinner from '../../components/ui/Spinner'
import SearchBar from '../../components/shared/SearchBar'

const categoryImages = {
  'Fiction': '📚',
  'Non-Fiction': '📖',
  'Science Fiction': '🚀',
  'Fantasy': '🧙',
  'Mystery': '🔍',
  'Romance': '💕',
  'History': '🏛️',
  'Biography': '👤',
  'Self-Help': '🌟',
  'Kids': '🧸',
  'Poetry': '📝',
  'Thriller': '🔥',
  'Adventure': '🗺️',
  'Horror': '👻',
  'Comedy': '😄',
  'Drama': '🎭',
  'Philosophy': '🤔',
  'Science': '🔬',
  'Technology': '💻',
  'Art': '🎨',
}

const categoryColors = [
  'from-amber-100 to-amber-200 border-amber-200',
  'from-rose-100 to-rose-200 border-rose-200',
  'from-sky-100 to-sky-200 border-sky-200',
  'from-emerald-100 to-emerald-200 border-emerald-200',
  'from-violet-100 to-violet-200 border-violet-200',
  'from-orange-100 to-orange-200 border-orange-200',
  'from-teal-100 to-teal-200 border-teal-200',
  'from-pink-100 to-pink-200 border-pink-200',
  'from-indigo-100 to-indigo-200 border-indigo-200',
  'from-lime-100 to-lime-200 border-lime-200',
]

export default function CategoriesPage() {
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category')
  const [categories, setCategories] = useState([])
  const [categoryBooks, setCategoryBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [booksLoading, setBooksLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await booksService.getCategories()
        setCategories(data || [])
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setBooksLoading(true)
      async function fetchBooks() {
        try {
          const result = await booksService.getAll({ category: selectedCategory, limit: 20 })
          setCategoryBooks(result.data || [])
        } catch {
          // silent
        } finally {
          setBooksLoading(false)
        }
      }
      fetchBooks()
    }
  }, [selectedCategory])

  const filteredCategories = searchInput
    ? categories.filter(cat => cat.name.toLowerCase().includes(searchInput.toLowerCase()))
    : categories

  if (selectedCategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/categories" className="text-sm text-brand-600 hover:text-brand-900 inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </Link>
        </div>

        {/* Category Header */}
        <div className="bg-gradient-to-r from-brand-100 to-brand-200 rounded-2xl p-8 md:p-12 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{categoryImages[selectedCategory] || '📚'}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-brand-900">{selectedCategory}</h1>
              <p className="text-brand-600 mt-1">Explore all {selectedCategory.toLowerCase()} books in our collection</p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {booksLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : categoryBooks.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">📭</span>
            <h3 className="text-xl font-bold text-brand-900 mb-2">No books yet</h3>
            <p className="text-brand-500">This category is being populated. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {categoryBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-brand-900">
          Explore Categories
        </h1>
        <p className="text-brand-500 mt-2">Find your perfect read by browsing our curated categories</p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search categories..."
        />
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold text-brand-900 mb-2">No categories found</h3>
          <p className="text-brand-500">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredCategories.map((cat, idx) => (
            <Link
              key={cat.name}
              to={`/categories?category=${encodeURIComponent(cat.name)}`}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${categoryColors[idx % categoryColors.length]} p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">
                {categoryImages[cat.name] || '📚'}
              </span>
              <h3 className="font-heading font-bold text-brand-900 text-base">{cat.name}</h3>
              {cat.description && (
                <p className="text-xs text-brand-600 mt-1 line-clamp-2">{cat.description}</p>
              )}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
