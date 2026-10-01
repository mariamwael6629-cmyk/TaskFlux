import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import PriorityBadge from './PriorityBadge'
import Avatar from './Avatar'
import avatarColor from '../utils/avatarColor'
import Icons from '../icons/Icons'

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
          className={`k-card${snapshot.isDragging ? ' k-card-dragging' : ''}`}
          style={{ ...provided.draggableProps.style }}
        >
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.45, flex: 1 }}>
              {card.title}
            </p>
            <span style={{ color: 'var(--border)', fontSize: 12, flexShrink: 0, paddingTop: 1 }}>⠿</span>
          </div>

          {/* Description (expanded) */}
          {expanded && card.description && (
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.6 }}>
              {card.description}
            </p>
          )}

          {/* Tags */}
          {card.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
              {card.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 4,
                    background: 'var(--sf3)', color: 'var(--text-3)',
                    border: '1px solid var(--border)',
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PriorityBadge priority={card.priority} />
              {card.due_date && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-3)' }}>
                  {Icons.Calendar} {card.due_date.slice(5).replace('-', '/')}
                </span>
              )}
            </div>
            {card.assignee && (
              <Avatar initials={card.assignee} color={avatarColor(card.assignee)} />
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
