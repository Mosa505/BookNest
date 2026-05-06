import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppLayout() {
  const location = useLocation()
  const isKidsPage = location.pathname.startsWith('/kids')

  return (
    <div className={`min-h-screen flex flex-col ${isKidsPage ? 'kids-theme' : ''}`}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
