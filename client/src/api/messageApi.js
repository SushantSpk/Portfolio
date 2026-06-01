import api, { authHeaders } from './axios.js'

export async function getMessages() {
  const headers = await authHeaders()
  const { data } = await api.get('/api/admin/messages', { headers })
  return data
}

export async function getMessage(id) {
  const headers = await authHeaders()
  const { data } = await api.get(`/api/admin/messages/${id}`, { headers })
  return data
}

export async function updateMessageStatus(id, status) {
  const headers = await authHeaders()
  const { data } = await api.patch(`/api/admin/messages/${id}/status`, { status }, { headers })
  return data
}

export async function replyToMessage(id, replyBody) {
  const headers = await authHeaders()
  const { data } = await api.post(
    `/api/admin/messages/${id}/reply`,
    { reply_body: replyBody },
    { headers },
  )
  return data
}
