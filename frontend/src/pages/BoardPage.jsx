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
      if (boards.length === 0) { setBoard(null); return }
      const detail = await boardsApi.getBoard(boards[0].id)
      setBoard(detail)
    } catch {
      setError('Could not load board')
    } finally {
      setLoading(false)
    }
  }, [activeWorkspace])

  useEffect(() => { loadBoard() }, [loadBoard])

  const handleAddCard = async (columnId, cardData) => {
    const card = await boardsApi.createCard(columnId, cardData)
    setBoard((b) => ({
      ...b,
      columns: b.columns.map((c) => c.id === columnId ? { ...c, cards: [...c.cards, card] } : c),
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
          col.cards.map((c, idx) => c.id === moved.id ? null : boardsApi.updateCard(c.id, { order: idx }))
        ).filter(Boolean)
      )
    } catch {
      loadBoard()
    }
  }

  if (loading) return <div className="loading-center">Loading board…</div>
  if (error) return <div className="loading-center" style={{ color: 'var(--red)' }}>{error}</div>
  if (!board) return <div className="loading-center">No board found in this workspace</div>

  const totalCards = board.columns.reduce((a, c) => a + c.cards.length, 0)
  const inProgress = board.columns.find((c) => c.title === 'In Progress')?.cards.length || 0
  const done = board.columns.find((c) => c.title === 'Done')?.cards.length || 0
  const overdue = board.columns.reduce(
    (a, c) => a + c.cards.filter((card) => card.due_date && card.due_date < new Date().toISOString().slice(0, 10) && c.title !== 'Done').length, 0
  )

  const boardStats = [
    { label: 'Total', value: totalCards, color: 'var(--text-2)', dot: 'var(--border)' },
    { label: 'In Progress', value: inProgress, color: 'var(--accent-h)', dot: 'var(--accent)' },
    { label: 'Completed', value: done, color: 'var(--green)', dot: 'var(--green)' },
    { label: 'Overdue', value: overdue, color: 'var(--red)', dot: 'var(--red)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '20px 24px 16px', borderBottom: '1px solid var(--border-m)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{board.name}</h1>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Drag cards between columns to update status</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {boardStats.map((s) => (
            <div
              key={s.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px',
                background: 'var(--sf2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r)', fontSize: 13,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
              <span style={{ fontWeight: 700, color: s.color, fontFamily: 'Space Grotesk, sans-serif', fontSize: 16 }}>{s.value}</span>
              <span style={{ color: 'var(--text-3)', fontSize: 12 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Board columns */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: 14, padding: '20px 24px', height: '100%', minWidth: 'max-content', alignItems: 'flex-start' }}>
            {board.columns.map((column) => (
              <KanbanColumn key={column.id} column={column} onAddCard={handleAddCard} />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
