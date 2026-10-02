import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { basementSpots, type Job } from './content'
import { useReveal } from './parallax'
import { basementStops, stops } from './room/stops'
import { sections } from './sectionList'
import { HeroIntro, Marquee } from './sections'

const Room = lazy(() => import('./room/Room'))

export function Tour({
  onOpenJob,
  focusJob,
  footer,
}: {
  onOpenJob: (job: Job) => void
  focusJob: Job | null
  footer: ReactNode
}) {
  const [active, setActive] = useState(0)
  const [place, setPlace] = useState<'room' | 'basement'>('room')
  const [phase, setPhase] = useState<'idle' | 'descending' | 'switching'>('idle')
  const [dark, setDark] = useState(false)
  const count = useRef(stops.length)
  const busy = useRef(false)
  const pendingStop = useRef<number | null>(null)
  const timers = useRef<number[]>([])
  const list = place === 'room' ? stops : basementStops
  const inBasement = place === 'basement'
  useReveal(place)

  useLayoutEffect(() => {
    count.current = list.length
    document.documentElement.classList.toggle('basement-mode', place === 'basement')
    if (pendingStop.current === null) return
    window.scrollTo({ top: pendingStop.current * window.innerHeight, behavior: 'instant' })
    pendingStop.current = null
  }, [place, list.length])

  useEffect(() => {
    busy.current = phase !== 'idle'
    document.documentElement.classList.toggle('tour-transit', phase !== 'idle')
  }, [phase])

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      document.documentElement.classList.remove('basement-mode', 'tour-transit')
    }
  }, [])

  const later = (ms: number, run: () => void) => {
    timers.current.push(window.setTimeout(run, ms))
  }

  const enterBasement = () => {
    if (phase !== 'idle') return
    setPhase('descending')
    later(3100, () => setDark(true))
    later(3950, () => {
      pendingStop.current = 0
      setPlace('basement')
      setPhase('switching')
    })
    later(4300, () => setDark(false))
    later(5300, () => setPhase('idle'))
  }

  const exitBasement = () => {
    if (phase !== 'idle') return
    setPhase('switching')
    setDark(true)
    later(700, () => {
      pendingStop.current = 0
      setPlace('room')
    })
    later(1000, () => setDark(false))
    later(2300, () => setPhase('idle'))
  }

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('tour-mode')
    const onScroll = () => {
      const progress = window.scrollY / window.innerHeight
      setActive(Math.round(progress))
      root.classList.toggle('tour-zoomed', progress > 1.5)
    }
    let locked = false
    let lastInput = 0
    let target = 0
    let frame = 0
    let fallback = 0

    const unlock = () => {
      locked = false
      cancelAnimationFrame(frame)
      clearTimeout(fallback)
    }
    const waitForSettle = () => {
      const settled = Math.abs(window.scrollY - target) < 2 && performance.now() - lastInput > 220
      if (settled) unlock()
      else frame = requestAnimationFrame(waitForSettle)
    }
    const go = (direction: number) => {
      const current = Math.round(window.scrollY / window.innerHeight)
      const next = Math.min(count.current - 1, Math.max(0, current + direction))
      if (next === current) return
      locked = true
      target = next * window.innerHeight
      window.scrollTo({ top: target, behavior: 'smooth' })
      frame = requestAnimationFrame(waitForSettle)
      fallback = window.setTimeout(unlock, 1800)
    }
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || root.classList.contains('drawer-open')) return
      event.preventDefault()
      if (busy.current) return
      lastInput = performance.now()
      if (!locked && Math.abs(event.deltaY) >= 4) go(Math.sign(event.deltaY))
    }
    const onKey = (event: KeyboardEvent) => {
      if (root.classList.contains('drawer-open') || event.altKey || event.metaKey || event.ctrlKey) return
      const el = event.target instanceof Element ? event.target : null
      if (el?.closest('input, textarea, select, [contenteditable]')) return
      const forward = event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)
      const back = event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)
      if (!forward && !back) return
      if (event.key === ' ' && el?.closest('a, button')) return
      event.preventDefault()
      if (busy.current) return
      lastInput = performance.now()
      if (!locked) go(forward ? 1 : -1)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      unlock()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      root.classList.remove('tour-mode', 'tour-zoomed')
    }
  }, [])

  const showExit = inBasement || active > 0

  return (
    <>
      <button
        type="button"
        className={showExit ? 'tour-exit is-visible' : 'tour-exit'}
        onClick={inBasement ? exitBasement : () => window.scrollTo({ top: 0, behavior: 'smooth' })}
        tabIndex={showExit ? 0 : -1}
        aria-hidden={!showExit}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          {inBasement ? (
            <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          )}
        </svg>
        {inBasement ? 'Exit room' : 'Exit'}
      </button>
      <div className={dark ? 'tour-fade is-dark' : 'tour-fade'} aria-hidden="true" />
      <div className="tour__stage" aria-hidden="true">
        <Suspense fallback={null}>
          <Room
            activeId={list[active]?.id}
            focusJob={focusJob}
            onOpenJob={onOpenJob}
            place={place}
            descending={phase === 'descending'}
            returning={place === 'room' && phase === 'switching'}
          />
        </Suspense>
      </div>
      {inBasement
        ? basementStops.map((stop, index) => {
            const className = `stop${stop.side ? ` stop--${stop.side}` : ''}${index === active ? ' is-active' : ''}`
            const spot = basementSpots.find((s) => s.id === stop.id)
            return (
              <section key={stop.id} id={stop.id} className={className}>
                {spot ? (
                  <div className="container stop__inner">
                    <div className="panel">
                      <h2 className="panel__title">{spot.title}</h2>
                      {spot.text && <p className="panel__text">{spot.text}</p>}
                    </div>
                  </div>
                ) : (
                  <p className="stop__caption">
                    <span aria-hidden="true" /> Welcome to the basement. Scroll to look around.
                  </p>
                )}
              </section>
            )
          })
        : stops.map((stop, index) => {
            const className = `stop${stop.side ? ` stop--${stop.side}` : ''}${index === active ? ' is-active' : ''}`
            if (stop.id === 'home') {
              return (
                <section key={stop.id} id={stop.id} className={`${className} stop--home`}>
                  <div className="container stop__intro">
                    <HeroIntro hint="Scroll to step inside, or click anything in the room" />
                  </div>
                  <Marquee />
                </section>
              )
            }
            const section = sections.find((s) => s.id === stop.id)
            if (!section) {
              return (
                <section key={stop.id} id={stop.id} className={className}>
                  <p className="stop__caption">
                    <span aria-hidden="true" /> Welcome in. Keep scrolling for the tour.
                  </p>
                </section>
              )
            }
            return (
              <section key={stop.id} id={stop.id} className={className}>
                <div className="container stop__inner">
                  <div className="panel">
                    {section.title && <h2 className="panel__title">{section.title}</h2>}
                    {section.render(onOpenJob)}
                  </div>
                </div>
                {stop.id === 'contact' && (
                  <>
                    <button type="button" className="know-more" onClick={enterBasement}>
                      <span className="know-more__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <path d="M3 6h5v4h4v4h4v4h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="know-more__text">
                        <b>Know more</b>
                        <span>There's more to me than code. Head down to the basement.</span>
                      </span>
                      <span className="know-more__cta">
                        Take the stairs
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    {footer}
                  </>
                )}
              </section>
            )
          })}
    </>
  )
}
