import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Icons from '../icons/Icons'

const NAV = [
  { to: '/', label: 'Dashboard', icon: Icons.Dashboard, end: true },
  { to: '/board', label: 'Kanban Board', icon: Icons.Board },
  { to: '/documents', label: 'Documents', icon: Icons.Doc },
  { to: '/team', label: 'Team', icon: Icons.Users },
]

export default function Sidebar() {
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId, addWorkspace, sidebarOpen, setSidebarOpen } = useApp()
  const [addingWs, setAddingWs] = useState(false)
  const [newWsName, setNewWsName] = useState('')

  const handleAddWs = async () => {
    if (newWsName.trim()) {
      await addWorkspace(newWsName.trim())
      setNewWsName('')
      setAddingWs(false)
    }
  }

  const W = sidebarOpen ? 228 : 60

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="mobile-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 20 }}
        />
      )}
      <aside style={{
        width: W,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-m)',
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
        zIndex: 30,
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: sidebarOpen ? 10 : 0,
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          padding: sidebarOpen ? '16px 16px 14px' : '16px 12px 14px',
          borderBottom: '1px solid var(--border-m)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          {sidebarOpen && (
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              TaskFlux
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={!sidebarOpen ? item.label : undefined}
              style={({ isActive }) => ({
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: sidebarOpen ? 10 : 0,
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                padding: sidebarOpen ? '8px 10px' : '9px',
                borderRadius: 'var(--r)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: isActive ? 'var(--accent-s)' : 'transparent',
                border: isActive ? '1px solid var(--accent-b)' : '1px solid transparent',
                color: isActive ? 'var(--accent-h)' : 'var(--text-3)',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              })}
            >
              <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
              {sidebarOpen && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Workspaces */}
        {sidebarOpen && (
          <div style={{ padding: '4px 8px 8px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px 4px' }}>
              <span className="section-label">Workspaces</span>
              <button
                onClick={() => setAddingWs((x) => !x)}
                className="btn-ghost btn-icon-sm"
                style={{ padding: '3px 5px', borderRadius: 5, fontSize: 16, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                +
              </button>
            </div>

            {addingWs && (
              <div style={{ padding: '0 2px', marginBottom: 6 }}>
                <input
                  autoFocus
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddWs()
                    if (e.key === 'Escape') setAddingWs(false)
                  }}
                  placeholder="Workspace name"
                  className="input input-sm"
                  style={{ marginBottom: 6 }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={handleAddWs} className="btn btn-primary btn-xs" style={{ flex: 1 }}>Add</button>
                  <button onClick={() => setAddingWs(false)} className="btn btn-ghost btn-xs">Cancel</button>
                </div>
              </div>
            )}

            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setActiveWorkspaceId(ws.id)}
                className={`ws-item${activeWorkspaceId === ws.id ? ' ws-item-active' : ''}`}
              >
                <span style={{ fontSize: 15, flexShrink: 0 }}>{ws.emoji}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{ws.name}</span>
                {activeWorkspaceId === ws.id && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: ws.color || 'var(--accent)', flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Collapse toggle */}
        <div style={{
          padding: '10px 8px',
          borderTop: '1px solid var(--border-m)',
          display: 'flex',
          justifyContent: sidebarOpen ? 'flex-end' : 'center',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {sidebarOpen ? Icons.ChevLeft : Icons.ChevRight}
          </button>
        </div>
      </aside>
    </>
  )
}
