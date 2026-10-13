import { useCallback, useMemo, useState } from 'react'
import { profile } from './content'
import type { Job } from './content'
import { JobDrawer } from './JobDrawer'
import { jumpToSection } from './jump'
import { ResumeModal } from './ResumeModal'
import { useReveal, useSmoothParallax } from './parallax'
import { sections } from './sectionList'
import { useTheme } from './theme'
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
  const [theme, toggleTheme] = useTheme()
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
  const [resumeOpen, setResumeOpen] = useState(false)
  const openResume = useCallback(() => setResumeOpen(true), [])
  const closeResume = useCallback(() => setResumeOpen(false), [])
  const actions = useMemo(() => ({ openJob, openResume }), [openJob, openResume])

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
          <div className="nav__end">
            <ul className="nav__links">
              {navLinks.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={
                      has3D
                        ? (event) => {
                            event.preventDefault()
                            jumpToSection(s.id)
                          }
                        : undefined
                    }
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            {has3D && (
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                    <path
                      d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z" fill="currentColor" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      <main id="top">
        {has3D ? (
          <Tour night={theme === 'dark'} actions={actions} focusJob={drawerOpen ? activeJob : null} resumeOpen={resumeOpen} footer={footer} />
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
                {section.render(actions)}
              </section>
            ))}
          </>
        )}
      </main>

      {!has3D && footer}

      <JobDrawer job={activeJob} open={drawerOpen} onClose={closeDrawer} />
      <ResumeModal open={resumeOpen} onClose={closeResume} />
    </>
  )
}
