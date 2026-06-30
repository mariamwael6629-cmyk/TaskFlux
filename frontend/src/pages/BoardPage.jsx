import { useCallback, useEffect, useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { useApp } from '../context/AppContext'
import * as boardsApi from '../api/boards'
import KanbanColumn from '../components/KanbanColumn'
import Icons from '../icons/Icons'

export default function BoardPage() {
  const { activeWorkspace } = useApp()
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBoard = useCallback(async () => {
    if (!activeWorkspace) return
    setLoading(true)
    setError('')
    try {
      const boards = await boardsApi.listBoards(activeWorkspace.id)
      if (boards.length === 0) {
        setBoard(null)
        return
      }
      const detail = await boardsApi.getBoard(boards[0].id)
      setBoard(detail)
    } catch (err) {
      setError('Could not load board')
    } finally {
      setLoading(false)
    }
  }, [activeWorkspace])

  useEffect(() => {
    loadBoard()
  }, [loadBoard])

  const handleAddCard = async (columnId, cardData) => {
    const card = await boardsApi.createCard(columnId, cardData)
    setBoard((b) => ({
      ...b,
      columns: b.columns.map((c) => (c.id === columnId ? { ...c, cards: [...c.cards, card] } : c)),
    }))
  }

  const onDragEnd = async (result) => {
    if (!result.destination || !board) return
    const { source, destination } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const srcColId = Number(source.droppableId)
    const dstColId = Number(destination.droppableId)

    const columns = board.columns.map((c) => ({ ...c, cards: [...c.cards] }))
    const srcCol = columns.find((c) => c.id === srcColId)
    const dstCol = columns.find((c) => c.id === dstColId)
    const [moved] = srcCol.cards.splice(source.index, 1)
    dstCol.cards.splice(destination.index, 0, moved)

    setBoard({ ...board, columns })

    try {
      await boardsApi.updateCard(moved.id, { column_id: dstColId, order: destination.index })
      const reindex = srcColId === dstColId ? [dstCol] : [srcCol, dstCol]
      await Promise.all(
        reindex.flatMap((col) =>
          col.cards.map((c, idx) => (c.id === moved.id ? null : boardsApi.updateCard(c.id, { order: idx })))
        ).filter(Boolean)
      )
    } catch {
      loadBoard()
    }
  }

  if (loading) {
    return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>Loading board...</div>
  }

  if (error) {
    return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>{error}</div>
  }

  if (!board) {
    return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>No board found</div>
  }

  const totalCards = board.columns.reduce((a, c) => a + c.cards.length, 0)
  const inProgress = board.columns.find((c) => c.title === 'In Progress')?.cards.length || 0
  const done = board.columns.find((c) => c.title === 'Done')?.cards.length || 0
  const overdue = board.columns.reduce(
    (a, c) => a + c.cards.filter((card) => card.due_date && card.due_date < new Date().toISOString().slice(0, 10) && c.title !== 'Done').length,
    0
  )

  const stats = [
    { label: 'Total Tasks', value: totalCards, icon: Icons.Target, bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', color: '#818cf8' },
    { label: 'In Progress', value: inProgress, icon: Icons.Zap, bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
    { label: 'Completed', value: done, icon: Icons.CheckCircle, bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', color: '#34d399' },
    { label: 'Overdue', value: overdue, icon: Icons.Alert, bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)', color: '#fb7185' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, padding: '20px 24px 16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{board.name}</h1>
            <p style={{ fontSize: 11, color: '#64748b' }}>Drag cards between columns to update status</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
              {s.icon}
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, opacity: 0.65, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: 16, padding: 24, height: '100%', minWidth: 'max-content' }}>
            {board.columns.map((column) => (
              <KanbanColumn key={column.id} column={column} onAddCard={handleAddCard} />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
