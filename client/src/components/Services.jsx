const services = [
  ['AI Automation Systems', 'Replace repetitive operations with intelligent workflows that run themselves.', ['Agentic process automation', 'LLM and RAG integrations', 'Tool and API orchestration']],
  ['Full-Stack Web Development', 'Robust backends, polished frontends, and the integrations that hold them together.', ['Web apps and dashboards', 'APIs and databases', 'Auth, billing, and roles']],
  ['Workflow & Systems Consulting', 'Audit, design, and de-risk the fastest path to a system that scales.', ['Process analysis and mapping', 'Architecture planning', 'Reliability review']],
]

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Services</span>
          <h2>How I can <span className="grad-text">help your team</span>.</h2>
          <p>Engagements scoped to outcomes, whether you need a system built, automated, or rethought entirely.</p>
        </div>
        <div className="serv-grid">
          {services.map(([title, copy, bullets], index) => (
            <div className="serv glass reveal" data-d={String(index + 1)} key={title}>
              <div className="serv-icon">{String(index + 1).padStart(2, '0')}</div>
              <div className="serv-no">{String(index + 1).padStart(2, '0')}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <ul>{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
