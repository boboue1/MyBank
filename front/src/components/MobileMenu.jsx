import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import './MobileMenu.css'

const NAV_LINKS = [
  { label: 'Dashboard',  path: '/dashboard' },
  { label: 'Operations', path: '/operations' },
  { label: 'Categories', path: '/categories' },
]

export default function MobileMenu({ open, onClose, user, onLogout }) {
  const navigate       = useNavigate()
  const { pathname }   = useLocation()

  if (!open) return null

  const initials = user ? user.firstName[0].toUpperCase() : '?'

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  return createPortal(
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>

        {/* Bouton fermer */}
        <div className="mobile-menu-header">
          <button className="mobile-menu-close" onClick={onClose}>✕</button>
        </div>

        {/* Utilisateur */}
        <div className="mobile-menu-user">
          <div className="mobile-menu-avatar">{initials}</div>
          <div className="mobile-menu-user-info">
            <span className="mobile-menu-user-name">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="mobile-menu-user-sub">Mon compte</span>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="mobile-menu-links">
          {NAV_LINKS.map(({ label, path }) => (
            <button
              key={path}
              className={`mobile-menu-link${pathname.startsWith(path) ? ' active' : ''}`}
              onClick={() => handleNav(path)}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Déconnexion */}
        <div className="mobile-menu-footer">
          <button className="mobile-menu-logout" onClick={onLogout}>
            Déconnexion
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}
