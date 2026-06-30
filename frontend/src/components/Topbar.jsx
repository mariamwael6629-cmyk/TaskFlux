import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Icons from '../icons/Icons'

export default function Topbar() {
  const { activeWorkspace, sidebarOpen, setSidebarOpen } = useApp()
  const { user, logout } = useAuth()
  const [searching, setSearching] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const viewLabel = location.pathname.startsWith('/board')
    ? 'Kanban Board'
    : location.pathname.startsWith('/documents/')
    ? 'Document Editor'
    : location.pathname.startsWith('/documents')
    ? 'Documents'
    : location.pathname.startsWith('/team')
    ? 'Team Settings'
    : 'Dashboard'

  return (
    <header
      style={{
        flexShrink: 0,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        borderBottom: '1px solid #1e293b',
        background: 'rgba(15,23,42,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        {Icons.Menu}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        {activeWorkspace && (
          <>
            <span style={{ fontSize: 13 }}>{activeWorkspace.emoji}</span>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{activeWorkspace.name}</span>
            <span style={{ color: '#334155', fontSize: 12 }}>›</span>
          </>
        )}
        <span style={{ fontSize: 13, fontWeight: 500, color: '#cbd5e1' }}>{viewLabel}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {searching ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '5px 12px' }}>
            {Icons.Search}
            <input
              autoFocus
              onBlur={() => setSearching(false)}
              placeholder="Search..."
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 11, color: '#e2e8f0', width: 120 }}
            />
          </div>
        ) : (
          <button
            onClick={() => setSearching(true)}
            style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {Icons.Search}
          </button>
        )}
        <button
          style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
        >
          {Icons.Bell}
          <div style={{ position: 'absolute', top: 6, right: 6, width: 5, height: 5, borderRadius: '50%', background: '#f43f5e', border: '1.5px solid #020617' }} />
        </button>
        <button
          title={user?.name}
          onClick={() => {
            logout()
            navigate('/login')
          }}
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          {user?.initials || 'U'}
        </button>
      </div>
    </header>
  )
}
