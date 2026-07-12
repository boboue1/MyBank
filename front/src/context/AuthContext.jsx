import { useState, useEffect } from 'react'
import { me, logout as apiLogout } from '../api/auth'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    me()
      .then((res) => setUser(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = () => me().then((res) => setUser(res.data))

  const logout = async () => {
    try { await apiLogout() } catch { /* ignore */ }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

