import { useEffect, useMemo, useState } from 'react'
import { createProject, deleteProject, getProjects, updateProject, uploadAsset } from '../api/portfolioApi.js'
import AdminLayout from '../components/AdminLayout.jsx'

const emptyProject = {
  title: '',
  category: '',
  description: '',
  image_url: '',
  shot_label: '',
  tech_stack: '',
  live_url: '',
  case_study_url: '',
  github_url: '',
  display_order: 0,
  is_featured: false,
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [draft, setDraft] = useState(emptyProject)
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    async function loadInitialProjects() {
      try {
        const data = await getProjects()
        if (active) setProjects(data)
      } catch {
        if (active) setError('Could not load projects. Check backend and Supabase setup.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadInitialProjects()

    return () => {
      active = false
    }
  }, [])

  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase()

    return projects
      .filter((project) => {
        if (filter === 'featured') return project.is_featured
        if (filter === 'missing-image') return !project.image_url
        return true
      })
      .filter((project) => {
        if (!search) return true
        return [project.title, project.category, project.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search))
      })
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }, [filter, projects, query])

  const stats = useMemo(() => ({
    total: projects.length,
    featured: projects.filter((project) => project.is_featured).length,
    missingImages: projects.filter((project) => !project.image_url).length,
  }), [projects])

  async function loadProjects() {
    const data = await getProjects()
    setProjects(data)
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setDraft((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setStatus('Uploading image...')
    setError('')

    try {
      const uploaded = await uploadAsset(file, 'projects')
      setDraft((current) => ({ ...current, image_url: uploaded.publicUrl }))
      setStatus('Image uploaded. Save the project to keep this URL.')
    } catch (uploadError) {
      setError(uploadError.response?.data?.error || 'Image upload failed.')
      setStatus('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setStatus('')

    const payload = {
      ...draft,
      tech_stack: String(draft.tech_stack || '').split(',').map((item) => item.trim()).filter(Boolean),
      display_order: Number(draft.display_order) || 0,
    }

    try {
      if (editingId) await updateProject(editingId, payload)
      else await createProject(payload)

      setDraft(emptyProject)
      setEditingId(null)
      setStatus(editingId ? 'Project updated.' : 'Project added.')
      await loadProjects()
    } catch (saveError) {
      setError(saveError.response?.data?.error || 'Project could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  function edit(project) {
    setEditingId(project.id)
    setDraft({
      ...emptyProject,
      ...project,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
    })
    setStatus(`Editing ${project.title}`)
    setError('')
  }

  function duplicate(project) {
    setEditingId(null)
    setDraft({
      ...emptyProject,
      ...project,
      id: undefined,
      title: `${project.title} Copy`,
      is_featured: false,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
      display_order: Number(project.display_order || 0) + 1,
    })
    setStatus(`Duplicating ${project.title}`)
    setError('')
  }

  async function remove(project) {
    const confirmed = window.confirm(`Delete "${project.title}" from your portfolio?`)
    if (!confirmed) return

    setError('')
    setStatus('')
    setSaving(true)

    try {
      await deleteProject(project.id)
      if (editingId === project.id) {
        setEditingId(null)
        setDraft(emptyProject)
      }
      setStatus('Project deleted.')
      await loadProjects()
    } catch (deleteError) {
      setError(deleteError.response?.data?.error || 'Project could not be deleted.')
    } finally {
      setSaving(false)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(emptyProject)
    setStatus('')
    setError('')
  }

  return (
    <AdminLayout title="Projects">
      <section className="admin-hero glass">
        <div>
          <span className="admin-kicker">Project studio</span>
          <h2>Curate the work your visitors see first.</h2>
          <p>Create, reorder, feature, and enrich project cards with screenshots and case-study links.</p>
        </div>
        <div className="admin-hero-actions">
          <button className="btn btn-primary" type="button" onClick={cancelEdit}>New project</button>
        </div>
      </section>

      <div className="admin-grid admin-stat-grid">
        <Stat label="Total projects" value={stats.total} meta="Visible public work records" loading={loading} />
        <Stat label="Featured" value={stats.featured} meta="Highlighted in the work grid" loading={loading} tone="success" />
        <Stat label="Need images" value={stats.missingImages} meta="Projects without screenshots" loading={loading} tone="warning" />
      </div>

      <div className="admin-grid two project-admin-grid">
        <form className="admin-form glass" onSubmit={handleSubmit}>
          <div className="admin-form-head">
            <div>
              <span className="eyebrow">{editingId ? 'Edit Project' : 'New Project'}</span>
              <h2>{draft.title || 'Project details'}</h2>
            </div>
            {editingId && <button className="btn btn-ghost" type="button" onClick={cancelEdit}>Cancel</button>}
          </div>

          <div className="admin-field-grid two">
            <Field label="Title"><input name="title" value={draft.title} onChange={updateField} required /></Field>
            <Field label="Category"><input name="category" value={draft.category || ''} onChange={updateField} placeholder="Operations, AI, Platform..." /></Field>
          </div>
          <Field label="Description"><textarea name="description" value={draft.description || ''} onChange={updateField} rows="4" /></Field>
          <div className="admin-field-grid two">
            <Field label="Shot label"><input name="shot_label" value={draft.shot_label || ''} onChange={updateField} placeholder={'dashboard ui \u00b7 drop screenshot'} /></Field>
            <Field label="Display order"><input name="display_order" type="number" value={draft.display_order || 0} onChange={updateField} /></Field>
          </div>
          <Field label="Tech stack, comma separated"><input name="tech_stack" value={draft.tech_stack || ''} onChange={updateField} placeholder="React, Node.js, PostgreSQL" /></Field>
          <Field label="Image URL"><input name="image_url" value={draft.image_url || ''} onChange={updateField} placeholder="Paste a Supabase Storage image URL or upload below" /></Field>
          <div className="admin-field-grid two">
            <Field label="Live URL"><input name="live_url" value={draft.live_url || ''} onChange={updateField} /></Field>
            <Field label="Case study URL"><input name="case_study_url" value={draft.case_study_url || ''} onChange={updateField} placeholder="#contact" /></Field>
          </div>
          <Field label="GitHub URL"><input name="github_url" value={draft.github_url || ''} onChange={updateField} /></Field>
          <label className="admin-check"><input name="is_featured" type="checkbox" checked={Boolean(draft.is_featured)} onChange={updateField} /> Featured project</label>
          <Field label="Project image"><input type="file" accept="image/*" onChange={uploadImage} /></Field>
          {draft.image_url && <button className="btn btn-ghost" type="button" onClick={() => setDraft((current) => ({ ...current, image_url: '' }))}>Clear image</button>}

          <div className="admin-project-preview glass">
            <div className="shot">
              <div className="shot-fill">
                {draft.image_url && <img className="shot-img" src={draft.image_url} alt="Project preview" />}
                <span className="shot-tag">{draft.shot_label || draft.category || 'project screenshot'}</span>
              </div>
            </div>
            <div>
              <span className="idx">{String(draft.display_order || 0).padStart(2, '0')} &mdash; {draft.category || 'Work'}</span>
              <h3>{draft.title || 'Project title'}</h3>
              <p>{draft.description || 'Project description preview appears here.'}</p>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save project' : 'Add project'}</button>
          {status && <p className="sent-msg show" aria-live="polite">{status}</p>}
          {error && <p className="form-error show" aria-live="polite">{error}</p>}
        </form>

        <section className="admin-card glass">
          <div className="admin-card-head">
            <div>
              <span className="eyebrow">Project Library</span>
              <h2>{filteredProjects.length} shown</h2>
            </div>
            {loading && <span className="admin-mini-pill">Syncing</span>}
          </div>
          <div className="admin-toolbar">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." />
            <div className="admin-filter">
              {[
                ['all', 'All'],
                ['featured', 'Featured'],
                ['missing-image', 'Need images'],
              ].map(([value, label]) => (
                <button className={`btn btn-ghost ${filter === value ? 'active' : ''}`} type="button" onClick={() => setFilter(value)} key={value}>{label}</button>
              ))}
            </div>
          </div>

          <div className="admin-list">
            {filteredProjects.map((project) => (
              <article className={`admin-row glass project-row ${editingId === project.id ? 'active' : ''}`} key={project.id}>
                <div className="admin-row-media">
                  {project.image_url ? <img src={project.image_url} alt="" /> : <span>{project.display_order || '-'}</span>}
                </div>
                <div className="admin-row-main">
                  <strong>{project.title}</strong>
                  <span>{String(project.display_order || 0).padStart(2, '0')} &mdash; {project.category || 'Work'} {project.is_featured ? <>&middot; Featured</> : ''}</span>
                  <small>{project.shot_label || 'No shot label yet'}</small>
                </div>
                <div className="admin-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => edit(project)}>Edit</button>
                  <button className="btn btn-ghost" type="button" onClick={() => duplicate(project)}>Duplicate</button>
                  <button className="btn btn-ghost danger" type="button" onClick={() => remove(project)} disabled={saving}>Delete</button>
                </div>
              </article>
            ))}
            {loading && <p className="admin-empty">Loading projects from Supabase...</p>}
            {!loading && !filteredProjects.length && <p className="admin-empty">No projects match this view.</p>}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function Stat({ label, value, meta, loading, tone = 'default' }) {
  return (
    <div className={`admin-card glass admin-stat ${tone}`}>
      <div className="fk">{label}</div>
      <strong>{loading ? '...' : value}</strong>
      <p>{loading ? 'Syncing project data...' : meta}</p>
    </div>
  )
}
