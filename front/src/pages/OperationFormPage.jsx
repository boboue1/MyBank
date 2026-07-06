import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOperation } from '../api/operations'
import { getCategories } from '../api/categories'
import './OperationFormPage.css'

export default function OperationFormPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ label: '', amount: '', date: '', categoryId: '' })
  const [error, setError] = useState(null)

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async () => {
    if (!form.label || !form.amount || !form.date || !form.categoryId) {
      return setError('Tous les champs sont requis.')
    }
    try {
      await createOperation({
        label:      form.label,
        amount:     parseFloat(form.amount),
        date:       form.date,
        categoryId: parseInt(form.categoryId),
      })
      navigate('/dashboard')
    } catch {
      setError("Erreur lors de l'enregistrement.")
    }
  }

  return (
    <div className="op-form-page">
      <header className="op-form-header">
        <button className="op-form-back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Add Operation</h1>
      </header>

      <div className="op-form-body">
        <input
          name="label"
          type="text"
          placeholder="Label"
          value={form.label}
          onChange={handleChange}
        />
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
          <option value="">Category ▾</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        {error && <p className="op-form-error">{error}</p>}
      </div>

      <div className="op-form-actions">
        <button className="op-form-submit" onClick={handleSubmit}>
          Save Operation →
        </button>
        <button className="op-form-cancel" onClick={() => navigate('/dashboard')}>
          Cancel
        </button>
      </div>
    </div>
  )
}
