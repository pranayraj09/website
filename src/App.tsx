import { about, earlierProjects, education, experience, featuredProjects, profile, skills } from './content'
import type { Project } from './content'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <article className={featured ? 'card card--featured' : 'card'}>
      <header className="card__header">
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
  const year = new Date().getFullYear()

  return (
    <>
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
        <section className="hero container">
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
        </section>

        <section id="about" className="section container">
          <h2>About</h2>
          <div className="prose">
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="experience" className="section container">
          <h2>Experience</h2>
          <ol className="timeline">
            {experience.map((job) => (
              <li key={`${job.company}-${job.start}`}>
                <span className="timeline__years">
                  {job.start} – {job.end}
                </span>
                <div>
                  <h3>{job.role}</h3>
                  <p>
                    {job.company} · {job.location}
                  </p>
                  {job.summary && <p className="timeline__summary">{job.summary}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="section container">
          <h2>Projects</h2>
          <div className="grid grid--featured">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} featured />
            ))}
          </div>
          <h3 className="subheading">Earlier work</h3>
          <div className="grid">
            {earlierProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

        <section id="skills" className="section container">
          <h2>Skills</h2>
          <div className="skills">
            {skills.map((group) => (
              <div key={group.group} className="skills__group">
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
          <h2>Education</h2>
          <ol className="timeline">
            {education.map((entry) => (
              <li key={entry.school}>
                <span className="timeline__years">{entry.years}</span>
                <div>
                  <h3>{entry.degree}</h3>
                  <p>
                    {entry.school} · {entry.location}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="section container contact">
          <h2>Let's talk</h2>
          <p>Whether it's a role, a collaboration, or just an idea you want to bounce around, my inbox is open.</p>
          <a className="button button--primary button--large" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
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
    </>
  )
}
