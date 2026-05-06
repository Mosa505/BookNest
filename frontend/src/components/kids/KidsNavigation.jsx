import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/kids', emoji: '🏠', label: 'Home' },
  { path: '/kids/badges', emoji: '🏆', label: 'Badges' },
  { path: '/books', emoji: '📚', label: 'Books' },
]

export default function KidsNavigation() {
  const location = useLocation()
  const isKidsPage = location.pathname.startsWith('/kids')

  if (!isKidsPage) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-pink-300 shadow-2xl z-50 kids-theme">
      <div className="max-w-4xl mx-auto flex justify-around items-center py-3 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive
                  ? 'bg-pink-100 scale-110'
                  : 'hover:bg-pink-50'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className={`text-xs font-bold ${isActive ? 'text-pink-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
