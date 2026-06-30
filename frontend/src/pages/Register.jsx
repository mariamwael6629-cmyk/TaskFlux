import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setSubmitting(true)
    try {
      await register(name, email, password)
      navigate('/', { replace: true })
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Could not create account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#f1f5f9' }}>
      <form onSubmit={handleSubmit} style={{ width: 360, background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 16, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>✦</div>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>TaskFlux</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif' }}>Create your account</h1>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Start organizing your projects in seconds</p>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', fontSize: 12, padding: '8px 12px', borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Full name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex Santos"
          style={{ width: '100%', background: 'rgba(51,65,85,0.6)', color: '#e2e8f0', fontSize: 13, padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', outline: 'none', marginBottom: 14 }}
        />

        <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ width: '100%', background: 'rgba(51,65,85,0.6)', color: '#e2e8f0', fontSize: 13, padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', outline: 'none', marginBottom: 14 }}
        />

        <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          style={{ width: '100%', background: 'rgba(51,65,85,0.6)', color: '#e2e8f0', fontSize: 13, padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', outline: 'none', marginBottom: 20 }}
        />

        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', background: '#4f46e5', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 0', borderRadius: 8, border: 'none', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={{ fontSize: 12, color: '#64748b', marginTop: 18, textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>Sign in</Link>
        </p>
      </form>
    </div>
  )
}
