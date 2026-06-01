import { useEffect } from 'react'

export default function usePortfolioEffects() {
  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanup = []

    const themeToggle = document.getElementById('themeToggle')
    const stored = localStorage.getItem('ss-theme')
    if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored)

    if (themeToggle) {
      const onTheme = () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
        root.setAttribute('data-theme', next)
        localStorage.setItem('ss-theme', next)
      }
      themeToggle.addEventListener('click', onTheme)
      cleanup.push(() => themeToggle.removeEventListener('click', onTheme))
    }

    const nav = document.getElementById('nav')
    const onScroll = () => {
      if (!nav) return
      nav.classList.toggle('scrolled', window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    cleanup.push(() => window.removeEventListener('scroll', onScroll))

    const burger = document.getElementById('burger')
    const mobileMenu = document.getElementById('mobileMenu')
    if (nav && burger && mobileMenu) {
      const closeMenu = () => {
        nav.classList.remove('menu-open')
        burger.setAttribute('aria-expanded', 'false')
        mobileMenu.setAttribute('aria-hidden', 'true')
      }
      const onBurger = () => {
        const open = nav.classList.toggle('menu-open')
        burger.setAttribute('aria-expanded', String(open))
        mobileMenu.setAttribute('aria-hidden', String(!open))
      }
      const onDoc = (event) => {
        if (!nav.contains(event.target) && nav.classList.contains('menu-open')) closeMenu()
      }
      burger.addEventListener('click', onBurger)
      document.addEventListener('click', onDoc)
      mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
      cleanup.push(() => {
        burger.removeEventListener('click', onBurger)
        document.removeEventListener('click', onDoc)
        mobileMenu.querySelectorAll('a').forEach((link) => link.removeEventListener('click', closeMenu))
      })
    }

    const reveals = document.querySelectorAll('.reveal')
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'))
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in')
              io.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
      )
      reveals.forEach((el) => io.observe(el))
      cleanup.push(() => io.disconnect())
    }

    const glow = document.getElementById('cursorGlow')
    let glowRaf = 0
    if (glow && !reduce && window.matchMedia('(pointer: fine)').matches) {
      let gx = window.innerWidth / 2
      let gy = window.innerHeight / 2
      let cx = gx
      let cy = gy
      let shown = false
      const onMouse = (event) => {
        gx = event.clientX
        gy = event.clientY
        if (!shown) {
          glow.style.opacity = '1'
          shown = true
        }
      }
      const loop = () => {
        cx += (gx - cx) * 0.11
        cy += (gy - cy) * 0.11
        glow.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px) translate(-50%,-50%)`
        glowRaf = requestAnimationFrame(loop)
      }
      window.addEventListener('mousemove', onMouse)
      loop()
      cleanup.push(() => {
        window.removeEventListener('mousemove', onMouse)
        cancelAnimationFrame(glowRaf)
      })
    }

    return () => cleanup.forEach((fn) => fn())
  }, [])
}
