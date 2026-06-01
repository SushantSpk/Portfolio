import { useEffect, useState } from 'react'
import { getProfile, saveProfile, uploadAsset } from '../api/portfolioApi.js'
import AdminLayout from '../components/AdminLayout.jsx'
import { fallbackProfile } from '../data/fallbackData.js'

export default function AdminProfile() {
  const [profile, setProfile] = useState(fallbackProfile)
  const [status, setStatus] = useState('')

  useEffect(() => {
    getProfile().then((data) => {
      if (data) setProfile({ ...fallbackProfile, ...data })
    }).catch(() => {})
  }, [])

  function updateField(event) {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const uploaded = await uploadAsset(file, 'profile')
    setProfile((current) => ({ ...current, profile_image_url: uploaded.publicUrl }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await saveProfile(profile)
    setStatus('Profile saved.')
  }

  return (
    <AdminLayout title="Profile">
      <form className="admin-form glass" onSubmit={handleSubmit}>
        <label>Full name</label>
        <input name="full_name" value={profile.full_name || ''} onChange={updateField} required />
        <label>Role</label>
        <input name="role" value={profile.role || ''} onChange={updateField} />
        <label>Bio</label>
        <textarea name="bio" value={profile.bio || ''} onChange={updateField} rows="5" />
        <label>Location</label>
        <input name="location" value={profile.location || ''} onChange={updateField} />
        <label>Email</label>
        <input name="email" value={profile.email || ''} onChange={updateField} />
        <label>Resume URL</label>
        <input name="resume_url" value={profile.resume_url || ''} onChange={updateField} />
        <label>Profile image</label>
        <input type="file" accept="image/*" onChange={uploadImage} />
        {profile.profile_image_url && <img className="admin-preview" src={profile.profile_image_url} alt="Profile preview" />}
        <button className="btn btn-primary" type="submit">Save profile</button>
        {status && <p className="sent-msg show">{status}</p>}
      </form>
    </AdminLayout>
  )
}
