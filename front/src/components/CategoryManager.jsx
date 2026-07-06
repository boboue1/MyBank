import { useState } from 'react'
import { createCategory, updateCategory, deleteCategory } from '../api/categories'
import './CategoryManager.css'

export default function CategoryManager({ categories, setCategories }) {
  const [newTitle, setNewTitle]   = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

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
    <div className="cat-manager">
      <div className="cat-add-row">
        <input
          className="cat-input"
          placeholder="Nouveau titre"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button className="cat-add-btn" onClick={handleAdd}>+ Ajouter</button>
      </div>

      <div className="cat-tags">
        {categories.map((cat) => (
          <div key={cat.id} className="cat-tag">
            {editingId === cat.id ? (
              <input
                className="cat-tag-edit-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmEdit(cat.id)}
                onBlur={() => confirmEdit(cat.id)}
                autoFocus
              />
            ) : (
              <span className="cat-tag-label">{cat.title}</span>
            )}
            <button className="cat-tag-btn" onClick={() => startEdit(cat)} title="Modifier">✎</button>
            <button className="cat-tag-btn" onClick={() => handleDelete(cat.id)} title="Supprimer">×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
