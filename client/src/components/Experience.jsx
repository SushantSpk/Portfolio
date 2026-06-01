const items = [
  ['2024 - Present', 'Founder & Lead Engineer', 'Independent Studio', 'Designing and building AI automation systems and full-stack products for companies.'],
  ['2022 - 2024', 'Full-Stack Developer', 'Product and Platform Teams', 'Shipped inventory, event, and management platforms used in production.'],
  ['2021 - 2022', 'Automation Engineer', 'Operations and Integrations', 'Built automation pipelines connecting business tools and reducing manual work.'],
  ['2020 - 2021', 'Developer and Video Editor', 'Freelance', 'Built web apps while producing product videos that made tools easy to understand.'],
]

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="wrap exp-grid">
        <aside className="exp-aside reveal">
          <span className="eyebrow">Experience</span>
          <h2>A track record of<br />shipping and scaling.</h2>
          <p>Half a decade of building products end-to-end as a founder, engineer, and hands-on problem solver.</p>
          <a href="#contact" className="btn btn-ghost exp-dl">Download resume</a>
        </aside>
        <div className="timeline">
          {items.map(([year, role, company, copy], index) => (
            <div className="tl-item reveal" data-d={String(index + 1)} key={role}>
              <span className="tl-node" />
              <div className="tl-yr">{year}</div>
              <h3>{role}</h3>
              <div className="tl-co">{company}</div>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
