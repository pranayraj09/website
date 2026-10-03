import { about, certifications, earlierProjects, education, experience, featuredProjects, profile, skills, stats } from './content'
import type { Job, Project } from './content'
import { CompanyLogo } from './CompanyLogo'

export function SectionTitle({ index, title }: { index: string; title: string }) {
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

export function HeroIntro({ hint }: { hint?: string }) {
  return (
    <>
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
      {hint && (
        <p className="hero__hint">
          <span aria-hidden="true" /> {hint}
        </p>
      )}
    </>
  )
}

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <span key={copy}>
            {skills.flatMap((group) => group.items).map((item) => (
              <span key={`${copy}-${item}`} className="marquee__item">
                {item}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

export function AboutBody() {
  return (
    <div className="bento">
      <div className="prose card reveal">
        {about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {stats.map((stat) => (
        <div key={stat.label} className="card stat reveal">
          <span className="stat__value">{stat.value}</span>
          <span className="stat__label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ExperienceBody({ onOpenJob }: { onOpenJob: (job: Job) => void }) {
  return (
    <ol className="timeline timeline--jobs">
      {experience.map((job) => (
        <li key={`${job.company}-${job.start}`} className="reveal">
          <button type="button" className="card job" onClick={() => onOpenJob(job)} aria-haspopup="dialog">
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
  )
}

export function ProjectsBody() {
  return (
    <>
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
    </>
  )
}

export function SkillsBody() {
  return (
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
  )
}

export function EducationBody() {
  return (
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
  )
}

export function CertificationsBody() {
  return (
    <div className="grid grid--featured">
      {certifications.map((cert) => (
        <div key={cert.name} className="card cert reveal">
          <span className="timeline__years">{cert.year}</span>
          <h3>{cert.name}</h3>
          <p className="timeline__org">{cert.issuer}</p>
        </div>
      ))}
    </div>
  )
}

export function ResumeBody({ onOpenResume }: { onOpenResume: () => void }) {
  return (
    <div className="resume reveal">
      <p className="panel__text">My experience, projects, skills and education, all in one PDF.</p>
      <div className="resume__actions">
        <button type="button" className="button button--primary" onClick={onOpenResume} aria-haspopup="dialog">
          View resume
        </button>
        <a className="button" href={profile.resume} download>
          Download PDF
        </a>
      </div>
    </div>
  )
}

export function ContactBody() {
  return (
    <div className="contact card reveal">
      <h2>Let's talk</h2>
      <p>Whether it's a role, a collaboration, or just an idea you want to bounce around, my inbox is open.</p>
      <a className="button button--primary button--large" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
    </div>
  )
}
