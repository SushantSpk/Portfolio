export default function About({ profile }) {
  const facts = [
    ['Based in', profile.location || 'Kathmandu - Remote'],
    ['Focus', 'AI \u00b7 Automation \u00b7 Full-Stack'],
    ['Stack', 'TypeScript \u00b7 Python \u00b7 React'],
    ['Currently', 'Open to collaborations'],
  ]

  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <div className="about-l">
          <span className="eyebrow reveal">About</span>
          <h2 className="reveal" data-d="1">Builder at heart.<br />Systems by design.</h2>
          <p className="about-lead reveal" data-d="2">I find where work breaks down and engineer the system that fixes it.</p>
          <p className="about-body reveal" data-d="3">{profile.bio}</p>
          <div className="about-facts">
            {facts.map(([label, value], index) => (
              <div className="fact glass reveal" data-d={String((index % 4) + 1)} key={label}>
                <div className="fk">{label}</div>
                <div className="fv">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="about-photo glass reveal" data-d="2">
          <div className="photo-glow" />
          <div className="photo-fill">
            <img className="photo-img" src={profile.profile_image_url || '/assets/images/profile.png'} alt={`Portrait of ${profile.full_name}`} decoding="async" />
            <span className="photo-tag">{profile.full_name}</span>
          </div>
          <div className="photo-foot">
            <span className="photo-badge"><span className="pb-dot" /> Building &amp; shipping</span>
          </div>
        </div>
      </div>
    </section>
  )
}
