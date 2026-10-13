import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'theme'

function timeTheme(): Theme {
  const hour = new Date().getHours()
  return hour >= 19 || hour < 6 ? 'dark' : 'light'
}

function chosenTheme(): Theme | null {
  const saved = sessionStorage.getItem(KEY)
  return saved === 'light' || saved === 'dark' ? saved : null
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => chosenTheme() ?? timeTheme())

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!chosenTheme()) setTheme(timeTheme())
    }, 60_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.room = theme
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      sessionStorage.setItem(KEY, next)
      return next
    })
  }, [])

  return [theme, toggle]
}
