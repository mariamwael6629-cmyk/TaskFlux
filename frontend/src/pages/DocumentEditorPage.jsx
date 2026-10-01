import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as documentsApi from '../api/documents'
import Icons from '../icons/Icons'

function renderMd(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('# '))
      return <h1 key={i} style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '24px 0 12px', fontFamily: 'Space Grotesk, sans-serif' }}>{line.slice(2)}</h1>
    if (line.startsWith('## '))
      return <h2 key={i} style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: '18px 0 8px', paddingBottom: 8, borderBottom: '1px solid var(--border)', fontFamily: 'Space Grotesk, sans-serif' }}>{line.slice(3)}</h2>
    if (line.startsWith('### '))
      return <h3 key={i} style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', margin: '14px 0 6px', fontFamily: 'Space Grotesk, sans-serif' }}>{line.slice(4)}</h3>
    if (line.startsWith('- [x] '))
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '3px 0' }}>
          <div style={{ width: 15, height: 15, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, color: '#fff' }}>✓</div>
          <span style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'line-through' }}>{line.slice(6)}</span>
        </div>
      )
    if (line.startsWith('- [ ] '))
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '3px 0' }}>
          <div style={{ width: 15, height: 15, borderRadius: 4, border: '1.5px solid var(--border)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{line.slice(6)}</span>
        </div>
      )
    if (line.startsWith('- '))
      return <div key={i} style={{ display: 'flex', gap: 8, padding: '2px 0 2px 4px' }}>
        <span style={{ color: 'var(--text-3)', marginTop: 7, width: 4, height: 4, borderRadius: '50%', background: 'var(--text-3)', flexShrink: 0, alignSelf: 'flex-start' }} />
        <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{line.slice(2)}</span>
      </div>
    if (line.match(/^\d+\. /))
      return <div key={i} style={{ display: 'flex', gap: 8, padding: '2px 0 2px 4px' }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)', minWidth: 20, flexShrink: 0 }}>{line.match(/^(\d+)/)[1]}.</span>
        <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{line.replace(/^\d+\. /, '')}</span>
      </div>
    if (line === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
    if (line === '') return <div key={i} style={{ height: 6 }} />
    return <p key={i} style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75, margin: '2px 0' }}>{line}</p>
  })
}

const TOOLBAR = [
  { label: 'H1', text: '# Heading 1', icon: Icons.H1 },
  { label: 'H2', text: '## Heading 2', icon: Icons.H2 },
  { label: 'H3', text: '### Heading 3', icon: Icons.TypeIcon },
  { label: 'Bold', text: '**Bold text**', icon: Icons.Bold },
  { label: 'Bullet', text: '- List item', icon: Icons.List },
  { label: 'Todo', text: '- [ ] Task item', icon: Icons.Hash },
  { label: 'Divider', text: '---', icon: Icons.Divider },
]

export default function DocumentEditorPage() {
  const { docId } = useParams()
  const [doc, setDoc] = useState(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [preview, setPreview] = useState(false)
  const [saved, setSaved] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    documentsApi.getDocument(docId).then((d) => {
      setDoc(d); setContent(d.content); setTitle(d.title); setSaved(true); setLoading(false)
    })
  }, [docId])

  const handleSave = async () => {
    const updated = await documentsApi.updateDocument(docId, { content, title })
    setDoc(updated)
    setSaved(true)
  }

  const insert = (text) => {
    setContent((c) => c + '\n' + text)
    setSaved(false)
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length

  if (loading || !doc) return <div className="loading-center">Loading document…</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Doc header */}
      <div style={{ flexShrink: 0, padding: '16px 24px', borderBottom: '1px solid var(--border-m)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{doc.emoji}</span>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setSaved(false) }}
              placeholder="Document title…"
              style={{
                fontSize: 17, fontWeight: 700, color: 'var(--text)',
                background: 'transparent', border: 'none', outline: 'none',
                flex: 1, minWidth: 0, fontFamily: 'Space Grotesk, sans-serif',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: saved ? 'var(--green)' : 'var(--amber)' }}>
              ● {saved ? 'Saved' : 'Unsaved'}
            </span>
            <button
              onClick={() => setPreview((x) => !x)}
              className={`btn btn-secondary btn-sm${preview ? '' : ''}`}
              style={preview ? { borderColor: 'var(--accent-b)', color: 'var(--accent-h)', background: 'var(--accent-s)' } : {}}
            >
              {Icons.Eye} {preview ? 'Edit' : 'Preview'}
            </button>
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              {Icons.Save} Save
            </button>
          </div>
        </div>

        {/* Toolbar */}
        {!preview && (
          <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {TOOLBAR.map((t) => (
              <button key={t.label} onClick={() => insert(t.text)} className="toolbar-btn">
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editor / Preview */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          {preview ? (
            <div>{renderMd(content)}</div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setSaved(false) }}
              placeholder={'Start writing…\n\nUse # for H1, ## for H2, - for bullets, - [ ] for checkboxes'}
              style={{
                width: '100%',
                minHeight: 'calc(100vh - 280px)',
                background: 'transparent',
                border: 'none', outline: 'none',
                fontSize: 13, color: 'var(--text-2)',
                resize: 'none', lineHeight: 1.85,
                fontFamily: "'Inter', monospace",
              }}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0, padding: '8px 24px',
        borderTop: '1px solid var(--border-m)',
        display: 'flex', gap: 16, alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          Last saved {new Date(doc.updated_at).toLocaleString()} · {doc.author}
        </span>
        <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{wordCount} words</span>
      </div>
    </div>
  )
}
