import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getOperations, createOperation, deleteOperation } from '../api/operations'
import { getCategories } from '../api/categories'
import './DashboardPage.css'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [operations, setOperations]   = useState([])
  const [categories, setCategories]   = useState([])
  const [showModal, setShowModal]     = useState(false)
  const [form, setForm]               = useState({ label: '', amount: '', date: '', categoryId: '' })
  const [error, setError]             = useState(null)

  useEffect(() => {
    getOperations().then((r) => setOperations(r.data))
    getCategories().then((r) => setCategories(r.data))
  }, [])

  /* ── Stats ── */
  const totalBalance = operations.reduce((sum, o) => sum + parseFloat(o.amount), 0)

  const now = new Date()
  const thisMonth = operations
    .filter((o) => {
      const d = new Date(o.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, o) => sum + parseFloat(o.amount), 0)

  /* ── Chart data (dépenses par catégorie) ── */
  const byCategory = categories.map((cat) => {
    const total = operations
      .filter((o) => o.category.id === cat.id)
      .reduce((sum, o) => sum + parseFloat(o.amount), 0)
    return { title: cat.title, total }
  }).filter((c) => c.total !== 0)

  const maxAmount = Math.max(...byCategory.map((c) => Math.abs(c.total)), 1)

  /* ── Recent ops ── */
  const recentOps = [...operations]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  /* ── Form ── */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await createOperation({
        label:      form.label,
        amount:     parseFloat(form.amount),
        date:       form.date,
        categoryId: parseInt(form.categoryId),
      })
      setOperations([...operations, res.data])
      setShowModal(false)
      setForm({ label: '', amount: '', date: '', categoryId: '' })
    } catch {
      setError("Erreur lors de l'ajout.")
    }
  }

  const handleDelete = async (id) => {
    await deleteOperation(id)
    setOperations(operations.filter((o) => o.id !== id))
  }

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '?'

  return (
    <div className="dashboard">
      {/* ── Navbar ── */}
      <nav className="dash-navbar">
        <span className="logo">MYBANK</span>
        <div className="nav-right">
          <span>{user?.firstName} {user?.lastName}</span>
          <div className="avatar">{initials}</div>
          <button className="btn-logout" onClick={logout}>Déconnexion</button>
        </div>
      </nav>

      <div className="dash-body">
        {/* ── Sidebar ── */}
        <aside className="dash-sidebar">
          <div className="hamburger">
            <span /><span /><span />
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="dash-main">
          {/* Stat cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <p className="label">Total Balance</p>
              <p className="value">{totalBalance.toFixed(2)} €</p>
              <p className="sub">Toutes opérations</p>
            </div>
            <div className="stat-card">
              <p className="label">This Month</p>
              <p className="value">{thisMonth.toFixed(2)} €</p>
              <p className="sub">{now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="stat-card">
              <p className="label">Operations</p>
              <p className="value">{operations.length}</p>
              <p className="sub">Au total</p>
            </div>
          </div>

          {/* Content */}
          <div className="dash-content">
            {/* Chart */}
            <div className="panel-chart">
              <h3>Dépenses / catégorie</h3>
              {byCategory.length === 0 ? (
                <p className="chart-empty">Aucune donnée</p>
              ) : (
                <div className="chart-bars">
                  {byCategory.map((c) => (
                    <div key={c.title} className="chart-bar-row">
                      <span className="chart-bar-label">{c.title}</span>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill"
                          style={{ width: `${(Math.abs(c.total) / maxAmount) * 100}%` }}
                        />
                      </div>
                      <span className="chart-bar-amount">{c.total.toFixed(0)} €</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent ops */}
            <div className="panel-ops">
              <h3>5 dernières opérations</h3>
              {recentOps.length === 0 ? (
                <p className="ops-empty">Aucune opération</p>
              ) : (
                <ul className="ops-list">
                  {recentOps.map((o) => (
                    <li key={o.id} className="op-item">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="op-label">{o.label}</p>
                        <p className="op-cat">{o.category.title}</p>
                      </div>
                      <span className="op-date">{new Date(o.date).toLocaleDateString('fr-FR')}</span>
                      <span className="op-amount">{parseFloat(o.amount).toFixed(2)} €</span>
                      <button
                        onClick={() => handleDelete(o.id)}
                        style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '1rem' }}
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* CTA */}
          <button className="dash-cta" onClick={() => setShowModal(true)}>
            + ADD OPERATION
          </button>
        </main>
      </div>

      {/* ── Modal ajout opération ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nouvelle opération</h2>
            <input
              name="label"
              placeholder="Libellé"
              value={form.label}
              onChange={handleChange}
              required
            />
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Montant (€)"
              value={form.amount}
              onChange={handleChange}
              required
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
              <option value="">-- Catégorie --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            {error && <p style={{ color: '#e53935', fontSize: '0.82rem' }}>{error}</p>}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-submit" onClick={handleAdd}>Ajouter →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
