export default function Projects({ projects }) {
  const featured = projects.find((project) => project.is_featured) || projects[0]
  const rest = projects.filter((project) => project.id !== featured?.id)

  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="proj-head reveal">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Selected Work</span>
            <h2>Systems I&apos;ve designed,<br />built, and shipped.</h2>
          </div>
          <a href="#contact" className="btn btn-ghost">Start a project</a>
        </div>
        <div className="proj-grid">
          {featured && <ProjectCard project={featured} featured />}
          {rest.map((project, index) => (
            <ProjectCard project={project} key={project.id} delay={(index % 2) + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, featured = false, delay = 1 }) {
  const tags = Array.isArray(project.tech_stack) ? project.tech_stack : []

  return (
    <article className={`proj ${featured ? 'feat ' : ''}glass reveal`} data-d={String(delay)}>
      {featured && <span className="badge-feat">Featured</span>}
      <div className="shot">
        <div className="shot-fill">
          {project.image_url && <img className="shot-img" src={project.image_url} alt={`${project.title} screenshot`} loading="lazy" decoding="async" />}
          <span className="shot-tag">{project.category || 'Project'}</span>
        </div>
      </div>
      <div className="meta">
        <div className="meta-top"><span className="idx">{String(project.display_order || 1).padStart(2, '0')} · {project.category || 'Work'}</span></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="proj-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <a href={project.live_url || '#contact'} className="proj-link">View Case Study</a>
      </div>
    </article>
  )
}
