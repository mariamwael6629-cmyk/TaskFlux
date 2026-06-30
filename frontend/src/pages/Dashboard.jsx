import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import * as boardsApi from '../api/boards'
import * as documentsApi from '../api/documents'
import * as workspacesApi from '../api/workspaces'
import Icons from '../icons/Icons'

export default function Dashboard() {
  const { activeWorkspace } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ active: 0, done: 0, docs: 0 })
  const [recentDocs, setRecentDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeWorkspace) return
    setLoading(true)
    Promise.all([
      boardsApi.listBoards(activeWorkspace.id),
      documentsApi.listDocuments(activeWorkspace.id),
      workspacesApi.listMembers(activeWorkspace.id),
    ])
      .then(async ([boards, docs]) => {
        let active = 0
        let done = 0
        if (boards.length > 0) {
          const detail = await boardsApi.getBoard(boards[0].id)
          for (const col of detail.columns) {
            if (col.title === 'Done') done += col.cards.length
            else active += col.cards.length
          }
        }
        setStats({ active, done, docs: docs.length })
        setRecentDocs(docs.slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [activeWorkspace])

  const quickActions = [
    { label: 'Open Board', icon: '▦', to: '/board' },
    { label: 'New Document', icon: '⊟', to: '/documents' },
    { label: 'Team Settings', icon: '◎', to: '/team' },
  ]

  const statCards = [
    { label: 'Active Tasks', value: stats.active, color: '#818cf8' },
    { label: 'Completed', value: stats.done, color: '#34d399' },
    { label: 'Documents', value: stats.docs, color: '#a78bfa' },
  ]

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 28 }}>{activeWorkspace?.emoji}</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', marginLeft: 40 }}>Here's what's happening in {activeWorkspace?.name}</p>
      </div>

      {loading ? (
        <p style={{ color: '#475569' }}>Loading...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {statCards.map((s) => (
              <div key={s.label} style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 10, color: '#64748b', marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{s.value}</p>
                <p style={{ fontSize: 10, color: s.color }}>updated live</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, padding: 16 }}>
              <h2 style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                {Icons.Clock} Recent Documents
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentDocs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => navigate(`/documents/${d.id}`)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{d.emoji}</span>
                    <div>
                      <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{d.title}</p>
                      <p style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>by {d.author}</p>
                    </div>
                  </button>
                ))}
                {recentDocs.length === 0 && <p style={{ fontSize: 11, color: '#475569' }}>No documents yet</p>}
              </div>
            </div>

            <div style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, padding: 16 }}>
              <h2 style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 14 }}>✦ Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {quickActions.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.to)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(51,65,85,0.4)', border: '1px solid rgba(51,65,85,0.5)', color: '#94a3b8', cursor: 'pointer', fontSize: 11, fontWeight: 500, textAlign: 'left' }}
                  >
                    <span style={{ color: '#6366f1', fontSize: 14 }}>{a.icon}</span> {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
