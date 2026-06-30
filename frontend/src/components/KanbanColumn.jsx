import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import KanbanCard from './KanbanCard'
import AddCardForm from './AddCardForm'
import Icons from '../icons/Icons'

const COL_ICONS = {
  'To Do': Icons.Circle,
  'In Progress': Icons.Trending,
  'Under Review': Icons.Alert,
  Done: Icons.CheckCircle,
}

export default function KanbanColumn({ column, onAddCard }) {
  const [adding, setAdding] = useState(false)
  const icon = COL_ICONS[column.title] || Icons.Circle

  return (
    <div style={{ flexShrink: 0, width: 288 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: column.color }}>{icon}</span>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{column.title}</h3>
          <span style={{ fontSize: 11, background: '#1e293b', border: '1px solid #334155', color: '#64748b', padding: '1px 8px', borderRadius: 12, fontWeight: 500, minWidth: 22, textAlign: 'center' }}>
            {column.cards.length}
          </span>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4, borderRadius: 8, display: 'flex', alignItems: 'center' }}>
          {Icons.MoreH}
        </button>
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: 120,
              borderRadius: 12,
              padding: 8,
              background: snapshot.isDraggingOver ? 'rgba(99,102,241,0.05)' : 'transparent',
              border: `2px ${snapshot.isDraggingOver ? 'dashed rgba(99,102,241,0.3)' : 'solid transparent'}`,
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
          onAdd={(card) => {
            onAddCard(column.id, card)
            setAdding(false)
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{ width: '100%', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 12, background: 'none', border: '1px solid transparent', color: '#475569', cursor: 'pointer', fontSize: 12 }}
        >
          <span style={{ color: '#6366f1', fontSize: 16, lineHeight: 1 }}>+</span> Add card
        </button>
      )}
    </div>
  )
}
