import { Fragment } from 'react'

const steps = [
  ['Understand the Problem', 'Map the workflows, bottlenecks, and what a successful result should look like.'],
  ['Design the System', 'Plan architecture, data, user flows, and integration points before building.'],
  ['Build and Integrate', 'Ship modular code that connects cleanly with existing tools and workflows.'],
  ['Test, Improve, and Ship', 'Test in real conditions, gather feedback, and harden the system for production.'],
]

export default function Process() {
  return (
    <section className="section" id="process">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Process</span>
          <h2>How I <span className="grad-text">approach every build</span>.</h2>
          <p>A clear, repeatable method that reduces risk and ships better systems faster.</p>
        </div>
        <div className="process-track">
          {steps.map(([title, copy], index) => (
            <Fragment key={title}>
              <div className="process-step glass reveal" data-d={String(index + 1)}>
                <div className="ps-num">{String(index + 1).padStart(2, '0')}</div>
                <div className="ps-icon">{String(index + 1).padStart(2, '0')}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              {index < steps.length - 1 && <div className="process-conn"><span /></div>}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
