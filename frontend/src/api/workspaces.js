import client from './client'

export const listWorkspaces = () => client.get('/workspaces').then((r) => r.data)
export const createWorkspace = (payload) => client.post('/workspaces', payload).then((r) => r.data)
export const listMembers = (workspaceId) =>
  client.get(`/workspaces/${workspaceId}/members`).then((r) => r.data)
export const addMember = (workspaceId, payload) =>
  client.post(`/workspaces/${workspaceId}/members`, payload).then((r) => r.data)
