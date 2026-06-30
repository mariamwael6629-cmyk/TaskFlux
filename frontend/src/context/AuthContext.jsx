import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('taskflux_user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('taskflux_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .fetchMe()
      .then((u) => {
        setUser(u)
        localStorage.setItem('taskflux_user', JSON.stringify(u))
      })
      .catch(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('taskflux_token')
        localStorage.removeItem('taskflux_user')
      })
      .finally(() => setLoading(false))
  }, [])

  const persist = (data) => {
    localStorage.setItem('taskflux_token', data.access_token)
    localStorage.setItem('taskflux_user', JSON.stringify(data.user))
    setToken(data.access_token)
    setUser(data.user)
  }

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password })
    persist(data)
    return data.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password })
    persist(data)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('taskflux_token')
    localStorage.removeItem('taskflux_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
