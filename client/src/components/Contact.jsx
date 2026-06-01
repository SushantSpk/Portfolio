import { useState } from 'react'
import { sendContactMessage } from '../api/portfolioApi.js'

const initialForm = {
  name: '',
  email: '',
  company: '',
  message: '',
}

export default function Contact({ profile }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    setError('')

    try {
      await sendContactMessage(form)
      setForm(initialForm)
      setStatus('sent')
    } catch (err) {
      setStatus('idle')
      setError(err.response?.data?.error || 'Message could not be sent right now. Please email me directly.')
    }
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="contact-card glass reveal">
          <div className="contact-glow" />
          <div className="contact-grid">
            <div className="contact-l">
              <span className="eyebrow">Contact</span>
              <h2>Have a system, product, or automation idea to build?</h2>
              <p>Let&apos;s turn it into something clean, scalable, and useful. Tell me about the problem and I&apos;ll reply within a day.</p>
              <div className="contact-links">
                <a href={`mailto:${profile.email}`}><span className="cl-icon"><EmailIcon /></span>{profile.email}</a>
                <a href="https://linkedin.com/in/sushantsapkota" target="_blank" rel="noreferrer"><span className="cl-icon"><LinkedInIcon /></span>linkedin.com/in/sushantsapkota</a>
                <a href="https://github.com/sushantsapkota" target="_blank" rel="noreferrer"><span className="cl-icon"><GitHubIcon /></span>github.com/sushantsapkota</a>
              </div>
            </div>
            <div className="contact-r">
              <form className={`form ${status === 'sent' ? 'is-sent' : ''}`} id="contactForm" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="field"><label htmlFor="cn">Name</label><input id="cn" name="name" type="text" placeholder="Your name" value={form.name} onChange={updateField} required /></div>
                  <div className="field"><label htmlFor="ce">Email</label><input id="ce" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={updateField} required /></div>
                </div>
                <div className="field"><label htmlFor="cc">Company <span className="opt">(optional)</span></label><input id="cc" name="company" type="text" placeholder="Company or project name" value={form.company} onChange={updateField} /></div>
                <div className="field"><label htmlFor="cm">What are you building?</label><textarea id="cm" name="message" placeholder="Tell me about the problem you want to solve..." value={form.message} onChange={updateField} required /></div>
                <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Send message'}</button>
                <p className={`form-error ${error ? 'show' : ''}`} role="status" aria-live="polite">{error}</p>
                <p className="form-note">Or email directly. I read every message.</p>
              </form>
              <div className={`sent-msg ${status === 'sent' ? 'show' : ''}`} role="status" aria-live="polite" tabIndex="-1">
                Thanks. Your message is saved and on its way to my dashboard.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z" />
      <path d="M6 9H2v11h4z" />
      <path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3-.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C6.1 1.2 5 1.5 5 1.5a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.5 8.5c0 5 3 6.2 6 6.5a3.4 3.4 0 0 0-1 2.6V22" />
    </svg>
  )
}
