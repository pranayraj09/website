import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

type Draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => void

export const FONT = "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif"

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fill()
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let cursor = y
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursor)
      line = word
      cursor += lineHeight
    } else {
      line = next
    }
  }
  if (line) ctx.fillText(line, x, cursor)
}

export function useCanvasTexture(width: number, height: number, draw: Draw, image?: string) {
  const { texture, canvas } = useMemo(() => {
    const el = document.createElement('canvas')
    el.width = width
    el.height = height
    const tex = new THREE.CanvasTexture(el)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return { texture: tex, canvas: el }
  }, [width, height])

  useEffect(() => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let cancelled = false
    const render = (img?: HTMLImageElement) => {
      if (cancelled) return
      ctx.clearRect(0, 0, width, height)
      draw(ctx, width, height)
      if (img) {
        const pad = Math.min(width, height) * 0.16
        const scale = Math.min((width - pad * 2) / img.naturalWidth, (height - pad * 2) / img.naturalHeight)
        const w = img.naturalWidth * scale
        const h = img.naturalHeight * scale
        ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h)
      }
      texture.needsUpdate = true
    }
    document.fonts.ready.then(() => {
      if (!image) return render()
      const img = new Image()
      img.onload = () => render(img)
      img.onerror = () => render()
      img.src = image
    })
    return () => {
      cancelled = true
    }
  }, [canvas, texture, draw, image, width, height])

  useEffect(() => () => texture.dispose(), [texture])

  return texture
}
