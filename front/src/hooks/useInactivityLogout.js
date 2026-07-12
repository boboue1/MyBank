import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const TIMEOUT_MS = 5 * 60 * 1000

export default function useInactivityLogout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const timer = useRef(null)

  useEffect(() => {
    if (!user) return

    const reset = () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        logout()
        navigate('/login')
      }, TIMEOUT_MS)
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach((e) => window.addEventListener(e, reset))
    reset()

    return () => {
      clearTimeout(timer.current)
      events.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [user, logout, navigate])
}
