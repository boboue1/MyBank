import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories'
import Spinner from '../components/Spinner'
import './CategoryPage.css'

export default function CategoryPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [newTitle, setNewTitle]     = useState('')
  const [editingId, setEditingId]   = useState(null)
  const [editTitle, setEditTitle]   = useState('')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    getCategories().then((r) => {
      setCategories(r.data)
      setLoading(false)
    })
  }, [])

  const handleAdd = async () => {
    const title = newTitle.trim()
    if (!title) return
    const res = await createCategory(title)
    setCategories([...categories, res.data])
    setNewTitle('')
  }

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setEditTitle(cat.title)
  }

  const confirmEdit = async (id) => {
    const title = editTitle.trim()
    if (!title) return
    const res = await updateCategory(id, title)
    setCategories(categories.map((c) => (c.id === id ? res.data : c)))
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    await deleteCategory(id)
    setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="cat-page">
      <header className="cat-page-header">
        <button className="cat-page-back" onClick={() => navigate('/dashboard')}>←</button>
        <h1>Catégories</h1>
      </header>

      <div className="cat-page-form">
        <input
          className="cat-page-input"
          placeholder="Nouveau titre"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button className="cat-page-add-btn" onClick={handleAdd}>+ Ajouter</button>
      </div>

      {loading ? <Spinner /> : (
        <ul className="cat-page-list">
          {categories.map((cat) => (
            <li key={cat.id} className="cat-page-item">
              {editingId === cat.id ? (
                <input
                  className="cat-page-edit-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmEdit(cat.id)}
                  onBlur={() => confirmEdit(cat.id)}
                  autoFocus
                />
              ) : (
                <span className="cat-page-name">{cat.title}</span>
              )}
              <div className="cat-page-actions">
                <button className="cat-page-btn" onClick={() => startEdit(cat)}>✎</button>
                <button className="cat-page-btn" onClick={() => handleDelete(cat.id)}>×</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
