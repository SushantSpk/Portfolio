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
      try {
        const [profileData, projectsData] = await Promise.all([getProfile(), getProjects()])
        if (!active) return
        if (profileData) setProfile({ ...fallbackProfile, ...profileData })
        if (Array.isArray(projectsData) && projectsData.length > 0) setProjects(projectsData)
      } catch {
        // Keep the static fallback content when Supabase tables are not ready yet.
      }
    }

    loadContent()

    return () => {
      active = false
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
