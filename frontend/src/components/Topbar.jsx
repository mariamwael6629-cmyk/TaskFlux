import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Icons from '../icons/Icons'

const VIEW_LABELS = {
  '/board': 'Kanban Board',
  '/documents': 'Documents',
  '/team': 'Team',
}

export default function Topbar() {
  const { activeWorkspace, sidebarOpen, setSidebarOpen } = useApp()
  const { user, logout } = useAuth()
  const [searching, setSearching] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const viewLabel = location.pathname.startsWith('/documents/')
    ? 'Document Editor'
    : VIEW_LABELS[Object.keys(VIEW_LABELS).find(k => location.pathname.startsWith(k))] || 'Dashboard'

  return (
    <header style={{
      flexShrink: 0,
      height: 54,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 18px',
      borderBottom: '1px solid var(--border-m)',
      background: 'var(--surface)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      {/* Menu toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
      >
        {Icons.Menu}
      </button>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, overflow: 'hidden' }}>
        {activeWorkspace && (
          <>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{activeWorkspace.emoji}</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
              {activeWorkspace.name}
            </span>
            <span style={{ color: 'var(--border)', fontSize: 16, flexShrink: 0 }}>›</span>
          </>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {viewLabel}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {searching ? (
          <div className="topbar-search">
            {Icons.Search}
            <input
              autoFocus
              onBlur={() => setSearching(false)}
              placeholder="Search…"
            />
            <button
              onClick={() => setSearching(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', padding: 2 }}
            >
              {Icons.X}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearching(true)}
            style={{ padding: 7, borderRadius: 8, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex' }}
          >
            {Icons.Search}
          </button>
        )}

        <button
          title="Notifications"
          style={{ padding: 7, borderRadius: 8, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
        >
          {Icons.Bell}
          <span style={{ position: 'absolute', top: 5, right: 5, width: 5, height: 5, borderRadius: '50%', background: 'var(--red)', border: '1.5px solid var(--surface)' }} />
        </button>

        <button
          title={`${user?.name} — click to sign out`}
          onClick={() => { logout(); navigate('/login') }}
          style={{
            width: 30, height: 30,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#fff',
            cursor: 'pointer', border: '2px solid var(--border)',
            marginLeft: 2,
          }}
        >
          {user?.initials || 'U'}
        </button>
      </div>
    </header>
  )
}
