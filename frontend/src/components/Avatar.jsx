export default function Avatar({ initials, size = 'sm', color }) {
  const dim = size === 'sm' ? 26 : 34
  const fs  = size === 'sm' ? 10 : 12
  return (
    <div style={{
      width: dim, height: dim,
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 600, fontSize: fs,
      color: '#fff', flexShrink: 0,
      background: color || 'var(--accent)',
      border: '1.5px solid var(--border)',
      letterSpacing: '.03em',
    }}>
      {initials}
    </div>
  )
}
