import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!adminEmail || data.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
      await supabase.auth.signOut()
      setError('This email is not allowed to access the admin dashboard.')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <main className="admin-shell login-shell">
      <form className="admin-card glass" onSubmit={handleSubmit}>
        <span className="eyebrow">Admin Login</span>
        <h1>Portfolio CMS</h1>
        <label>Email</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        {error && <p className="form-error show">{error}</p>}
      </form>
    </main>
  )
}
