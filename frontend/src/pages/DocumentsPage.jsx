import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import * as documentsApi from '../api/documents'
import Icons from '../icons/Icons'

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
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
    documentsApi
      .listDocuments(activeWorkspace.id)
      .then(setDocs)
      .finally(() => setLoading(false))
  }, [activeWorkspace])

  const handleAdd = async () => {
    const doc = await documentsApi.createDocument(activeWorkspace.id, {})
    navigate(`/documents/${doc.id}`)
  }

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 19, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Documents</h1>
          <p style={{ fontSize: 11, color: '#64748b' }}>Shared notes, specs, and meeting minutes</p>
        </div>
        <button
          onClick={handleAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 12, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          + New Doc
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#475569' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate(`/documents/${doc.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, textAlign: 'left', cursor: 'pointer', width: '100%' }}
            >
              <span style={{ fontSize: 22 }}>{doc.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', marginBottom: 2 }}>{doc.title}</p>
                <p style={{ fontSize: 11, color: '#64748b' }}>
                  {doc.author} · {timeAgo(doc.updated_at)}
                </p>
              </div>
              {Icons.ArrowRight}
            </button>
          ))}
          {docs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#475569' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📄</div>
              <p>No documents yet</p>
              <p style={{ fontSize: 11, marginTop: 4 }}>Create your first document to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
