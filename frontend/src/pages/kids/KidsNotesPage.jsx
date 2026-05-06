import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { booksService } from '../../services/books.service'
import { notesService } from '../../services/notes.service'
import { achievementsService } from '../../services/achievements.service'
import { useToast } from '../../hooks/useToast'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function KidsNotesPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [saving, setSaving] = useState(false)
  const { success, error: toastError } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookData, notesData] = await Promise.all([
          booksService.getById(id),
          notesService.getByBook(id, { limit: 100 }),
        ])
        setBook(bookData)
        setNotes(notesData?.data || [])
      } catch {
        toastError('Failed to load notes')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  async function handleAddNote() {
    if (!newContent.trim()) {
      toastError('Note cannot be empty!')
      return
    }

    setSaving(true)
    try {
      await notesService.create(id, pageNumber, newContent.trim())
      success('Note added! 🎉')
      setModalOpen(false)
      setNewContent('')

      try {
        await achievementsService.getUserAchievements()
      } catch {
        // Silent fail
      }

      const notesData = await notesService.getByBook(id, { limit: 100 })
      setNotes(notesData?.data || [])
    } catch (err) {
      toastError(err.response?.data?.error || 'Failed to add note')
    } finally {
      setSaving(false)
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link to={`/kids`} className="text-sm text-pink-600 hover:text-pink-800 inline-flex items-center gap-1 font-bold">
            <span>←</span>
            Back to Kids Corner
          </Link>
        </div>

        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">📝</span>
          <h1 className="text-3xl md:text-4xl font-bold font-heading bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            My Notes
          </h1>
          {book && <p className="text-brand-600 mt-2 font-medium">{book.title}</p>}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => { setNewContent(''); setPageNumber(1); setModalOpen(true) }}
            className="px-8 py-4 bg-green-500 text-white font-bold rounded-2xl shadow-lg hover:bg-green-600 hover:scale-105 transition-all text-lg"
          >
            ✏️ Write a New Note!
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-4 border-green-200">
            <span className="text-8xl block mb-4">📝</span>
            <h3 className="text-2xl font-bold text-brand-900 mb-2">No notes yet!</h3>
            <p className="text-brand-500 mb-6">Write your first note about this story!</p>
            <button
              onClick={() => { setNewContent(''); setPageNumber(1); setModalOpen(true) }}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-colors"
            >
              Add Your First Note! 🎉
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-white rounded-2xl border-4 border-green-200 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Page {note.page_number}
                  </span>
                  <span className="text-xs text-brand-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-brand-700 text-lg leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="✏️ Write a New Note!" size="md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-700 mb-2">Page Number</label>
              <input
                type="number"
                value={pageNumber}
                onChange={(e) => setPageNumber(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-700 mb-2">Your Note</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write about your favorite part of the story! 📖"
                rows="5"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none text-lg resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddNote} loading={saving} className="flex-1 py-3 text-lg">
                Save Note! 🎉
              </Button>
              <Button variant="secondary" onClick={() => setModalOpen(false)} className="py-3">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
