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
                <a href={`mailto:${profile.email}`}><span className="cl-icon">EM</span>{profile.email}</a>
                <a href="#"><span className="cl-icon">in</span>linkedin.com/in/sushantsapkota</a>
                <a href="#"><span className="cl-icon">GH</span>github.com/sushantsapkota</a>
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
