export default function Avatar({ initials, size = 'sm', color }) {
  const s = size === 'sm' ? { width: 24, height: 24, fontSize: 10 } : { width: 32, height: 32, fontSize: 12 }
  return (
    <div
      style={{
        ...s,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        color: '#fff',
        flexShrink: 0,
        background: color || 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      }}
    >
      {initials}
    </div>
  )
}
