const PALETTE = ['#D37E69', '#D37E69', '#A94931', '#9C432D', '#f59e0b', '#ef4444', '#D27962']

export default function avatarColor(initials) {
  if (!initials) return PALETTE[0]
  let hash = 0
  for (let i = 0; i < initials.length; i++) hash = initials.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}
