import { useEffect } from 'react'

type Layer = { el: HTMLElement; speed: number; top: number; height: number }

const EASE = 0.085

function measure(): Layer[] {
  const scrollY = window.scrollY
  return Array.from(document.querySelectorAll<HTMLElement>('[data-speed]')).map((el) => {
    const prev = el.style.transform
    el.style.transform = ''
    const rect = el.getBoundingClientRect()
    el.style.transform = prev
    return { el, speed: Number(el.dataset.speed), top: rect.top + scrollY, height: rect.height }
  })
}

export function useSmoothParallax(key?: unknown) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return

    let layers = measure()
    let current = window.scrollY
    let frame = 0

    const render = () => {
      const target = window.scrollY
      current += (target - current) * EASE
      if (Math.abs(target - current) < 0.05) current = target
      const viewportCenter = current + window.innerHeight / 2
      for (const layer of layers) {
        const offset = (viewportCenter - layer.top - layer.height / 2) * layer.speed
        layer.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
      }
      frame = current === target ? 0 : requestAnimationFrame(render)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    const onResize = () => {
      layers = measure()
      onScroll()
    }

    frame = requestAnimationFrame(render)
    document.fonts.ready.then(onResize)
    window.addEventListener('load', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
    }
  }, [key])
}

export function useReveal(key?: unknown) {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [key])
}
