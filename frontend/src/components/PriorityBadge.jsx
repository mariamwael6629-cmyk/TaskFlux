const CONFIG = {
  high:   { bg: 'var(--red-s)',   border: 'var(--red-b)',   color: 'var(--red)',   label: 'High',   dot: '▲' },
  medium: { bg: 'var(--amber-s)', border: 'var(--amber-b)', color: 'var(--amber)', label: 'Med',    dot: '●' },
  low:    { bg: 'var(--green-s)', border: 'var(--green-b)', color: 'var(--green)', label: 'Low',    dot: '▼' },
}

export default function PriorityBadge({ priority }) {
  const c = CONFIG[priority] || CONFIG.low
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 600,
      padding: '2px 7px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
    }}>
      <span style={{ fontSize: 7 }}>{c.dot}</span>
      {c.label}
    </span>
  )
}
