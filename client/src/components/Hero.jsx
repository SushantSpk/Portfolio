export default function Hero({ profile }) {
  return (
    <section className="hero">
      <div className="aurora"><span className="a1" /><span className="a2" /><span className="a3" /></div>
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <span className="hero-status reveal"><span className="dot" /> Available for select projects &middot; 2026</span>
          <h1 className="reveal" data-d="1">I build <span className="grad-text">intelligent systems</span> that help businesses work smarter.</h1>
          <p className="hero-sub reveal" data-d="2">{profile.bio}</p>
          <div className="hero-roles reveal" data-d="2">
            <span className="role">AI &amp; Automation</span>
            <span className="role">Full-Stack Dev</span>
            <span className="role">Workflow Systems</span>
            <span className="role">Product Design</span>
          </div>
          <div className="hero-cta reveal" data-d="3">
            <a href="#work" className="btn btn-primary">View My Work</a>
            <a href="#contact" className="btn btn-ghost">Let&apos;s Build Together</a>
          </div>
          <div className="hero-stats reveal" data-d="4">
            <div className="stat"><div className="n"><b>20+</b></div><div className="l">Systems shipped</div></div>
            <div className="stat"><div className="n"><b>5</b> <span className="unit">yrs</span></div><div className="l">Building products</div></div>
            <div className="stat"><div className="n"><b>40k+</b></div><div className="l">Hours saved</div></div>
          </div>
        </div>

        <div className="hero-visual" id="heroVisual">
          <div className="float fp-id" data-depth="0.3" id="heroCard">
            <div className="id-header">
              <div className="id-avatar">SS</div>
              <div className="id-meta">
                <div className="id-name">{profile.full_name}</div>
                <div className="id-role">{profile.role}</div>
              </div>
            </div>
            <div className="id-rule" />
            <div className="id-chips">
              {['AI Automation', 'Full-Stack Dev', 'Workflow Systems', 'React', 'Python', 'n8n', 'APIs', 'Product Design'].map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <div className="id-rule" />
            <div className="id-footer">
              <div className="id-status"><span className="id-dot" /><span className="id-status-text">status: building intelligent systems</span></div>
              <div className="id-chart">{[38, 55, 44, 72, 60, 88, 100].map((height) => <i key={height} style={{ height: `${height}%` }} />)}</div>
            </div>
          </div>
          <FloatingCard className="fp-focus" title="Current Focus" items={['AI workflow systems', 'Business process automation', 'Scalable web platforms']} />
          <FloatingCard className="fp-style" title="Work Style" items={['Think clearly', 'Build fast', 'Improve continuously']} />
          <FloatingCard className="fp-impact" title="Project Impact" items={['Less manual work', 'Faster operations', 'Cleaner systems']} />
          <div className="float fp-card fp-stack glass" data-depth="1.9">
            <div className="fpc-label">Core Stack</div>
            <div className="fpc-chips"><span>React</span><span>Python</span><span>n8n</span><span>APIs</span></div>
          </div>
          <div className="float fp-card fp-avail glass" data-depth="2.3">
            <span className="avail-dot" />
            <div className="avail-text"><strong>Open for projects</strong><span>Remote friendly &middot; 2026</span></div>
          </div>
        </div>
      </div>
      <div className="scroll-cue"><span className="scroll-bar" />Scroll</div>
    </section>
  )
}

function FloatingCard({ className, title, items }) {
  return (
    <div className={`float fp-card ${className} glass`} data-depth="1.6">
      <div className="fpc-label">{title}</div>
      <ul className="fpc-list">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
