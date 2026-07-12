import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import useInactivityLogout from '../hooks/useInactivityLogout'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  useInactivityLogout()

  if (loading) return null

  return user ? children : <Navigate to="/login" replace />
}
