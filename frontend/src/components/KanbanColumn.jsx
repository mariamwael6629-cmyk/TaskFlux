import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import KanbanCard from './KanbanCard'
import AddCardForm from './AddCardForm'

const COL_COLORS = {
  'To Do': '#8484b8',
  'In Progress': 'var(--accent-h)',
  'Under Review': 'var(--amber)',
  'Done': 'var(--green)',
}

export default function KanbanColumn({ column, onAddCard }) {
  const [adding, setAdding] = useState(false)
  const dotColor = COL_COLORS[column.title] || column.color || 'var(--text-3)'

  return (
    <div style={{ flexShrink: 0, width: 286, display: 'flex', flexDirection: 'column' }}>
      {/* Column header */}
      <div className="col-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="col-dot" style={{ background: dotColor }} />
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '.01em' }}>{column.title}</h3>
          <span className="col-count">{column.cards.length}</span>
        </div>
        <button
          style={{ padding: 4, borderRadius: 6, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: 80,
              borderRadius: 'var(--r)',
              padding: 4,
              border: `2px ${snapshot.isDraggingOver ? 'dashed var(--accent-b)' : 'solid transparent'}`,
              background: snapshot.isDraggingOver ? 'var(--accent-s)' : 'transparent',
              flex: 1,
            }}
          >
            {column.cards.map((card, idx) => (
              <KanbanCard key={card.id} card={card} index={idx} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {adding ? (
        <AddCardForm
          onAdd={(card) => { onAddCard(column.id, card); setAdding(false) }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="add-card-btn"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add card
        </button>
      )}
    </div>
  )
}
