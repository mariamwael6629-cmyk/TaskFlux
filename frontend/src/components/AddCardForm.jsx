import { useState } from 'react'
import Icons from '../icons/Icons'

export default function AddCardForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [due, setDue] = useState('')

  const submit = () => {
    if (!title.trim()) return
    onAdd({ title: title.trim(), priority, due_date: due || null, description: '', tags: [], assignee: '' })
  }

  const btnBase = { flex: 1, fontSize: 11, padding: '4px 0', borderRadius: 8, border: '1px solid #334155', color: '#64748b', cursor: 'pointer', background: 'transparent' }
  const btnActive = { ...btnBase, background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.5)', color: '#818cf8' }

  return (
    <div style={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12, padding: 12, marginTop: 8, boxShadow: '0 8px 24px rgba(99,102,241,0.1)' }}>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="Card title..."
        style={{ width: '100%', background: 'rgba(51,65,85,0.6)', color: '#e2e8f0', fontSize: 13, padding: '8px 10px', borderRadius: 8, border: '1px solid #334155', outline: 'none', marginBottom: 8 }}
      />
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {['low', 'medium', 'high'].map((p) => (
          <button key={p} onClick={() => setPriority(p)} style={priority === p ? btnActive : btnBase}>
            {p}
          </button>
        ))}
      </div>
      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        style={{ width: '100%', background: 'rgba(51,65,85,0.6)', color: '#94a3b8', fontSize: 11, padding: '6px 10px', borderRadius: 8, border: '1px solid #334155', outline: 'none', marginBottom: 8 }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={submit}
          style={{ flex: 1, background: '#4f46e5', color: '#fff', fontSize: 11, fontWeight: 600, padding: '6px 0', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
        >
          {Icons.Check} Add Card
        </button>
        <button onClick={onCancel} style={{ padding: '6px 10px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center' }}>
          ✕
        </button>
      </div>
    </div>
  )
}
