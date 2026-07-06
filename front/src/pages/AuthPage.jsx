import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const passwordValid = PASSWORD_REGEX.test(form.password)
  const confirmMatch  = form.password === form.confirmPassword && form.confirmPassword !== ''

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const switchTab = (t) => {
    setTab(t)
    setError(null)
    setForm({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (tab === 'login') {
        const res = await loginApi(form.email, form.password)
        await login(res.data.token)
        navigate('/dashboard')
      } else {
        if (!passwordValid) {
          return setError('Le mot de passe doit contenir min. 8 caractères, 1 majuscule et 1 chiffre.')
        }
        if (!confirmMatch) {
          return setError('Les mots de passe ne correspondent pas.')
        }
        await registerApi(form.email, form.password, form.firstName, form.lastName)
        const res = await loginApi(form.email, form.password)
        await login(res.data.token)
        navigate('/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.error
      setError(msg || (tab === 'login' ? 'Email ou mot de passe incorrect.' : "Erreur lors de l'inscription."))
    }
  }

  return (
    <div className="auth-wrapper">
      <header className="auth-header">
        <span className="logo">MYBANK</span>
        <span className="tagline">
          {tab === 'register' ? 'Create your account' : 'Gérez vos finances'}
        </span>
      </header>

      <div className="auth-body">
        {/* ── Panel gauche ── */}
        <div className="auth-visual">
          {tab === 'login' ? (
            <>
              <h2>MyBank</h2>
              <p>Votre argent / votre pouvoir d'achat</p>
            </>
          ) : (
            <>
              <h2>JOIN MYBANK</h2>
              <ul className="features">
                <li>Suivi des dépenses</li>
                <li>Catégories perso</li>
                <li>Dashboards clairs</li>
              </ul>
            </>
          )}
        </div>

        {/* ── Panel droit ── */}
        <div className="auth-form-panel">
          <div className="auth-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>
              Log In
            </button>
            <button className={tab === 'register' ? 'active' : ''} onClick={() => switchTab('register')}>
              Sign Up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="auth-row">
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={
                tab === 'register' && form.password
                  ? passwordValid ? 'valid' : 'error'
                  : ''
              }
            />

            {tab === 'register' && (
              <>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className={
                    form.confirmPassword
                      ? confirmMatch ? 'valid' : 'error'
                      : ''
                  }
                />
                <p className="auth-hint">Min. 8 car., 1 maj., 1 chiffre</p>
              </>
            )}

            {error && <p className="auth-error">{error}</p>}
          </form>

          <button className="auth-cta" onClick={handleSubmit}>
            {tab === 'login' ? 'Continue →' : 'Create Account →'}
          </button>

          {tab === 'login' && (
            <p className="auth-forgot">Forgot password?</p>
          )}
        </div>
      </div>
    </div>
  )
}
