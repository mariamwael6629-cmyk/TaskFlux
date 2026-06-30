const CONFIG = {
  high: { bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.2)', color: '#fb7185', label: 'High', sym: '▲' },
  medium: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24', label: 'Med', sym: '●' },
  low: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', color: '#34d399', label: 'Low', sym: '▼' },
}

export default function PriorityBadge({ priority }) {
  const c = CONFIG[priority] || CONFIG.low
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: 4,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
      }}
    >
      <span style={{ fontSize: 8 }}>{c.sym}</span>
      {c.label}
    </span>
  )
}
