import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import * as documentsApi from '../api/documents'
import Icons from '../icons/Icons'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function DocumentsPage() {
  const { activeWorkspace } = useApp()
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeWorkspace) return
    setLoading(true)
    documentsApi.listDocuments(activeWorkspace.id).then(setDocs).finally(() => setLoading(false))
  }, [activeWorkspace])

  const handleAdd = async () => {
    const doc = await documentsApi.createDocument(activeWorkspace.id, {})
    navigate(`/documents/${doc.id}`)
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Shared notes, specs, and meeting minutes</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary btn-sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Doc
        </button>
      </div>

      {loading ? (
        <div className="loading-center" style={{ height: 200 }}>Loading documents…</div>
      ) : docs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)' }}>No documents yet</p>
          <p style={{ fontSize: 12 }}>Create your first document to get started</p>
          <button onClick={handleAdd} className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
            Create document
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate(`/documents/${doc.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 18px',
                background: 'var(--sf2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)', textAlign: 'left',
                cursor: 'pointer', width: '100%',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-b)'; e.currentTarget.style.background = 'var(--sf3)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--sf2)' }}
            >
              <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{doc.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {doc.title}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {doc.author} · {timeAgo(doc.updated_at)}
                </p>
              </div>
              <span style={{ color: 'var(--text-3)', display: 'flex', flexShrink: 0 }}>{Icons.ArrowRight}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
