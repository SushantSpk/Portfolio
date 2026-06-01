const skills = [
  ['AI & Automation', 'Agentic workflows, LLM pipelines, and integrations that run operations on autopilot.', ['LLM Agents', 'n8n', 'RAG', 'OpenAI']],
  ['Full-Stack Dev', 'End-to-end products with typed APIs, resilient databases, and interfaces that feel effortless.', ['React', 'Node', 'Python', 'Postgres']],
  ['Systems Thinking', 'Designing scalable infrastructure built to grow with the business, not against it.', ['Docker', 'CI/CD', 'AWS', 'Architecture']],
  ['Workflow Design', 'Mapping business processes into efficient digital flows that reduce friction.', ['Process Maps', 'n8n', 'Make', 'Zapier']],
  ['API Integration', 'Connecting services, platforms, and data sources into reliable pipelines.', ['REST', 'GraphQL', 'Webhooks', 'SDKs']],
  ['Product Design', 'Clean, purposeful interfaces that convert intent into action.', ['Figma', 'UX', 'Prototyping']],
  ['Video Editing', 'Sharp product films and edits that make complex systems easy to understand.', ['Premiere', 'After Effects']],
  ['Business Automation', 'Replacing manual bottlenecks with dependable self-running systems.', ['CRM', 'ERP', 'Reporting']],
]

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Capabilities</span>
          <h2>A full toolkit for <span className="grad-text">building and automating</span>.</h2>
          <p>Eight disciplines that compound from system architecture to production code, under one roof.</p>
        </div>
        <div className="skills-grid">
          {skills.map(([title, copy, tags], index) => (
            <div className="skill-card glass reveal" data-d={String((index % 4) + 1)} key={title}>
              <div className="sk-icon">{String(index + 1).padStart(2, '0')}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <div className="sk-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="marquee reveal">
          <div className="marquee-track">
            {['TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'n8n', 'LLM Agents', 'Automation', 'System Design', 'REST APIs'].concat(['TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'n8n', 'LLM Agents', 'Automation', 'System Design', 'REST APIs']).map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
