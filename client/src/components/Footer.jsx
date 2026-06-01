export default function Footer({ profile }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <a href="#top" className="brand">
            <span className="mark">SS</span>
            <span className="who">Sushant Sapkota<small>Building intelligent systems.</small></span>
          </a>
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>Copyright 2026 Sushant Sapkota. Designed and built with intent.</span>
          <div className="footer-social">
            <a href="#" aria-label="GitHub">GH</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href={`mailto:${profile.email}`} aria-label="Email">EM</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
