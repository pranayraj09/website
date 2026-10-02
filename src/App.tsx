import { useCallback, useState } from 'react'
import { about, certifications, earlierProjects, education, experience, featuredProjects, profile, skills } from './content'
import type { Job, Project } from './content'
import { CompanyLogo } from './CompanyLogo'
import { JobDrawer } from './JobDrawer'
import { useReveal, useSmoothParallax } from './parallax'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <header className="section__head">
      <span className="section__ghost" data-speed="0.18" aria-hidden="true">
        {index}
      </span>
      <h2 className="reveal">{title}</h2>
    </header>
  )
}

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <article className={featured ? 'card card--featured reveal' : 'card reveal'}>
      <header>
        <h3>{project.name}</h3>
        <p className="card__tagline">{project.tagline}</p>
      </header>
      <p className="card__body">{project.description}</p>
      <ul className="tags">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      {project.links && (
        <div className="card__links">
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

export default function App() {
  useSmoothParallax()
  useReveal()
  const year = new Date().getFullYear()
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openJob = (job: Job) => {
    setActiveJob(job)
    setDrawerOpen(true)
  }
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <span className="orb orb--one" data-speed="0.35" />
        <span className="orb orb--two" data-speed="0.55" />
        <span className="orb orb--three" data-speed="0.25" />
        <span className="orb orb--four" data-speed="0.45" />
      </div>

      <nav className="nav">
        <div className="container nav__inner">
          <a href="#top" className="nav__brand">
            PK
          </a>
          <ul className="nav__links">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main id="top">
        <section className="hero">
          <span className="ring ring--large" data-speed="0.4" aria-hidden="true" />
          <span className="ring ring--small" data-speed="-0.15" aria-hidden="true" />
          <span className="dot-grid" data-speed="0.28" aria-hidden="true" />
          <div className="container hero__content" data-speed="0.3">
            <p className="eyebrow">Hi, I'm</p>
            <h1>{profile.name}</h1>
            <p className="hero__title">
              {profile.title} · {profile.location}
            </p>
            <p className="hero__summary">{profile.summary}</p>
            <div className="hero__actions">
              <a className="button button--primary" href={`mailto:${profile.email}`}>
                Get in touch
              </a>
              <a className="button" href={profile.resume} target="_blank" rel="noreferrer">
                Resume
              </a>
              {profile.links.map((link) => (
                <a key={link.href} className="button" href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <a href="#about" className="hero__scroll" aria-label="Scroll to about">
            <span />
          </a>
        </section>

        <section id="about" className="section container">
          <SectionTitle index="01" title="About" />
          <div className="prose card reveal">
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="experience" className="section container">
          <SectionTitle index="02" title="Experience" />
          <ol className="timeline timeline--jobs">
            {experience.map((job) => (
              <li key={`${job.company}-${job.start}`} className="reveal">
                <button type="button" className="card job" onClick={() => openJob(job)} aria-haspopup="dialog">
                  <CompanyLogo job={job} />
                  <span className="job__text">
                    <span className="timeline__years">
                      {job.start} – {job.end}
                    </span>
                    <span className="job__role">{job.role}</span>
                    <span className="timeline__org">
                      {job.company} · {job.location}
                      {job.note && ` · ${job.note}`}
                    </span>
                    <span className="timeline__summary">{job.summary}</span>
                  </span>
                  <span className="job__chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="sr-only">View duties at {job.company}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="section container">
          <SectionTitle index="03" title="Projects" />
          <div className="grid grid--featured">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} featured />
            ))}
          </div>
          <h3 className="subheading reveal">Earlier work</h3>
          <div className="grid">
            {earlierProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

        <section id="skills" className="section container">
          <SectionTitle index="04" title="Skills" />
          <div className="skills">
            {skills.map((group) => (
              <div key={group.group} className="card reveal">
                <h3>{group.group}</h3>
                <ul className="tags">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="education" className="section container">
          <SectionTitle index="05" title="Education" />
          <ol className="timeline">
            {education.map((entry) => (
              <li key={entry.school} className="card reveal">
                <span className="timeline__years">{entry.years}</span>
                <div>
                  <h3>{entry.degree}</h3>
                  <p className="timeline__org">
                    {entry.school} · {entry.location}
                  </p>
                  {entry.note && <p className="timeline__summary">{entry.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="certifications" className="section container">
          <SectionTitle index="06" title="Certifications" />
          <div className="grid grid--featured">
            {certifications.map((cert) => (
              <div key={cert.name} className="card cert reveal">
                <span className="timeline__years">{cert.year}</span>
                <h3>{cert.name}</h3>
                <p className="timeline__org">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section container">
          <div className="contact card reveal">
            <h2>Let's talk</h2>
            <p>Whether it's a role, a collaboration, or just an idea you want to bounce around, my inbox is open.</p>
            <a className="button button--primary button--large" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <span>
          © {year} {profile.name}
        </span>
        <span className="footer__links">
          {profile.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </span>
      </footer>

      <JobDrawer job={activeJob} open={drawerOpen} onClose={closeDrawer} />
    </>
  )
}
