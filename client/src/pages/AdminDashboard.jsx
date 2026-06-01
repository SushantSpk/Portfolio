import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../api/portfolioApi.js'
import { getMessages } from '../api/messageApi.js'
import AdminLayout from '../components/AdminLayout.jsx'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, unread: 0, replied: 0, totalMessages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadStats() {
      try {
        const [projects, messages] = await Promise.all([getProjects(), getMessages()])
        if (!active) return

        setStats({
          projects: projects.length,
          unread: messages.filter((message) => message.status === 'unread').length,
          replied: messages.filter((message) => message.status === 'replied').length,
          totalMessages: messages.length,
        })
      } catch {
        if (active) setError('Dashboard data could not be loaded. Check backend, Supabase, and admin session.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadStats()

    return () => {
      active = false
    }
  }, [])

  return (
    <AdminLayout title="Dashboard">
      <section className="admin-hero glass">
        <div>
          <span className="admin-kicker">Live CMS overview</span>
          <h2>Your portfolio control room is online.</h2>
          <p>Review message activity, keep projects fresh, and update your public profile without touching code.</p>
        </div>
        <div className="admin-hero-actions">
          <Link className="btn btn-primary" to="/admin/projects">Manage projects</Link>
          <Link className="btn btn-ghost" to="/admin/messages">Open inbox</Link>
        </div>
      </section>

      {error && <p className="form-error show admin-page-error" aria-live="polite">{error}</p>}

      <div className="admin-grid admin-stat-grid">
        <Stat label="Projects" value={stats.projects} meta="Published project records" loading={loading} />
        <Stat label="Unread messages" value={stats.unread} meta={`${stats.totalMessages} total messages`} loading={loading} tone="warning" />
        <Stat label="Replied messages" value={stats.replied} meta="Messages marked replied" loading={loading} tone="success" />
      </div>

      <section className="admin-card glass admin-quick-panel">
        <div>
          <span className="eyebrow">Next Actions</span>
          <h2>Keep the portfolio current</h2>
        </div>
        <div className="admin-quick-actions">
          <Link to="/admin/profile">Update profile</Link>
          <Link to="/admin/projects">Add project</Link>
          <Link to="/admin/messages">Reply to leads</Link>
        </div>
      </section>
    </AdminLayout>
  )
}

function Stat({ label, value, meta, loading, tone = 'default' }) {
  return (
    <article className={`admin-card glass admin-stat ${tone}`}>
      <div className="fk">{label}</div>
      <strong>{loading ? '...' : value}</strong>
      <p>{loading ? 'Syncing with Supabase...' : meta}</p>
    </article>
  )
}
