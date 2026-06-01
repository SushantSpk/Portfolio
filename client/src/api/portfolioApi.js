import api, { authHeaders } from './axios.js'

export async function getProfile() {
  const { data } = await api.get('/api/profile')
  return data
}

export async function saveProfile(payload) {
  const headers = await authHeaders()
  const { data } = await api.put('/api/admin/profile', payload, { headers })
  return data
}

export async function getProjects() {
  const { data } = await api.get('/api/projects')
  return data
}

export async function createProject(payload) {
  const headers = await authHeaders()
  const { data } = await api.post('/api/admin/projects', payload, { headers })
  return data
}

export async function updateProject(id, payload) {
  const headers = await authHeaders()
  const { data } = await api.put(`/api/admin/projects/${id}`, payload, { headers })
  return data
}

export async function deleteProject(id) {
  const headers = await authHeaders()
  await api.delete(`/api/admin/projects/${id}`, { headers })
}

export async function uploadAsset(file, folder) {
  const headers = await authHeaders()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const { data } = await api.post('/api/admin/upload', formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export async function sendContactMessage(payload) {
  const { data } = await api.post('/api/contact', payload)
  return data
}
