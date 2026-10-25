import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as workspacesApi from '../api/workspaces'
import { useAuth } from './AuthContext'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

const DEFAULT_WORKSPACE = { name: 'My Workspace', emoji: '🚀', color: '#24366B' }

export function AppProvider({ children }) {
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null)
  // Start collapsed on phones so the sidebar does not cover the page.
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window === 'undefined' || window.innerWidth > 768)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshWorkspaces = useCallback(async () => {
    const list = await workspacesApi.listWorkspaces()
    setWorkspaces(list)
    return list
  }, [])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    refreshWorkspaces()
      .then(async (list) => {
        if (list.length === 0) {
          const ws = await workspacesApi.createWorkspace(DEFAULT_WORKSPACE)
          setWorkspaces([ws])
          setActiveWorkspaceId(ws.id)
        } else {
          setActiveWorkspaceId((prev) => prev ?? list[0].id)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  const addWorkspace = useCallback(async (name) => {
    const emojis = ['🌟', '💎', '🔥', '🎯', '🌊', '⚡', '🦋']
    const colors = ['#24366B', '#6A4C93', '#2F6F8F', '#2D7A4B', '#A86F12', '#C0392B']
    const ws = await workspacesApi.createWorkspace({
      name,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    })
    setWorkspaces((prev) => [...prev, ws])
    setActiveWorkspaceId(ws.id)
    return ws
  }, [])

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || null

  return (
    <AppCtx.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        setActiveWorkspaceId,
        activeWorkspace,
        sidebarOpen,
        setSidebarOpen,
        addWorkspace,
        loading,
        error,
      }}
    >
      {children}
    </AppCtx.Provider>
  )
}
