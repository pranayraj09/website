import { useEffect, useRef } from 'react'
import { profile } from './content'

type Props = {
  open: boolean
  onClose: () => void
}

export function ResumeModal({ open, onClose }: Props) {
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
    <div className={open ? 'resume-modal is-open' : 'resume-modal'} aria-hidden={!open}>
      <div className="resume-modal__scrim" onClick={onClose} />
      <div className="resume-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="resume-title" inert={!open}>
        <header className="resume-modal__head">
          <h2 id="resume-title">Resume</h2>
          <a className="button" href={profile.resume} download>
            Download
          </a>
          <button ref={closeRef} type="button" className="drawer__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        {open && <iframe className="resume-modal__pdf" src={`${profile.resume}#view=FitH`} title={`${profile.name} resume`} />}
      </div>
    </div>
  )
}
