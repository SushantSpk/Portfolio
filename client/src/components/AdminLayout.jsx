import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAdminSessionTimeout, { clearAdminSessionStarted } from '../hooks/useAdminSessionTimeout.js'
import { supabase } from '../lib/supabaseClient.js'

export default function AdminLayout({ title, children }) {
  const navigate = useNavigate()
  const session = useAdminSessionTimeout({ enforce: false })

  async function signOut() {
    clearAdminSessionStarted()
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const navItems = [
    ['/admin', 'Dashboard'],
    ['/admin/profile', 'Profile'],
    ['/admin/projects', 'Projects'],
    ['/admin/messages', 'Messages'],
  ]

  return (
    <main className="admin-shell admin-console">
      <aside className="admin-side glass" aria-label="Admin navigation">
        <Link className="admin-brand" to="/admin" aria-label="Portfolio CMS dashboard">
          <span className="admin-mark">SS</span>
          <span>
            <strong>Portfolio CMS</strong>
            <small>Command Center</small>
          </span>
        </Link>

        <div className={`admin-session ${session.expiringSoon ? 'warning' : ''}`}>
          <span className="session-dot" />
          <div>
            <strong>{session.expiringSoon ? 'Session expiring soon' : 'Protected session'}</strong>
            <small>{session.label} remaining</small>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(([to, label]) => (
            <NavLink to={to} end={to === '/admin'} key={to}>
              <span className="nav-spark" />
              {label}
            </NavLink>
          ))}
          <Link to="/" className="admin-view-site">View Site</Link>
        </nav>

        <button className="btn btn-ghost admin-signout" type="button" onClick={signOut}>Sign out</button>
      </aside>
      <section className="admin-main" aria-labelledby="admin-page-title">
        <div className="admin-head">
          <div>
            <span className="eyebrow">Admin Console</span>
            <h1 id="admin-page-title">{title}</h1>
          </div>
          <Link className="btn btn-ghost admin-head-action" to="/">View public site</Link>
        </div>
        {children}
      </section>
    </main>
  )
}
