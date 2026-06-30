import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as documentsApi from '../api/documents'
import Icons from '../icons/Icons'

function renderMd(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: '20px 0 10px' }}>{line.slice(2)}</h1>
    if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', margin: '16px 0 8px', paddingBottom: 6, borderBottom: '1px solid #1e293b' }}>{line.slice(3)}</h2>
    if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', margin: '12px 0 6px' }}>{line.slice(4)}</h3>
    if (line.startsWith('- [x] '))
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 9, color: '#fff' }}>✓</div>
          <span style={{ fontSize: 13, color: '#64748b', textDecoration: 'line-through' }}>{line.slice(6)}</span>
        </div>
      )
    if (line.startsWith('- [ ] '))
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #475569', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: '#cbd5e1' }}>{line.slice(6)}</span>
        </div>
      )
    if (line.startsWith('- ')) return <li key={i} style={{ fontSize: 13, color: '#94a3b8', margin: '2px 0 2px 16px', lineHeight: 1.6 }}>{line.slice(2)}</li>
    if (line.match(/^\d+\. /)) return <li key={i} style={{ fontSize: 13, color: '#94a3b8', margin: '2px 0 2px 16px', lineHeight: 1.6, listStyleType: 'decimal' }}>{line.replace(/^\d+\. /, '')}</li>
    if (line === '---') return <hr key={i} style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '12px 0' }} />
    if (line === '') return <div key={i} style={{ height: 4 }} />
    return <p key={i} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '2px 0' }}>{line}</p>
  })
}

const toolbarConfig = [
  { icon: 'H1', label: 'H1', text: '# Heading 1' },
  { icon: 'H2', label: 'H2', text: '## Heading 2' },
  { icon: 'TypeIcon', label: 'H3', text: '### Heading 3' },
  { icon: 'Bold', label: 'Bold', text: '**Bold text**' },
  { icon: 'List', label: 'Bullet', text: '- List item' },
  { icon: 'Hash', label: 'Todo', text: '- [ ] Task item' },
  { icon: 'Divider', label: 'Divider', text: '---' },
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
      setDoc(d)
      setContent(d.content)
      setTitle(d.title)
      setSaved(true)
      setLoading(false)
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

  if (loading || !doc) {
    return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, padding: '20px 24px 12px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <span style={{ fontSize: 24 }}>{doc.emoji}</span>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setSaved(false)
              }}
              style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', background: 'transparent', border: 'none', outline: 'none', flex: 1 }}
              placeholder="Document title..."
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: saved ? '#10b981' : '#f59e0b', fontWeight: 500 }}>{saved ? '● Saved' : '● Unsaved'}</span>
            <button
              onClick={() => setPreview((x) => !x)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: 11,
                cursor: 'pointer',
                background: preview ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: preview ? '1px solid rgba(99,102,241,0.4)' : '1px solid #334155',
                color: preview ? '#818cf8' : '#94a3b8',
              }}
            >
              {Icons.Eye} {preview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, fontSize: 11, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {Icons.Save} Save
            </button>
          </div>
        </div>
        {!preview && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {toolbarConfig.map((t) => (
              <button
                key={t.label}
                onClick={() => insert(t.text)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 8, fontSize: 11, color: '#64748b', background: 'transparent', border: '1px solid transparent', cursor: 'pointer' }}
              >
                {Icons[t.icon]} {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {preview ? (
            <div>{renderMd(content)}</div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                setSaved(false)
              }}
              placeholder="Start writing... Use # for H1, ## for H2, - for bullets, - [ ] for checkboxes"
              style={{ width: '100%', minHeight: 'calc(100vh - 300px)', background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#94a3b8', resize: 'none', lineHeight: 1.8, fontFamily: 'monospace' }}
            />
          )}
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '6px 24px', borderTop: '1px solid #1e293b', display: 'flex', gap: 12 }}>
        <span style={{ fontSize: 10, color: '#475569' }}>
          Last edited {new Date(doc.updated_at).toLocaleString()} by {doc.author}
        </span>
        <span style={{ fontSize: 10, color: '#334155' }}>•</span>
        <span style={{ fontSize: 10, color: '#475569' }}>{content.split(' ').filter(Boolean).length} words</span>
      </div>
    </div>
  )
}
