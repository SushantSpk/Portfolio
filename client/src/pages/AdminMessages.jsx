import { useEffect, useMemo, useState } from 'react'
import { getMessages, replyToMessage, updateMessageStatus } from '../api/messageApi.js'
import AdminLayout from '../components/AdminLayout.jsx'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let active = true

    async function loadInitialMessages() {
      try {
        const data = await getMessages()
        if (!active) return
        setMessages(data)
        if (data.length) setSelected(data[0])
      } catch {
        if (active) setError('Could not load messages. Check your backend and admin login.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadInitialMessages()

    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => ({
    unread: messages.filter((message) => message.status === 'unread').length,
    read: messages.filter((message) => message.status === 'read').length,
    replied: messages.filter((message) => message.status === 'replied').length,
  }), [messages])

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()

    return messages
      .filter((message) => (filter === 'all' ? true : message.status === filter))
      .filter((message) => {
        if (!search) return true
        return [message.name, message.email, message.company, message.message]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search))
      })
  }, [filter, messages, query])

  async function loadMessages(nextSelectedId = selected?.id) {
    const data = await getMessages()
    setMessages(data)
    setSelected(data.find((message) => message.id === nextSelectedId) || data[0] || null)
  }

  async function mark(statusValue) {
    if (!selected) return
    setError('')
    const updated = await updateMessageStatus(selected.id, statusValue)
    setSelected(updated)
    setStatus(`Marked as ${statusValue}.`)
    await loadMessages(updated.id)
  }

  async function sendReply(event) {
    event.preventDefault()
    if (!selected) return

    setSending(true)
    setError('')
    setStatus('')

    try {
      await replyToMessage(selected.id, reply)
      setReply('')
      setStatus('Reply sent and saved.')
      await loadMessages(selected.id)
    } catch (sendError) {
      setError(sendError.response?.data?.error || 'Reply could not be sent. Check Resend setup.')
    } finally {
      setSending(false)
    }
  }

  return (
    <AdminLayout title="Messages">
      <div className="admin-grid">
        <Stat label="Unread" value={stats.unread} />
        <Stat label="Read" value={stats.read} />
        <Stat label="Replied" value={stats.replied} />
      </div>

      <div className="admin-grid two">
        <section className="admin-card glass">
          <div className="admin-toolbar">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages..." />
            <div className="admin-filter">
              {['all', 'unread', 'read', 'replied'].map((item) => (
                <button className={`btn btn-ghost ${filter === item ? 'active' : ''}`} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>
              ))}
            </div>
          </div>

          {loading && <p className="admin-empty">Loading messages...</p>}
          {error && <p className="form-error show">{error}</p>}
          <div className="admin-list">
            {filtered.map((message) => (
              <button
                className={`admin-row glass message-row ${selected?.id === message.id ? 'active' : ''}`}
                type="button"
                onClick={() => {
                  setSelected(message)
                  setStatus('')
                  setError('')
                }}
                key={message.id}
              >
                <div className="admin-row-main">
                  <strong>{message.name}</strong>
                  <span>{message.email}</span>
                  <small>{message.company || formatDate(message.created_at)}</small>
                </div>
                <small className={`status-pill ${message.status}`}>{message.status}</small>
              </button>
            ))}
            {!loading && !filtered.length && <p className="admin-empty">No messages match this view.</p>}
          </div>
        </section>

        <section className="admin-card glass">
          {selected ? (
            <>
              <div className="message-detail-head">
                <div>
                  <span className="eyebrow">{selected.status}</span>
                  <h2>{selected.name}</h2>
                  <p>{selected.email}</p>
                  {selected.company && <p>{selected.company}</p>}
                </div>
                <a className="btn btn-ghost" href={`mailto:${selected.email}`}>Open email</a>
              </div>
              <blockquote className="admin-message">{selected.message}</blockquote>
              <div className="admin-actions">
                <button className="btn btn-ghost" type="button" onClick={() => mark('read')}>Mark read</button>
                <button className="btn btn-ghost" type="button" onClick={() => mark('unread')}>Mark unread</button>
                <button className="btn btn-ghost" type="button" onClick={() => mark('replied')}>Mark replied</button>
              </div>
              <form className="admin-form compact" onSubmit={sendReply}>
                <label>Reply by email</label>
                <textarea rows="7" value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Hi ${selected.name},`} required />
                <button className="btn btn-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send reply with Resend'}</button>
                {status && <p className="sent-msg show">{status}</p>}
                {error && <p className="form-error show">{error}</p>}
              </form>
            </>
          ) : (
            <p className="admin-empty">Select a message to read and reply.</p>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}

function Stat({ label, value }) {
  return (
    <div className="admin-card glass admin-stat">
      <div className="fk">{label}</div>
      <strong>{value}</strong>
    </div>
  )
}

function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}
