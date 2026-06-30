import client from './client'

export const listBoards = (workspaceId) =>
  client.get(`/workspaces/${workspaceId}/boards`).then((r) => r.data)
export const createBoard = (workspaceId, payload) =>
  client.post(`/workspaces/${workspaceId}/boards`, payload).then((r) => r.data)
export const getBoard = (boardId) => client.get(`/boards/${boardId}`).then((r) => r.data)
export const createColumn = (boardId, payload) =>
  client.post(`/boards/${boardId}/columns`, payload).then((r) => r.data)
export const createCard = (columnId, payload) =>
  client.post(`/columns/${columnId}/cards`, payload).then((r) => r.data)
export const updateCard = (cardId, payload) =>
  client.patch(`/cards/${cardId}`, payload).then((r) => r.data)
export const deleteCard = (cardId) => client.delete(`/cards/${cardId}`).then((r) => r.data)
