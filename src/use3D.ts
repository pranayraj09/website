import { useEffect, useState } from 'react'

const QUERY = '(min-width: 900px) and (prefers-reduced-motion: no-preference)'

function hasWebGL() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}

export function use3D() {
  const [enabled, setEnabled] = useState(() => window.matchMedia(QUERY).matches && hasWebGL())
  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = () => setEnabled(media.matches && hasWebGL())
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return enabled
}
