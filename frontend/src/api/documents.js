import client from './client'

export const listDocuments = (workspaceId) =>
  client.get(`/workspaces/${workspaceId}/documents`).then((r) => r.data)
export const createDocument = (workspaceId, payload) =>
  client.post(`/workspaces/${workspaceId}/documents`, payload).then((r) => r.data)
export const getDocument = (documentId) => client.get(`/documents/${documentId}`).then((r) => r.data)
export const updateDocument = (documentId, payload) =>
  client.patch(`/documents/${documentId}`, payload).then((r) => r.data)
export const deleteDocument = (documentId) => client.delete(`/documents/${documentId}`).then((r) => r.data)
