import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import * as workspacesApi from '../api/workspaces'
import Avatar from '../components/Avatar'
import avatarColor from '../utils/avatarColor'

const STATUS_CONFIG = {
  online:  { color: 'var(--green)',  label: 'Online' },
  away:    { color: 'var(--amber)',  label: 'Away' },
  offline: { color: 'var(--text-3)', label: 'Offline' },
}

export default function TeamPage() {
  const { activeWorkspace } = useApp()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (!activeWorkspace) return
    setLoading(true)
    workspacesApi.listMembers(activeWorkspace.id).then(setMembers).finally(() => setLoading(false))
  }, [activeWorkspace])

  const handleInvite = async () => {
    if (!name.trim()) return
    const initials = name.trim().split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('')
    const member = await workspacesApi.addMember(activeWorkspace.id, {
      name: name.trim(),
      role: role.trim() || 'Member',
      initials: initials || 'U',
      status: 'online',
    })
    setMembers((m) => [...m, member])
    setName('')
    setRole('')
    setAdding(false)
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">Manage members, roles, and permissions</p>
        </div>
        <button onClick={() => setAdding((x) => !x)} className="btn btn-primary btn-sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          Invite Member
        </button>
      </div>

      {/* Invite form */}
      {adding && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 14 }}>Add team member</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleInvite() }}
                placeholder="Alex Santos"
                className="input input-sm"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Designer, Engineer…"
                className="input input-sm"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleInvite} className="btn btn-primary btn-sm">Add Member</button>
            <button onClick={() => { setAdding(false); setName(''); setRole('') }} className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-m)' }}>
          <span className="section-label">Members — {members.length}</span>
        </div>
        {loading ? (
          <div className="loading-center" style={{ height: 120 }}>Loading…</div>
        ) : members.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 24px' }}>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No members yet</p>
          </div>
        ) : (
          <div>
            {members.map((m, i) => {
              const status = STATUS_CONFIG[m.status] || STATUS_CONFIG.offline
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 20px',
                    borderBottom: i < members.length - 1 ? '1px solid var(--border-m)' : 'none',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar initials={m.initials} size="md" color={m.color || avatarColor(m.initials)} />
                    <div style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 10, height: 10, borderRadius: '50%',
                      background: status.color,
                      border: '2px solid var(--sf2)',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 1 }}>{m.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.role}</p>
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, color: status.color,
                    background: `${status.color}18`,
                    padding: '3px 10px', borderRadius: 999,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: status.color, flexShrink: 0 }} />
                    {status.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
