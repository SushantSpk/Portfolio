export default function Navbar() {
  const links = [
    ['#about', 'About'],
    ['#skills', 'Skills'],
    ['#work', 'Work'],
    ['#experience', 'Experience'],
    ['#services', 'Services'],
    ['#contact', 'Contact'],
  ]

  return (
    <header className="nav" id="nav">
      <div className="nav-pill">
        <div className="nav-inner">
          <a href="#top" className="brand" aria-label="Sushant Sapkota home">
            <span className="mark">SS</span>
            <span className="who">
              Sushant Sapkota<small>AI &amp; Automation Engineer</small>
            </span>
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            {links.map(([href, label]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <button className="theme-toggle" id="themeToggle" aria-label="Toggle color theme" title="Toggle theme">
              <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
              <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
              </svg>
            </button>
            <a href="#contact" className="btn btn-primary nav-cta">
              Let&apos;s talk
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <button className="nav-burger" id="burger" aria-label="Open menu" aria-expanded="false">
              <span />
            </button>
          </div>
        </div>
        <div className="mobile-menu" id="mobileMenu" aria-hidden="true">
          {links.map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary mm-cta">
            Let&apos;s talk
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
