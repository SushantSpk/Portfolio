import { useEffect, useState } from 'react'
import { getProfile, getProjects } from '../api/portfolioApi.js'
import About from '../components/About.jsx'
import Contact from '../components/Contact.jsx'
import Experience from '../components/Experience.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import Navbar from '../components/Navbar.jsx'
import Process from '../components/Process.jsx'
import Projects from '../components/Projects.jsx'
import Services from '../components/Services.jsx'
import Skills from '../components/Skills.jsx'
import { fallbackProfile, fallbackProjects } from '../data/fallbackData.js'
import usePortfolioEffects from '../hooks/usePortfolioEffects.js'

export default function PortfolioPage() {
  const [profile, setProfile] = useState(fallbackProfile)
  const [projects, setProjects] = useState(fallbackProjects)

  usePortfolioEffects()

  useEffect(() => {
    let active = true

    async function loadContent() {
      const [profileResult, projectsResult] = await Promise.allSettled([getProfile(), getProjects()])
      if (!active) return

      if (profileResult.status === 'fulfilled') {
        const profileData = profileResult.value
        if (profileData) setProfile({ ...fallbackProfile, ...profileData })
      }

      if (projectsResult.status === 'fulfilled') {
        const projectsData = projectsResult.value
        if (Array.isArray(projectsData) && projectsData.length > 0) setProjects(projectsData)
      }
      // Keep fallback content for whichever Supabase request is not ready yet.
    }

    loadContent()
    const refreshWhenVisible = () => {
      if (!document.hidden) loadContent()
    }

    window.addEventListener('focus', loadContent)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      active = false
      window.removeEventListener('focus', loadContent)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [])

  return (
    <>
      <div className="page-bg" />
      <div className="page-grid" />
      <div className="cursor-glow" id="cursorGlow" />
      <Navbar />
      <main id="top">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills />
        <Projects projects={projects} />
        <Experience />
        <Services />
        <Process />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  )
}
