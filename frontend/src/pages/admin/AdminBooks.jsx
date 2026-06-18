import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { booksService } from '../../services/books.service'
import { adminService } from '../../services/admin.service'
import { useToast } from '../../hooks/useToast'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { CefrBadge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatters'
import { CEFR_LEVELS, CEFR_LABELS } from '../../utils/constants'

const AGE_GROUPS = ['3-5', '5-8', '8-12']

export default function AdminBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    content: '',
    age_group: '',
    difficulty: '',
  })
  const { success, error: toastError } = useToast()

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const result = await booksService.getAll({ limit: 100 })
      setBooks(result.data || [])
    } catch {
      toastError('Failed to load books')
    } finally {
      setLoading(false)
    }
  }, [toastError])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await booksService.getCategories()
      setCategories(data || [])
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [fetchBooks, fetchCategories])

  function openCreate() {
    setEditingBook(null)
    setForm({ title: '', author: '', description: '', category: '', content: '', age_group: '', difficulty: '' })
    setPdfFile(null)
    setCoverFile(null)
    setModalOpen(true)
  }

  function openEdit(book) {
    setEditingBook(book)
    setForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      category: book.category || '',
      content: book.content || '',
      age_group: book.age_group || '',
      difficulty: book.difficulty || '',
    })
    setPdfFile(null)
    setCoverFile(null)
    setModalOpen(true)
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim() || !form.description.trim()) {
      toastError('Title, author, and description are required')
      return
    }

    const isKids = form.category === 'Kids'

    if (isKids && !form.content.trim()) {
      toastError('Please enter story content for kids books')
      return
    }

    if (!isKids && !pdfFile && !editingBook) {
      toastError('Please upload a PDF file')
      return
    }

    setSaving(true)
    try {
      let bookId = editingBook?.id
      const bookData = {
        title: form.title,
        author: form.author,
        description: form.description,
        category: form.category || null,
      }

      if (isKids) {
        bookData.content = form.content
        bookData.age_group = form.age_group || null
      }

      if (form.difficulty) {
        bookData.difficulty = form.difficulty
      }

      if (!editingBook) {
        const book = await adminService.createBook(bookData)
        bookId = book.id
      } else {
        await adminService.updateBook(editingBook.id, bookData)
      }

      if (pdfFile) {
        await adminService.uploadBookContent(bookId, pdfFile)
        success('PDF uploaded and classified!')
      }

      if (coverFile) {
        await adminService.uploadBookCover(bookId, coverFile)
      }

      setModalOpen(false)
      fetchBooks()
      success(editingBook ? 'Book updated!' : 'Book created!')
    } catch (err) {
      toastError(err.response?.data?.error || 'Failed to save book')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this book?')) return
    try {
      await adminService.deleteBook(id)
      success('Book deleted')
      fetchBooks()
    } catch {
      toastError('Failed to delete book')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const isKids = form.category === 'Kids'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/admin" className="text-sm text-brand-600 hover:text-brand-900">Admin</Link>
            <span className="text-brand-300">/</span>
            <span className="text-sm text-brand-900 font-medium">Books</span>
          </div>
          <h1 className="text-3xl font-bold font-heading text-brand-900">Manage Books</h1>
          <p className="text-brand-500 mt-1">{books.length} books in the library</p>
        </div>
        <Button onClick={openCreate}>Add Book</Button>
      </div>

      {books.length === 0 ? (
        <EmptyState
          title="No books yet"
          description="Add your first book to get started."
          action={<Button onClick={openCreate}>Add Book</Button>}
        />
      ) : (
        <div className="bg-white rounded-xl border border-brand-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-50 border-b border-brand-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-brand-700">Title</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-brand-700">Author</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-brand-700">Level</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-brand-700 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-brand-700 hidden lg:table-cell">Added</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-brand-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-brand-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-brand-900">{book.title}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-600">{book.author}</td>
                    <td className="px-4 py-3"><CefrBadge level={book.difficulty} /></td>
                    <td className="px-4 py-3 text-sm text-brand-500 hidden md:table-cell">{book.category || '-'}</td>
                    <td className="px-4 py-3 text-sm text-brand-400 hidden lg:table-cell">{formatDate(book.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(book)}
                          className="p-2 text-brand-400 hover:text-brand-600 hover:bg-brand-100 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

       {/* Create/Edit Modal */}
       <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingBook ? 'Edit Book' : 'Add New Book'} size="lg">
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-brand-700 mb-1.5">Title *</label>
               <input
                 type="text"
                 value={form.title}
                 onChange={(e) => handleFormChange('title', e.target.value)}
                 className="input-field"
                 required
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-brand-700 mb-1.5">Author *</label>
               <input
                 type="text"
                 value={form.author}
                 onChange={(e) => handleFormChange('author', e.target.value)}
                 className="input-field"
                 required
               />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium text-brand-700 mb-1.5">Description *</label>
             <textarea
               value={form.description}
               onChange={(e) => handleFormChange('description', e.target.value)}
               className="input-field resize-none min-h-[80px]"
               required
             />
           </div>

           {/* Category Dropdown */}
           <div>
             <label className="block text-sm font-medium text-brand-700 mb-1.5">Category *</label>
             <select
               value={form.category}
               onChange={(e) => handleFormChange('category', e.target.value)}
               className="input-field w-full"
               required
             >
               <option value="">Select a category...</option>
               {categories.map((cat) => (
                 <option key={cat.name} value={cat.name}>{cat.name}</option>
               ))}
             </select>
           </div>

           {/* Kids-specific fields */}
           {isKids && (
             <>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-brand-700 mb-1.5">Age Group</label>
                   <select
                     value={form.age_group}
                     onChange={(e) => handleFormChange('age_group', e.target.value)}
                     className="input-field w-full"
                   >
                     <option value="">Select age group...</option>
                     {AGE_GROUPS.map((age) => (
                       <option key={age} value={age}>Ages {age}</option>
                     ))}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-brand-700 mb-1.5">Difficulty Level</label>
                   <select
                     value={form.difficulty}
                     onChange={(e) => handleFormChange('difficulty', e.target.value)}
                     className="input-field w-full"
                   >
                     <option value="">Auto-classify from PDF</option>
                     {CEFR_LEVELS.map((level) => (
                       <option key={level} value={level}>{level} - {CEFR_LABELS[level]}</option>
                     ))}
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-brand-700 mb-1.5">Story Content *</label>
                 <textarea
                   value={form.content}
                   onChange={(e) => handleFormChange('content', e.target.value)}
                   className="input-field resize-none min-h-[200px] font-mono text-sm"
                   placeholder="Type or paste the story text here..."
                   required
                 />
                 <p className="text-xs text-brand-400 mt-1">This text will be displayed in the kids book reader.</p>
               </div>
             </>
           )}

           {/* PDF Upload - hidden for kids books */}
           {!isKids && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-brand-700 mb-1.5">Book PDF *</label>
                 <input
                   type="file"
                   accept=".pdf"
                   onChange={(e) => setPdfFile(e.target.files[0])}
                   className="input-field"
                   required={!editingBook}
                 />
                 {pdfFile && <p className="text-xs text-brand-500 mt-1">{pdfFile.name}</p>}
               </div>
               <div>
                 <label className="block text-sm font-medium text-brand-700 mb-1.5">Difficulty Level</label>
                 <select
                   value={form.difficulty}
                   onChange={(e) => handleFormChange('difficulty', e.target.value)}
                   className="input-field w-full"
                 >
                   <option value="">Auto-classify from PDF</option>
                   {CEFR_LEVELS.map((level) => (
                     <option key={level} value={level}>{level} - {CEFR_LABELS[level]}</option>
                   ))}
                 </select>
               </div>
             </div>
           )}

           {/* Cover Image - always available */}
           <div>
             <label className="block text-sm font-medium text-brand-700 mb-1.5">Cover Image</label>
             <input
               type="file"
               accept="image/*"
               onChange={(e) => setCoverFile(e.target.files[0])}
               className="input-field"
             />
             {coverFile && <p className="text-xs text-brand-500 mt-1">{coverFile.name}</p>}
           </div>

           <div className="flex gap-3 pt-2">
             <Button type="submit" loading={saving}>{editingBook ? 'Update Book' : 'Create Book'}</Button>
             <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
           </div>
         </form>
       </Modal>
    </div>
  )
}
