const PALETTE = ['#24366B', '#6A4C93', '#2F6F8F', '#2D7A4B', '#A86F12', '#C0392B', '#8A4B2E']

export default function avatarColor(initials) {
  if (!initials) return PALETTE[0]
  let hash = 0
  for (let i = 0; i < initials.length; i++) hash = initials.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}
