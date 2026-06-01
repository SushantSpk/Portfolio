import { useEffect, useState } from 'react'
import { getProfile, saveProfile, uploadAsset } from '../api/portfolioApi.js'
import AdminLayout from '../components/AdminLayout.jsx'
import { fallbackProfile } from '../data/fallbackData.js'

export default function AdminProfile() {
  const [profile, setProfile] = useState(fallbackProfile)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let active = true

    async function loadProfile() {
      try {
        const data = await getProfile()
        if (active && data) setProfile({ ...fallbackProfile, ...data })
      } catch {
        if (active) setError('Profile could not be loaded. You can still edit the fallback values.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [])

  function updateField(event) {
    setStatus('')
    setError('')
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setStatus('Uploading profile image...')
    setError('')

    try {
      const uploaded = await uploadAsset(file, 'profile')
      setProfile((current) => ({ ...current, profile_image_url: uploaded.publicUrl }))
      setStatus('Image uploaded. Save the profile to publish it.')
    } catch (uploadError) {
      setError(uploadError.response?.data?.error || 'Profile image upload failed.')
      setStatus('')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setStatus('')

    try {
      const savedProfile = await saveProfile(profile)
      setProfile({ ...fallbackProfile, ...savedProfile })
      setStatus('Profile saved and ready for the public site.')
    } catch (saveError) {
      setError(saveError.response?.data?.error || 'Profile could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Profile">
      <div className="admin-grid two admin-editor-grid">
        <form className="admin-form glass admin-editor-form" onSubmit={handleSubmit}>
          <div className="admin-form-head">
            <div>
              <span className="eyebrow">{loading ? 'Loading Profile' : 'Editable Profile'}</span>
              <h2>Public identity</h2>
            </div>
            <span className="admin-mini-pill">{saving ? 'Saving' : 'Draft ready'}</span>
          </div>

          <section className="admin-form-section">
            <h3>Identity</h3>
            <div className="admin-field-grid two">
              <Field label="Full name"><input name="full_name" value={profile.full_name || ''} onChange={updateField} required /></Field>
              <Field label="Role"><input name="role" value={profile.role || ''} onChange={updateField} /></Field>
            </div>
            <Field label="Bio"><textarea name="bio" value={profile.bio || ''} onChange={updateField} rows="5" /></Field>
          </section>

          <section className="admin-form-section">
            <h3>Contact</h3>
            <div className="admin-field-grid two">
              <Field label="Location"><input name="location" value={profile.location || ''} onChange={updateField} /></Field>
              <Field label="Email"><input name="email" type="email" value={profile.email || ''} onChange={updateField} /></Field>
            </div>
            <Field label="Resume URL"><input name="resume_url" value={profile.resume_url || ''} onChange={updateField} /></Field>
          </section>

          <section className="admin-form-section">
            <h3>Media</h3>
            <Field label="Profile image URL"><input name="profile_image_url" value={profile.profile_image_url || ''} onChange={updateField} /></Field>
            <Field label="Upload profile image"><input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} /></Field>
          </section>

          <button className="btn btn-primary" type="submit" disabled={saving || uploading}>{saving ? 'Saving profile...' : 'Save profile'}</button>
          {status && <p className="sent-msg show" aria-live="polite">{status}</p>}
          {error && <p className="form-error show" aria-live="polite">{error}</p>}
        </form>

        <aside className="admin-card glass admin-profile-preview">
          <span className="eyebrow">Live Preview</span>
          <div className="profile-preview-photo">
            {profile.profile_image_url ? <img src={profile.profile_image_url} alt="Profile preview" /> : <span>SS</span>}
          </div>
          <h2>{profile.full_name || 'Your name'}</h2>
          <p className="profile-preview-role">{profile.role || 'Your role'}</p>
          <p>{profile.bio || 'Your public bio will preview here as you type.'}</p>
          <div className="profile-preview-facts">
            <span>{profile.location || 'Location'}</span>
            <span>{profile.email || 'Email'}</span>
            <span>{profile.resume_url || 'Resume URL'}</span>
          </div>
        </aside>
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
