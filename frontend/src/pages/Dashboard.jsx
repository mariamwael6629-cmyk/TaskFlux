import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import * as boardsApi from '../api/boards'
import * as documentsApi from '../api/documents'
import * as workspacesApi from '../api/workspaces'
import Icons from '../icons/Icons'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

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
        let active = 0, done = 0
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

  const statTiles = [
    {
      label: 'Active Tasks',
      value: stats.active,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: 'var(--accent-h)',
      bg: 'var(--accent-s)',
    },
    {
      label: 'Completed',
      value: stats.done,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: 'var(--green)',
      bg: 'var(--green-s)',
    },
    {
      label: 'Documents',
      value: stats.docs,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      color: 'var(--purple)',
      bg: 'var(--purple-s)',
    },
  ]

  const quickActions = [
    { label: 'Kanban Board', desc: 'Manage tasks', icon: Icons.Board, to: '/board' },
    { label: 'Documents', desc: 'Team wiki', icon: Icons.Doc, to: '/documents' },
    { label: 'Team', desc: 'Members', icon: Icons.Users, to: '/team' },
  ]

  return (
    <div style={{ padding: '28px', overflowY: 'auto', height: '100%' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          {activeWorkspace && <span style={{ fontSize: 24, lineHeight: 1 }}>{activeWorkspace.emoji}</span>}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: activeWorkspace ? 36 : 0 }}>
          {activeWorkspace?.name} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {loading ? (
        <div className="loading-center" style={{ height: 200 }}>Loading workspace data…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {statTiles.map((s) => (
              <div key={s.label} className="stat-tile">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="stat-label">{s.label}</span>
                  <span style={{ color: s.color, display: 'flex', padding: 6, borderRadius: 8, background: s.bg }}>{s.icon}</span>
                </div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Bottom panels */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
            {/* Recent docs */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 7 }}>
                  {Icons.Clock} Recent Documents
                </h2>
                <button
                  onClick={() => navigate('/documents')}
                  style={{ fontSize: 11, color: 'var(--accent-h)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                >
                  View all
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {recentDocs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => navigate(`/documents/${d.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 'var(--r)',
                      background: 'none', border: '1px solid transparent',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--sf3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent' }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{d.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{d.author}</p>
                    </div>
                    <span style={{ color: 'var(--text-3)', display: 'flex', flexShrink: 0 }}>{Icons.ArrowRight}</span>
                  </button>
                ))}
                {recentDocs.length === 0 && (
                  <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
                    No documents yet
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card">
              <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 14 }}>Quick Access</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {quickActions.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.to)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 'var(--r)',
                      background: 'var(--sf3)', border: '1px solid var(--border)',
                      color: 'var(--text-2)', cursor: 'pointer', textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-b)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                  >
                    <span style={{ color: 'var(--accent-h)', display: 'flex', flexShrink: 0 }}>{a.icon}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{a.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
