import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import Icons from '../icons/Icons'
import Avatar from './Avatar'
import PriorityBadge from './PriorityBadge'
import avatarColor from '../utils/avatarColor'

export default function KanbanCard({ card, index }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setExpanded((x) => !x)}
          style={{
            ...provided.draggableProps.style,
            background: snapshot.isDragging ? '#334155' : 'rgba(30,41,59,0.8)',
            border: `1px solid ${snapshot.isDragging ? 'rgba(99,102,241,0.6)' : 'rgba(51,65,85,0.6)'}`,
            borderRadius: 12,
            padding: '12px 14px',
            cursor: 'pointer',
            userSelect: 'none',
            marginBottom: 8,
            boxShadow: snapshot.isDragging ? '0 20px 40px rgba(99,102,241,0.2)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.4, flex: 1 }}>{card.title}</p>
            <div style={{ color: '#475569', fontSize: 10, flexShrink: 0 }}>⠿</div>
          </div>
          {expanded && card.description && (
            <p style={{ fontSize: 11, color: '#64748b', marginBottom: 10, lineHeight: 1.6 }}>{card.description}</p>
          )}
          {card.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
              {card.tags.map((t) => (
                <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(51,65,85,0.8)', color: '#64748b', border: '1px solid rgba(51,65,85,0.4)' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PriorityBadge priority={card.priority} />
              {card.due_date && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#475569' }}>
                  {Icons.Calendar} {card.due_date.slice(5).replace('-', '/')}
                </span>
              )}
            </div>
            {card.assignee && <Avatar initials={card.assignee} color={avatarColor(card.assignee)} />}
          </div>
        </div>
      )}
    </Draggable>
  )
}
