import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Dashboard',  path: '/dashboard' },
  { label: 'Operations', path: '/operations' },
  { label: 'Categories', path: '/categories' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const { pathname }      = useLocation()
  const [open, setOpen]   = useState(false)
  const dropRef           = useRef(null)

  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const initials = user ? user.firstName[0].toUpperCase() : '?'

  return (
    <nav className="navbar">

      {/* Logo — dépose ton fichier dans front/public/logo.png */}
      <div className="navbar-logo" onClick={() => navigate('/dashboard')}>
        <img
          src="/logo.png"
          alt=""
          className="navbar-logo-img"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <span className="navbar-brand">
          <span className="brand-my">my</span>Bank
        </span>
      </div>

      {/* Liens de navigation */}
      <div className="navbar-links">
        {NAV_LINKS.map(({ label, path }) => (
          <button
            key={path}
            className={`navbar-link${pathname.startsWith(path) ? ' active' : ''}`}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Droite : cloche + utilisateur */}
      <div className="navbar-right">
        <button className="navbar-bell" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="navbar-user" ref={dropRef} onClick={() => setOpen((v) => !v)}>
          <div className="navbar-avatar">{initials}</div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.firstName}</span>
            <span className="navbar-user-sub">Mon compte</span>
          </div>
          <span className="navbar-chevron">▾</span>

          {open && (
            <div className="navbar-dropdown">
              <button
                className="navbar-dropdown-item"
                onClick={(e) => { e.stopPropagation(); logout() }}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>

        {/* Hamburger mobile */}
        <button className="navbar-hamburger" onClick={() => navigate('/dashboard')}>
          <span /><span /><span />
        </button>
      </div>

    </nav>
  )
}
