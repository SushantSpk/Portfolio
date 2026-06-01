import { fallbackProjects } from '../data/fallbackData.js'

export default function Projects({ projects }) {
  const orderedProjects = [...projects].sort((a, b) => {
    const orderA = Number(a.display_order) || 0
    const orderB = Number(b.display_order) || 0
    return orderA - orderB
  })
  const featured = orderedProjects.find((project) => project.is_featured) || orderedProjects[0]
  const rest = orderedProjects.filter((project) => project !== featured)

  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="proj-head reveal">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Selected Work</span>
            <h2>Systems I&apos;ve designed,<br />built, and shipped.</h2>
          </div>
          <a href="#contact" className="btn btn-ghost">
            Start a project
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
        <div className="proj-grid">
          {featured && <ProjectCard project={featured} featured delay={1} />}
          {rest.map((project, index) => (
            <ProjectCard project={project} key={project.id || project.title} delay={(index % 2) + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, featured = false, delay = 1 }) {
  const defaults = findFallbackProject(project)
  const tagSource = project.tech_stack?.length ? project.tech_stack : defaults?.tech_stack
  const tags = Array.isArray(tagSource)
    ? tagSource
    : String(tagSource || '').split(',').map((tag) => tag.trim()).filter(Boolean)
  const order = String(project.display_order || defaults?.display_order || delay || 1).padStart(2, '0')
  const category = project.category || defaults?.category || 'Work'
  const shotLabel = project.shot_label || defaults?.shot_label || category
  const caseStudyUrl = project.case_study_url || project.live_url || defaults?.case_study_url || '#contact'
  const hasNewProjectFields = Object.prototype.hasOwnProperty.call(project, 'shot_label') || Object.prototype.hasOwnProperty.call(project, 'case_study_url')
  const description = hasNewProjectFields
    ? project.description || defaults?.description || ''
    : defaults?.description || project.description || ''
  const isExternalLink = /^https?:\/\//i.test(caseStudyUrl)

  return (
    <article className={`proj ${featured ? 'feat ' : ''}glass reveal`} data-d={String(delay)}>
      {featured && <span className="badge-feat">Featured</span>}
      <div className="shot">
        <div className="shot-fill">
          {project.image_url && (
            <img
              className="shot-img"
              src={project.image_url}
              alt={`${project.title} screenshot`}
              loading="lazy"
              decoding="async"
            />
          )}
          <span className="shot-tag">{shotLabel}</span>
        </div>
      </div>
      <div className="meta">
        <div className="meta-top">
          <span className="idx">{order} &mdash; {category}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{description}</p>
        <div className="proj-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <a href={caseStudyUrl} className="proj-link" target={isExternalLink ? '_blank' : undefined} rel={isExternalLink ? 'noreferrer' : undefined}>
          View Case Study
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
      </div>
    </article>
  )
}

function findFallbackProject(project) {
  return fallbackProjects.find((fallback) => fallback.title === project.title || fallback.id === project.id)
}
