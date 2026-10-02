import * as THREE from 'three'

export function Mat({ color, side }: { color: string; side?: THREE.Side }) {
  return <meshStandardMaterial color={color} roughness={0.85} metalness={0} side={side} />
}
