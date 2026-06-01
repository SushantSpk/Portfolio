import axios from 'axios'
import { supabase } from '../lib/supabaseClient.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
})

export async function authHeaders() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default api
