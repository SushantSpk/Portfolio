import { useEffect, useMemo, useState } from 'react'
import { getMessages, replyToMessage, updateMessageStatus } from '../api/messageApi.js'
import AdminLayout from '../components/AdminLayout.jsx'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    let active = true

    async function loadInitialMessages() {
      const data = await getMessages()
      if (!active) return
      setMessages(data)
      if (data.length) setSelected(data[0])
    }

    loadInitialMessages().catch(() => {})

    return () => {
      active = false
    }
  }, [])

  async function loadMessages() {
    const data = await getMessages()
    setMessages(data)
    setSelected((current) => current || data[0] || null)
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return messages
    return messages.filter((message) => message.status === filter)
  }, [filter, messages])

  async function mark(statusValue) {
    if (!selected) return
    const updated = await updateMessageStatus(selected.id, statusValue)
    setSelected(updated)
    await loadMessages()
  }

  async function sendReply(event) {
    event.preventDefault()
    if (!selected) return
    await replyToMessage(selected.id, reply)
    setReply('')
    setStatus('Reply sent and saved.')
    await loadMessages()
  }

  return (
    <AdminLayout title="Messages">
      <div className="admin-grid two">
        <div className="admin-card glass">
          <div className="admin-filter">
            {['all', 'unread', 'read', 'replied'].map((item) => (
              <button className="btn btn-ghost" type="button" onClick={() => setFilter(item)} key={item}>{item}</button>
            ))}
          </div>
          <div className="admin-list">
            {filtered.map((message) => (
              <button className="admin-row glass" type="button" onClick={() => setSelected(message)} key={message.id}>
                <div>
                  <strong>{message.name}</strong>
                  <span>{message.email}</span>
                </div>
                <small>{message.status}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-card glass">
          {selected ? (
            <>
              <span className="eyebrow">{selected.status}</span>
              <h2>{selected.name}</h2>
              <p>{selected.email}</p>
              {selected.company && <p>{selected.company}</p>}
              <blockquote className="admin-message">{selected.message}</blockquote>
              <div className="admin-actions">
                <button className="btn btn-ghost" type="button" onClick={() => mark('read')}>Mark read</button>
                <button className="btn btn-ghost" type="button" onClick={() => mark('unread')}>Mark unread</button>
              </div>
              <form className="admin-form compact" onSubmit={sendReply}>
                <label>Reply by email</label>
                <textarea rows="6" value={reply} onChange={(event) => setReply(event.target.value)} required />
                <button className="btn btn-primary" type="submit">Send reply</button>
                {status && <p className="sent-msg show">{status}</p>}
              </form>
            </>
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
