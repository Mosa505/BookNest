import { Routes, Route, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'
import ProtectedRoute from './components/shared/ProtectedRoute'
import AdminRoute from './components/shared/AdminRoute'
import LandingPage from './pages/dashboard/LandingPage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/dashboard/Dashboard'
import BooksList from './pages/books/BooksList'
import BookDetail from './pages/books/BookDetail'
import QuizPage from './pages/reader/QuizPage'
import QuizResults from './pages/reader/QuizResults'
import ClassifyLevel from './pages/reader/ClassifyLevel'
import BookReaderPage from './pages/reader/BookReaderPage'
import VocabularyList from './pages/vocabulary/VocabularyList'
import ProfilePage from './pages/profile/ProfilePage'
import NotesPage from './pages/notes/NotesPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBooks from './pages/admin/AdminBooks'
import AdminUsers from './pages/admin/AdminUsers'
import NotFound from './pages/NotFound'
// New pages
import KidsPage from './pages/kids/KidsPage'
import KidsQuizPage from './pages/kids/KidsQuizPage'
import KidsQuizResults from './pages/kids/KidsQuizResults'
import KidsNotesPage from './pages/kids/KidsNotesPage'
import KidsBadgesPage from './pages/kids/KidsBadgesPage'
import KidsBookReaderPage from './pages/kids/KidsBookReaderPage'
import CategoriesPage from './pages/categories/CategoriesPage'
import LearnLanguagePage from './pages/language/LearnLanguagePage'
import AboutPage from './pages/about/AboutPage'
import KidsNavigation from './components/kids/KidsNavigation'
import { useSessionTracker } from './hooks/useSessionTracker'

function SessionTrackerWrapper() {
  const { user } = useAuth()
  useSessionTracker(user?.id)
  return null
}

export default function App() {
  const location = useLocation()
  const isKidsPage = location.pathname.startsWith('/kids')

  return (
    <>
      <SessionTrackerWrapper />
      <KidsNavigation />
      <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/books/:id/quiz" element={<QuizPage />} />
        <Route path="/books/:id/quiz/results" element={<QuizResults />} />
        <Route path="/books/:id/read" element={<BookReaderPage />} />
        <Route path="/books/:id/notes" element={<NotesPage />} />
        <Route path="/vocabulary" element={<VocabularyList />} />
        <Route path="/classify-level" element={<ClassifyLevel />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/learn-language" element={<LearnLanguagePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Kids routes - within app layout for authenticated users */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/kids" element={<KidsPage />} />
        <Route path="/kids/books/:id/read" element={<KidsBookReaderPage />} />
        <Route path="/kids/books/:id/quiz" element={<KidsQuizPage />} />
        <Route path="/kids/books/:id/quiz/results" element={<KidsQuizResults />} />
        <Route path="/kids/books/:id/notes" element={<KidsNotesPage />} />
        <Route path="/kids/badges" element={<KidsBadgesPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute><AppLayout /></AdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<AdminBooks />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    {isKidsPage && <div className="h-20" />}
    </>
  )
}
