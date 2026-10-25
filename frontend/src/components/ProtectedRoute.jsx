import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: '#64748b' }}>
        Loading...
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}
