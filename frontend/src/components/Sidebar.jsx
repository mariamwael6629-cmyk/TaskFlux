import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Icons from '../icons/Icons'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Icons.Dashboard, end: true },
  { to: '/board', label: 'Kanban Board', icon: Icons.Board },
  { to: '/documents', label: 'Documents', icon: Icons.Doc },
  { to: '/team', label: 'Team', icon: Icons.Users },
]

export default function Sidebar() {
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId, addWorkspace, sidebarOpen, setSidebarOpen } =
    useApp()
  const [addingWs, setAddingWs] = useState(false)
  const [newWsName, setNewWsName] = useState('')

  const handleAddWs = async () => {
    if (newWsName.trim()) {
      await addWorkspace(newWsName.trim())
      setNewWsName('')
      setAddingWs(false)
    }
  }

  const W = sidebarOpen ? 240 : 56

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="mobile-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 20 }}
        />
      )}
      <aside
        style={{
          width: W,
          flexShrink: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15,23,42,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid #1e293b',
          overflow: 'hidden',
          transition: 'width 0.3s ease',
          zIndex: 30,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: sidebarOpen ? 10 : 0,
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            padding: sidebarOpen ? '14px 16px' : '14px 12px',
            borderBottom: '1px solid #1e293b',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 14,
            }}
          >
            ✦
          </div>
          {sidebarOpen && (
            <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap' }}>
              TaskFlux
            </span>
          )}
        </div>

        <nav style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => (
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
                padding: sidebarOpen ? '8px 12px' : '8px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                color: isActive ? '#818cf8' : '#64748b',
              })}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {sidebarOpen && (
          <div style={{ padding: '8px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Workspaces
              </span>
              <button
                onClick={() => setAddingWs((x) => !x)}
                style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 16, padding: 2, lineHeight: 1, display: 'flex', alignItems: 'center' }}
              >
                +
              </button>
            </div>
            {addingWs && (
              <div style={{ marginBottom: 8, padding: '0 4px' }}>
                <input
                  autoFocus
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddWs()
                    if (e.key === 'Escape') setAddingWs(false)
                  }}
                  placeholder="Workspace name..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', fontSize: 11, padding: '6px 8px', borderRadius: 8, outline: 'none', marginBottom: 6 }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={handleAddWs} style={{ flex: 1, fontSize: 11, padding: '4px 0', borderRadius: 6, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Add
                  </button>
                  <button onClick={() => setAddingWs(false)} style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => setActiveWorkspaceId(ws.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    background: activeWorkspaceId === ws.id ? '#1e293b' : 'transparent',
                    border: 'none',
                    color: activeWorkspaceId === ws.id ? '#e2e8f0' : '#64748b',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{ws.emoji}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ws.name}</span>
                  {activeWorkspaceId === ws.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: ws.color, flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '10px 8px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {sidebarOpen ? Icons.ChevLeft : Icons.ChevRight}
          </button>
        </div>
      </aside>
    </>
  )
}
