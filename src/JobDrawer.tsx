import { useEffect, useRef } from 'react'
import type { Job } from './content'
import { CompanyLogo } from './CompanyLogo'

type Props = {
  job: Job | null
  open: boolean
  onClose: () => void
}

export function JobDrawer({ job, open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('drawer-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('drawer-open')
      previous?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <div className={open ? 'drawer is-open' : 'drawer'} aria-hidden={!open}>
      <div className="drawer__scrim" onClick={onClose} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title" inert={!open}>
        {job && (
          <>
            <header className="drawer__head">
              <CompanyLogo job={job} large />
              <div>
                <h2 id="drawer-title">{job.company}</h2>
                <p className="drawer__meta">
                  {job.location}
                  {job.note && ` · ${job.note}`}
                </p>
              </div>
              <button ref={closeRef} type="button" className="drawer__close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className="drawer__role">
              <h3>{job.role}</h3>
              <span>
                {job.start} – {job.end}
              </span>
            </div>
            <ul className="drawer__list">
              {job.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="tags drawer__tags">
              {job.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </>
        )}
      </aside>
    </div>
  )
}
