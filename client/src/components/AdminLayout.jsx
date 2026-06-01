import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function AdminLayout({ title, children }) {
  const navigate = useNavigate()

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <main className="admin-shell">
      <aside className="admin-side glass">
        <Link className="brand" to="/">
          <span className="mark">SS</span>
          <span className="who">Admin<small>Portfolio CMS</small></span>
        </Link>
        <nav className="admin-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/profile">Profile</Link>
          <Link to="/admin/projects">Projects</Link>
          <Link to="/admin/messages">Messages</Link>
          <Link to="/">View Site</Link>
        </nav>
        <button className="btn btn-ghost" type="button" onClick={signOut}>Sign out</button>
      </aside>
      <section className="admin-main">
        <div className="admin-head">
          <span className="eyebrow">Admin</span>
          <h1>{title}</h1>
        </div>
        {children}
      </section>
    </main>
  )
}
