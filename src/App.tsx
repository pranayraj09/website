import { useCallback, useState } from 'react'
import { profile } from './content'
import type { Job } from './content'
import { JobDrawer } from './JobDrawer'
import { useReveal, useSmoothParallax } from './parallax'
import { sections } from './sectionList'
import { HeroIntro, Marquee, SectionTitle } from './sections'
import { Tour } from './Tour'
import { use3D } from './use3D'

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export default function App() {
  const has3D = use3D()
  useSmoothParallax(has3D)
  useReveal(has3D)
  const year = new Date().getFullYear()
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openJob = useCallback((job: Job) => {
    setActiveJob(job)
    setDrawerOpen(true)
  }, [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const footer = (
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
  )

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
            {navLinks.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main id="top">
        {has3D ? (
          <Tour onOpenJob={openJob} focusJob={drawerOpen ? activeJob : null} footer={footer} />
        ) : (
          <>
            <section className="hero">
              <span className="ring ring--large" data-speed="0.4" aria-hidden="true" />
              <span className="ring ring--small" data-speed="-0.15" aria-hidden="true" />
              <span className="dot-grid" data-speed="0.28" aria-hidden="true" />
              <div className="container hero__content" data-speed="0.3">
                <HeroIntro />
              </div>
              <a href="#about" className="hero__scroll" aria-label="Scroll to about">
                <span />
              </a>
            </section>
            <Marquee />
            {sections.map((section, i) => (
              <section key={section.id} id={section.id} className="section container">
                {section.title && <SectionTitle index={String(i + 1).padStart(2, '0')} title={section.title} />}
                {section.render(openJob)}
              </section>
            ))}
          </>
        )}
      </main>

      {!has3D && footer}

      <JobDrawer job={activeJob} open={drawerOpen} onClose={closeDrawer} />
    </>
  )
}
