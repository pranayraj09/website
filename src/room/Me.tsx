import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { avatarUrl, useAvatar } from './Avatar'

type Clip = 'idle' | 'wave' | 'look' | 'walk'
type Point = [number, number]
type Spot = { at: Point; face?: Point; clip?: Clip; wait?: number }

const TOUR: Spot[] = [
  { at: [-1.7, -0.5], face: [-2.75, -0.5], clip: 'look', wait: 4.6 },
  { at: [-1.75, -1.75], face: [-1.95, -2.97], clip: 'idle', wait: 3.5 },
  { at: [0.35, -0.15] },
  { at: [1.55, -0.95], face: [0.9, -2.25], clip: 'idle', wait: 3.5 },
  { at: [0.35, -0.15] },
]
const SPEED = 1.42
const FADE = 0.35
const WAVE_EVERY = 9

function turnToward(from: number, to: number, lambda: number, dt: number) {
  const diff = THREE.MathUtils.euclideanModulo(to - from + Math.PI, Math.PI * 2) - Math.PI
  return from + diff * (1 - Math.exp(-lambda * dt))
}

export function Me({ home, heading, wander }: { home: Point; heading: number; wander: boolean }) {
  const { root, scene, actions } = useAvatar('me')
  const pos = useRef(new THREE.Vector2(...home))
  const yaw = useRef(heading)
  const stop = useRef(0)
  const waited = useRef(0)
  const current = useRef<Clip | null>(null)

  useFrame((_, dt) => {
    const group = root.current
    if (!group || !actions.walk) return

    const play = (clip: Clip) => {
      if (current.current === clip) return
      const next = actions[clip]
      if (!next) return
      if (clip === 'wave') next.setLoop(THREE.LoopOnce, 1).clampWhenFinished = true
      next.reset().fadeIn(FADE).play()
      if (current.current) actions[current.current]?.fadeOut(FADE)
      current.current = clip
    }

    const spot: Spot = wander ? TOUR[stop.current] : { at: home }
    const dx = spot.at[0] - pos.current.x
    const dz = spot.at[1] - pos.current.y
    const dist = Math.hypot(dx, dz)
    const passing = wander && spot.wait === undefined

    if (dist > (passing ? 0.3 : 0.04)) {
      const want = Math.atan2(dx, dz)
      yaw.current = turnToward(yaw.current, want, 7, dt)
      const aligned = Math.max(0, Math.cos(want - yaw.current))
      const step = Math.min(dist, SPEED * aligned * dt)
      pos.current.x += Math.sin(yaw.current) * step
      pos.current.y += Math.cos(yaw.current) * step
      actions.walk.timeScale = Math.max(0.4, aligned)
      play('walk')
      waited.current = 0
    } else if (passing) {
      stop.current = (stop.current + 1) % TOUR.length
    } else {
      const face = spot.face ? Math.atan2(spot.face[0] - pos.current.x, spot.face[1] - pos.current.y) : heading
      yaw.current = turnToward(yaw.current, face, 4, dt)
      waited.current += dt
      if (wander) {
        play(spot.clip ?? 'idle')
        if (waited.current > (spot.wait ?? 0)) {
          stop.current = (stop.current + 1) % TOUR.length
          waited.current = 0
        }
      } else if (current.current === 'wave') {
        if (!actions.wave?.isRunning()) {
          play('idle')
          waited.current = 0
        }
      } else if (waited.current > WAVE_EVERY) {
        play('wave')
      } else {
        play('idle')
      }
    }

    group.position.set(pos.current.x, 0, pos.current.y)
    group.rotation.y = yaw.current
  })

  return (
    <group ref={root}>
      <primitive object={scene} scale={0.014} />
    </group>
  )
}

useGLTF.preload(avatarUrl('me'))
