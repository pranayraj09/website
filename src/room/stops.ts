export type Vec3 = [number, number, number]

export type Stop = {
  id: string
  side?: 'left' | 'right'
  camera: { pos: Vec3; look: Vec3; shift: number; lambda?: number; via?: Vec3 }
}

export const stops: Stop[] = [
  { id: 'home', camera: { pos: [11, 9, 11], look: [0, 1.5, 0], shift: 0.2 } },
  { id: 'room', camera: { pos: [8.6, 7, 8.6], look: [0, 1.4, 0], shift: 0 } },
  { id: 'about', side: 'right', camera: { pos: [6.2, 2.5, 6.5], look: [1.3, 1.35, 1.3], shift: -0.2 } },
  { id: 'experience', side: 'left', camera: { pos: [2.5, 3.4, 1.3], look: [-2.7, 2.55, -0.8], shift: 0.2 } },
  { id: 'projects', side: 'right', camera: { pos: [0.3, 3.0, 2.4], look: [0.9, 1.95, -2.5], shift: -0.2 } },
  { id: 'skills', side: 'left', camera: { pos: [-1.0, 2.6, 1.1], look: [-1.95, 2.15, -2.97], shift: 0.2 } },
  { id: 'education', side: 'right', camera: { pos: [1.0, 2.6, 3.0], look: [-2.6, 1.05, 0.9], shift: -0.2 } },
  { id: 'certifications', side: 'left', camera: { pos: [0.85, 2.95, 2.3], look: [0.75, 2.95, -2.97], shift: 0.2 } },
  { id: 'resume', side: 'right', camera: { pos: [0.06, 3.15, -1.3], look: [0, 1.25, -1.93], shift: -0.2 } },
  { id: 'contact', side: 'right', camera: { pos: [2.7, 2.2, -0.75], look: [1.75, 1.3, -1.85], shift: -0.2 } },
]

export const basementStops: Stop[] = [
  { id: 'basement', camera: { pos: [8.6, 7, 8.6], look: [0, 1.1, 0], shift: 0 } },
  { id: 'gym', side: 'right', camera: { pos: [-1.0, 2.2, 1.3], look: [-2.5, 0.6, -1.5], shift: -0.2 } },
  { id: 'game', side: 'left', camera: { pos: [2.6, 2.1, 1.4], look: [0.2, 1.3, -2.8], shift: 0.2 } },
  { id: 'us', side: 'right', camera: { pos: [-1.0, 1.8, -2.55], look: [0.2, 1.0, -0.45], shift: -0.2, lambda: 1.1, via: [2.5, 1.65, -1.5] } },
  { id: 'toys', side: 'left', camera: { pos: [0.9, 2.8, 1.9], look: [2.3, 0.2, -1.0], shift: 0.2 } },
  { id: 'ai', side: 'right', camera: { pos: [-0.9, 2.3, 4.6], look: [1.5, 0.5, 1.9], shift: -0.2 } },
]

export const HATCH: Vec3 = [-2.2, 0, 2.55]
