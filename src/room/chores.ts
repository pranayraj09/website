import * as THREE from 'three'
import type { Vec3 } from './stops'

export function logoPosition(index: number): Vec3 {
  const row = Math.floor(index / 3)
  return [-2.68, 3.25 - row * 0.85, -(index % 3) * 0.8]
}

export const chores = {
  logo: -1,
  offset: new THREE.Vector3(),
  turn: new THREE.Euler(),
  plant: 0,
  door: 0,
  storm: 0,
}
