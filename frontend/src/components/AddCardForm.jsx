import { useState } from 'react'

const PRIORITIES = ['low', 'medium', 'high']

export default function AddCardForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [due, setDue] = useState('')

  const submit = () => {
    if (!title.trim()) return
    onAdd({ title: title.trim(), priority, due_date: due || null, description: '', tags: [], assignee: '' })
  }

  const PRIORITY_COLORS = {
    low: 'var(--green)',
    medium: 'var(--amber)',
    high: 'var(--red)',
  }

  return (
    <div style={{
      background: 'var(--sf2)',
      border: '1px solid var(--accent-b)',
      borderRadius: 'var(--r)',
      padding: 12,
      marginTop: 8,
      boxShadow: '0 8px 32px rgba(80,80,200,.15)',
    }}>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onCancel() }}
        placeholder="Card title…"
        className="input"
        style={{ marginBottom: 8 }}
      />

      {/* Priority selector */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
        {PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            style={{
              flex: 1, fontSize: 11, padding: '5px 0',
              borderRadius: 6, cursor: 'pointer', fontWeight: 500,
              background: priority === p ? `rgba(${p === 'low' ? '30,168,130' : p === 'medium' ? '191,136,40' : '192,64,64'}, .15)` : 'var(--sf3)',
              border: priority === p ? `1px solid ${PRIORITY_COLORS[p]}` : '1px solid var(--border)',
              color: priority === p ? PRIORITY_COLORS[p] : 'var(--text-3)',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        className="input input-sm"
        style={{ marginBottom: 8 }}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={submit}
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Add Card
        </button>
        <button
          onClick={onCancel}
          className="btn btn-ghost btn-sm"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
