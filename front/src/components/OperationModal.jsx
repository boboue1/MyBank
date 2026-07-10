import { useState, useEffect } from 'react'
import './OperationModal.css'

const EMPTY_FORM = { label: '', amount: '', date: '', categoryId: '' }

export default function OperationModal({ categories, onSave, onClose, initial = null }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initial) {
      setForm({
        label:      initial.label,
        amount:     initial.amount,
        date:       initial.date,
        categoryId: initial.category.id,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [initial])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async () => {
    if (!form.label || !form.amount || !form.date || !form.categoryId) {
      return setError('Tous les champs sont requis.')
    }
    try {
      await onSave({
        label:      form.label,
        amount:     parseFloat(form.amount),
        date:       form.date,
        categoryId: parseInt(form.categoryId),
      })
      onClose()
    } catch {
      setError("Erreur lors de l'enregistrement.")
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{initial ? 'Edit Operation' : 'Add Operation'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <input
            name="label"
            type="text"
            placeholder="Label"
            value={form.label}
            onChange={handleChange}
          />
          <div className="modal-row">
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
          </div>
          {categories.length === 0 ? (
            <p className="modal-no-category">
              Aucune catégorie disponible —{' '}
              <a href="/categories">créez-en une d'abord</a>.
            </p>
          ) : (
            <select name="categoryId" value={form.categoryId} onChange={handleChange}>
              <option value="">Catégorie ▾</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          )}
          {error && <p className="modal-error">{error}</p>}
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit} disabled={categories.length === 0}>Save →</button>
        </div>

      </div>
    </div>
  )
}
