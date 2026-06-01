import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAdminSessionTimeout, {
  clearAdminSessionStarted,
  getAdminSessionStarted,
  isAdminSessionExpired,
  markAdminSessionStarted,
} from '../hooks/useAdminSessionTimeout.js'
import { supabase } from '../lib/supabaseClient.js'

export default function ProtectedRoute({ children }) {
  const [state, setState] = useState({ loading: true, allowed: false })
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  useAdminSessionTimeout({ enabled: state.allowed, enforce: true })

  useEffect(() => {
    let active = true

    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      const email = data.session?.user?.email
      const allowed = Boolean(email && adminEmail && email.toLowerCase() === adminEmail.toLowerCase())

      if (allowed && isAdminSessionExpired()) {
        clearAdminSessionStarted()
        await supabase.auth.signOut()
        if (active) setState({ loading: false, allowed: false })
        return
      }

      if (allowed && !getAdminSessionStarted()) markAdminSessionStarted()
      if (!allowed) clearAdminSessionStarted()

      if (active) setState({ loading: false, allowed })
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkSession()
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [adminEmail])

  if (state.loading) {
    return (
      <div className="admin-shell admin-guard-shell">
        <div className="admin-card glass admin-guard-card">
          <span className="admin-loader" aria-hidden="true" />
          Checking admin session...
        </div>
      </div>
    )
  }
  if (!state.allowed) return <Navigate to="/admin/login" replace />

  return children
}
