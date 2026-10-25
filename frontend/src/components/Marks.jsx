// Workspaces and documents store an emoji; they are shown as a coloured
// letter tile and a document icon instead.
export function WorkspaceMark({ workspace, size = 18 }) {
  const letter = (workspace?.name || '?').trim().charAt(0).toUpperCase()
  return (
    <span
      aria-hidden="true"
      style={{
        width: size, height: size, flexShrink: 0, borderRadius: 4,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: workspace?.color || 'var(--accent)', color: '#FFFEF9',
        fontFamily: 'Bitter, Georgia, serif', fontWeight: 700, fontSize: Math.round(size * 0.58), lineHeight: 1,
      }}
    >
      {letter}
    </span>
  )
}

export function DocMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--purple)' }}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4M9 12h7M9 16h5" />
    </svg>
  )
}
