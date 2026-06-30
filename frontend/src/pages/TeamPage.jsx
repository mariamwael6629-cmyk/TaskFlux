import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import * as workspacesApi from '../api/workspaces'
import Avatar from '../components/Avatar'

const STATUS_COLOR = { online: '#34d399', away: '#fbbf24', offline: '#475569' }

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
    workspacesApi
      .listMembers(activeWorkspace.id)
      .then(setMembers)
      .finally(() => setLoading(false))
  }, [activeWorkspace])

  const handleInvite = async () => {
    if (!name.trim()) return
    const initials = name
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('')
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
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Team Settings</h1>
        <p style={{ fontSize: 11, color: '#64748b' }}>Manage members, roles, and workspace permissions</p>
      </div>
      <div style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>Team Members</h2>
          <button
            onClick={() => setAdding((x) => !x)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 8, fontSize: 11, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            + Invite
          </button>
        </div>

        {adding && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              style={{ flex: 1, background: 'rgba(51,65,85,0.6)', color: '#e2e8f0', fontSize: 12, padding: '6px 10px', borderRadius: 8, border: '1px solid #334155', outline: 'none' }}
            />
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role"
              style={{ flex: 1, background: 'rgba(51,65,85,0.6)', color: '#e2e8f0', fontSize: 12, padding: '6px 10px', borderRadius: 8, border: '1px solid #334155', outline: 'none' }}
            />
            <button onClick={handleInvite} style={{ padding: '6px 14px', borderRadius: 8, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              Add
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ color: '#475569', fontSize: 12 }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {members.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', borderRadius: 10 }}>
                <div style={{ position: 'relative' }}>
                  <Avatar initials={m.initials} size="md" color={m.color} />
                  <div style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', background: STATUS_COLOR[m.status] || '#475569', border: '2px solid #020617' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0', marginBottom: 1 }}>{m.name}</p>
                  <p style={{ fontSize: 10, color: '#64748b' }}>{m.role}</p>
                </div>
                <span style={{ fontSize: 10, color: '#475569', textTransform: 'capitalize' }}>{m.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
