export function jumpToSection(id: string) {
  const section = document.getElementById(id)
  if (!section) return
  window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY, behavior: 'instant' })
}
