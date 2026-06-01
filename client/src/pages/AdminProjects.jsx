import { useEffect, useState } from 'react'
import { createProject, deleteProject, getProjects, updateProject, uploadAsset } from '../api/portfolioApi.js'
import AdminLayout from '../components/AdminLayout.jsx'

const emptyProject = {
  title: '',
  category: '',
  description: '',
  image_url: '',
  tech_stack: '',
  live_url: '',
  github_url: '',
  display_order: 0,
  is_featured: false,
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [draft, setDraft] = useState(emptyProject)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    let active = true

    async function loadInitialProjects() {
      const data = await getProjects()
      if (active) setProjects(data)
    }

    loadInitialProjects().catch(() => {})

    return () => {
      active = false
    }
  }, [])

  async function loadProjects() {
    setProjects(await getProjects())
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setDraft((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const uploaded = await uploadAsset(file, 'projects')
    setDraft((current) => ({ ...current, image_url: uploaded.publicUrl }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const payload = {
      ...draft,
      tech_stack: String(draft.tech_stack || '').split(',').map((item) => item.trim()).filter(Boolean),
      display_order: Number(draft.display_order) || 0,
    }

    if (editingId) await updateProject(editingId, payload)
    else await createProject(payload)

    setDraft(emptyProject)
    setEditingId(null)
    await loadProjects()
  }

  function edit(project) {
    setEditingId(project.id)
    setDraft({
      ...project,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
    })
  }

  return (
    <AdminLayout title="Projects">
      <form className="admin-form glass" onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={draft.title} onChange={updateField} required />
        <label>Category</label>
        <input name="category" value={draft.category || ''} onChange={updateField} />
        <label>Description</label>
        <textarea name="description" value={draft.description || ''} onChange={updateField} rows="4" />
        <label>Tech stack, comma separated</label>
        <input name="tech_stack" value={draft.tech_stack || ''} onChange={updateField} />
        <label>Live URL</label>
        <input name="live_url" value={draft.live_url || ''} onChange={updateField} />
        <label>GitHub URL</label>
        <input name="github_url" value={draft.github_url || ''} onChange={updateField} />
        <label>Display order</label>
        <input name="display_order" type="number" value={draft.display_order || 0} onChange={updateField} />
        <label className="admin-check"><input name="is_featured" type="checkbox" checked={Boolean(draft.is_featured)} onChange={updateField} /> Featured project</label>
        <label>Project image</label>
        <input type="file" accept="image/*" onChange={uploadImage} />
        {draft.image_url && <img className="admin-preview" src={draft.image_url} alt="Project preview" />}
        <button className="btn btn-primary" type="submit">{editingId ? 'Save project' : 'Add project'}</button>
      </form>

      <div className="admin-list">
        {projects.map((project) => (
          <article className="admin-row glass" key={project.id}>
            <div>
              <strong>{project.title}</strong>
              <span>{project.category}</span>
            </div>
            <div className="admin-actions">
              <button className="btn btn-ghost" type="button" onClick={() => edit(project)}>Edit</button>
              <button className="btn btn-ghost" type="button" onClick={() => deleteProject(project.id).then(loadProjects)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </AdminLayout>
  )
}
