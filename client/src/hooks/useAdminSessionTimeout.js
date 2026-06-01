import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export const ADMIN_SESSION_STARTED_KEY = 'ss-admin-session-started-at'
export const ADMIN_SESSION_DURATION_MS = 60 * 60 * 1000
export const ADMIN_SESSION_WARNING_MS = 5 * 60 * 1000

export function markAdminSessionStarted(timestamp = Date.now()) {
  localStorage.setItem(ADMIN_SESSION_STARTED_KEY, String(timestamp))
}

export function clearAdminSessionStarted() {
  localStorage.removeItem(ADMIN_SESSION_STARTED_KEY)
}

export function getAdminSessionStarted() {
  const rawValue = localStorage.getItem(ADMIN_SESSION_STARTED_KEY)
  const timestamp = Number(rawValue)

  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null
}

export function getAdminSessionRemaining(now = Date.now()) {
  const startedAt = getAdminSessionStarted()
  if (!startedAt) return ADMIN_SESSION_DURATION_MS

  return Math.max(0, ADMIN_SESSION_DURATION_MS - (now - startedAt))
}

export function isAdminSessionExpired(now = Date.now()) {
  const startedAt = getAdminSessionStarted()
  return Boolean(startedAt && now - startedAt >= ADMIN_SESSION_DURATION_MS)
}

export function formatAdminSessionRemaining(ms) {
  const minutes = Math.max(0, Math.ceil(ms / 60000))
  return `${minutes} min`
}

export default function useAdminSessionTimeout({ enabled = true, enforce = true } = {}) {
  const navigate = useNavigate()
  const handledExpiryRef = useRef(false)
  const [remainingMs, setRemainingMs] = useState(() => getAdminSessionRemaining())

  useEffect(() => {
    if (!enabled) return undefined

    if (!getAdminSessionStarted()) markAdminSessionStarted()

    async function expireSession() {
      if (handledExpiryRef.current) return
      handledExpiryRef.current = true
      clearAdminSessionStarted()
      await supabase.auth.signOut()
      navigate('/admin/login', {
        replace: true,
        state: { reason: 'expired' },
      })
    }

    function tick() {
      const nextRemainingMs = getAdminSessionRemaining()
      setRemainingMs(nextRemainingMs)

      if (enforce && nextRemainingMs <= 0) {
        expireSession()
      }
    }

    tick()
    const intervalId = window.setInterval(tick, 1000)

    return () => window.clearInterval(intervalId)
  }, [enabled, enforce, navigate])

  return {
    remainingMs,
    expiringSoon: remainingMs <= ADMIN_SESSION_WARNING_MS,
    expired: remainingMs <= 0,
    label: formatAdminSessionRemaining(remainingMs),
  }
}
