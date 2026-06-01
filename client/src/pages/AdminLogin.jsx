import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { markAdminSessionStarted } from '../hooks/useAdminSessionTimeout.js'
import { supabase } from '../lib/supabaseClient.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim()
    const normalizedEmail = email.trim()

    if (!adminEmail) {
      setError('Admin email is not configured. Check client/.env.')
      setLoading(false)
      return
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
        await supabase.auth.signOut()
        setError('This email is not allowed to access the admin dashboard.')
        setLoading(false)
        return
      }

      markAdminSessionStarted()
      navigate('/admin')
    } catch {
      setError('Could not reach Supabase Auth. Please check your connection and environment setup.')
      setLoading(false)
    }
  }

  return (
    <main className="admin-shell login-shell">
      <section className="login-panel glass" aria-labelledby="admin-login-title">
        <div className="login-orb" />
        <div className="login-copy">
          <span className="admin-kicker">Secure admin access</span>
          <h1 id="admin-login-title">Portfolio Command Center</h1>
          <p>Manage profile details, projects, uploads, and messages from one protected CMS workspace.</p>
          <div className="login-security">
            <span>Supabase Auth</span>
            <span>Admin email gate</span>
            <span>60 min session</span>
          </div>
        </div>
        <form className="admin-form login-form" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">Admin Login</span>
            <h2>Welcome back</h2>
          </div>
          {location.state?.reason === 'expired' && (
            <p className="admin-alert warning" aria-live="polite">Your protected admin session expired. Please sign in again.</p>
          )}
          <label className="admin-field">
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </label>
          <label className="admin-field">
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Verifying access...' : 'Enter CMS'}</button>
          {error && <p className="form-error show" aria-live="polite">{error}</p>}
        </form>
      </section>
    </main>
  )
}
