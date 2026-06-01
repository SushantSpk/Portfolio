import { useEffect, useState } from 'react'
import { getProjects } from '../api/portfolioApi.js'
import { getMessages } from '../api/messageApi.js'
import AdminLayout from '../components/AdminLayout.jsx'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, unread: 0, replied: 0 })

  useEffect(() => {
    async function loadStats() {
      const [projects, messages] = await Promise.all([getProjects(), getMessages()])
      setStats({
        projects: projects.length,
        unread: messages.filter((message) => message.status === 'unread').length,
        replied: messages.filter((message) => message.status === 'replied').length,
      })
    }

    loadStats().catch(() => {})
  }, [])

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-grid">
        <Stat label="Projects" value={stats.projects} />
        <Stat label="Unread messages" value={stats.unread} />
        <Stat label="Replied messages" value={stats.replied} />
      </div>
    </AdminLayout>
  )
}

function Stat({ label, value }) {
  return (
    <div className="admin-card glass">
      <div className="fk">{label}</div>
      <strong>{value}</strong>
    </div>
  )
}
