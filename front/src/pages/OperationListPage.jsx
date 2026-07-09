import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getOperations, createOperation, updateOperation, deleteOperation } from '../api/operations'
import { getCategories } from '../api/categories'
import { useIsMobile } from '../hooks/useIsMobile'
import OperationModal from '../components/OperationModal'
import Navbar from '../components/Navbar'
import './OperationListPage.css'

const PAGE_SIZE = 10

function formatAmount(amount) {
  const n = parseFloat(amount)
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const day   = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

export default function OperationListPage() {
  useAuth()
  const navigate          = useNavigate()
  const isMobile          = useIsMobile()

  const [operations, setOperations]   = useState([])
  const [categories, setCategories]   = useState([])
  const [search, setSearch]           = useState('')
  const [catFilter, setCatFilter]     = useState('')
  const [showFilter, setShowFilter]   = useState(false)
  const [page, setPage]               = useState(1)
  const [showModal, setShowModal]     = useState(false)
  const [editing, setEditing]         = useState(null)

  useEffect(() => {
    getOperations().then((r) => setOperations(r.data))
    getCategories().then((r) => setCategories(r.data))
  }, [])

  /* ── Filtering ── */
  const filtered = useMemo(() => {
    return operations.filter((o) => {
      const matchLabel = o.label.toLowerCase().includes(search.toLowerCase())
      const matchCat   = catFilter === '' || String(o.category.id) === catFilter
      return matchLabel && matchCat
    })
  }, [operations, search, catFilter])

  /* ── Pagination ── */
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1) }
  const handleCatChange    = (e) => { setCatFilter(e.target.value); setPage(1) }

  /* ── CRUD ── */
  const handleSave = async (data) => {
    if (editing) {
      const res = await updateOperation(editing.id, data)
      setOperations(operations.map((o) => (o.id === editing.id ? res.data : o)))
    } else {
      const res = await createOperation(data)
      setOperations([...operations, res.data])
    }
    setEditing(null)
  }

  const handleEdit = (op) => {
    if (isMobile) {
      navigate('/operations/new', { state: { operation: op, from: '/operations' } })
    } else {
      setEditing(op)
      setShowModal(true)
    }
  }

  const handleDelete = async (id) => {
    await deleteOperation(id)
    setOperations(operations.filter((o) => o.id !== id))
  }

  const openAdd = () => {
    setEditing(null)
    if (isMobile) {
      navigate('/operations/new')
    } else {
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="op-list-page">
      <Navbar />

      <div className="op-list-body">

        {/* ── Main ── */}
        <main className="op-list-main">

          {/* Filter bar */}
          <div className="op-filter-bar">
            <input
              className="op-search"
              type="text"
              placeholder="Rechercher une opération…"
              value={search}
              onChange={handleSearchChange}
            />
            {/* desktop: category select + add button */}
            <select className="op-filter-select desktop-only" value={catFilter} onChange={handleCatChange}>
              <option value="">Category ▾</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.title}</option>
              ))}
            </select>
            <button className="op-add-btn desktop-only" onClick={openAdd}>+ ADD</button>
            {/* mobile: FILTER toggle button */}
            <button
              className={`op-filter-toggle mobile-only${showFilter ? ' active' : ''}`}
              onClick={() => setShowFilter((v) => !v)}
            >
              FILTER
            </button>
          </div>

          {/* Mobile filter row (category dropdown) */}
          {showFilter && (
            <div className="op-filter-expanded mobile-only">
              <select className="op-filter-select-full" value={catFilter} onChange={handleCatChange}>
                <option value="">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.title}</option>
                ))}
              </select>
              {catFilter && (
                <button className="op-filter-clear" onClick={() => { setCatFilter(''); setPage(1) }}>
                  Réinitialiser
                </button>
              )}
            </div>
          )}

          {/* Table / list */}
          <div className="op-table">

            {/* Desktop header */}
            <div className="op-table-head desktop-only">
              <span>Label</span>
              <span>Amount</span>
              <span>Date</span>
              <span>Cat.</span>
              <span>···</span>
            </div>

            {pageItems.length === 0 ? (
              <p className="op-empty">Aucune opération trouvée.</p>
            ) : (
              pageItems.map((op) => {
                const amount = parseFloat(op.amount)
                return (
                  <div key={op.id} className="op-table-row" onClick={() => isMobile && handleEdit(op)}>
                    {/* Desktop columns */}
                    <span className="op-label desktop-only">{op.label}</span>
                    <span className={`op-amount desktop-only ${amount < 0 ? 'negative' : 'positive'}`}>
                      {formatAmount(op.amount)}
                    </span>
                    <span className="op-date desktop-only">{formatDate(op.date)}</span>
                    <span className="op-cat desktop-only">{op.category.title}</span>

                    {/* Mobile card layout */}
                    <div className="op-card-content mobile-only">
                      <span className="op-card-label">{op.label}</span>
                      <span className={`op-card-meta ${amount < 0 ? 'negative' : 'positive'}`}>
                        {op.category.title} · {formatDate(op.date)} · {formatAmount(op.amount)}
                      </span>
                    </div>

                    {/* Actions (desktop only — mobile uses row tap) */}
                    <div className="op-row-actions desktop-only">
                      <button className="op-row-btn" onClick={(e) => { e.stopPropagation(); handleEdit(op) }} title="Modifier">✎</button>
                      <button className="op-row-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(op.id) }} title="Supprimer">×</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="op-pagination">
              <button
                className="op-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              {pageNumbers.map((n, i) => (
                <span key={n}>
                  {i > 0 && <span className="op-page-sep">·</span>}
                  <button
                    className={`op-page-btn${currentPage === n ? ' active' : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                </span>
              ))}
              <button
                className="op-page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}

        </main>
      </div>

      {/* ── FAB mobile ── */}
      <button className="op-fab mobile-only" onClick={openAdd}>
        + ADD
      </button>

      {/* ── Modal desktop ── */}
      {showModal && (
        <OperationModal
          categories={categories}
          onSave={handleSave}
          onClose={closeModal}
          initial={editing}
        />
      )}
    </div>
  )
}
