import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { avatarUrl, useAvatar } from './Avatar'
import { chores, logoPosition } from './chores'
import { HATCH } from './stops'

type Clip = 'idle' | 'wave' | 'look' | 'walk'
type Point = [number, number]
type Job = 'logo' | 'board' | 'monitor' | 'plant' | 'basement' | 'window'
type Task = { job: Job; via: Point[]; at: Point; face: Point; length: number; clip: Clip; logo: number; hold: boolean }

const JOBS: Job[] = ['logo', 'board', 'monitor', 'plant', 'basement', 'window']

function shuffle(after?: Job): Job[] {
  const order = [...JOBS]
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  if (order[0] === after) [order[0], order[1]] = [order[1], order[0]]
  return order
}
const REACHABLE_LOGOS = [3, 4, 5]
const HUB: Point = [0.2, 0]
const SPEED = 1.42
const FADE = 0.35
const WAVE_EVERY = 9
const X = new THREE.Vector3(1, 0, 0)
const Y = new THREE.Vector3(0, 1, 0)
const Z = new THREE.Vector3(0, 0, 1)
const ramp = THREE.MathUtils.smoothstep

function plan(job: Job): Task {
  const task = (via: Point[], at: Point, face: Point, length: number, clip: Clip = 'idle'): Task => ({
    job,
    via,
    at,
    face,
    length,
    clip,
    logo: -1,
    hold: false,
  })
  switch (job) {
    case 'logo': {
      const logo = REACHABLE_LOGOS[Math.floor(Math.random() * REACHABLE_LOGOS.length)]
      const hold = Math.random() < 0.5
      const z = logoPosition(logo)[2] + 0.3
      return { ...task([HUB, [-1.6, 0.6]], [-2.05, z], [-3, z], hold ? 6 : 4.6), logo, hold }
    }
    case 'board':
      return task([HUB, [-1.6, -0.9]], [-2.1, -2.3], [-2.1, -3.2], 6)
    case 'monitor':
      return task([HUB, [1.5, -0.6]], [1.25, -1.3], [1.25, -2.6], 6)
    case 'plant':
      return task([HUB, [2.4, -1.1]], [3.22, -2.3], [2.55, -2.5], 4.8)
    case 'basement':
      return task([HUB], [-1.5, 1.95], [HATCH[0], HATCH[2]], 5.5)
    case 'window':
      return task([HUB, [-1.2, 1.0]], [-1.95, 1.5], [-3, 1.5], 6.5, 'look')
  }
}

function envelope(t: number, length: number) {
  return ramp(t, 0, 0.8) * (1 - ramp(t, length - 0.9, length - 0.1))
}

function turnToward(from: number, to: number, lambda: number, dt: number) {
  const diff = THREE.MathUtils.euclideanModulo(to - from + Math.PI, Math.PI * 2) - Math.PI
  return from + diff * (1 - Math.exp(-lambda * dt))
}

export function Me({ home, heading, wander }: { home: Point; heading: number; wander: boolean }) {
  const { root, scene, actions } = useAvatar('me')
  const pos = useRef(new THREE.Vector2(...home))
  const yaw = useRef(heading)
  const waited = useRef(0)
  const current = useRef<Clip | null>(null)
  const order = useRef<Job[]>(shuffle())
  const jobIndex = useRef(0)
  const task = useRef<Task | null>(null)
  const queue = useRef<Point[]>([])
  const elapsed = useRef(0)
  const weight = useRef(0)
  const wandering = useRef(false)

  const rig = useMemo(() => {
    const bone = (name: string) => scene.getObjectByName(`Bip01_${name}`)
    const fingers = (side: 'L' | 'R') =>
      [1, 2, 3, 4].flatMap((f) => [bone(`${side}_Finger${f}`), bone(`${side}_Finger${f}1`)]).filter((b) => b !== undefined)
    const bones = {
      spine: bone('Spine1'),
      chest: bone('Spine2'),
      neck: bone('Neck'),
      head: bone('Head'),
      upperL: bone('L_UpperArm'),
      upperR: bone('R_UpperArm'),
      armL: bone('L_Forearm'),
      armR: bone('R_Forearm'),
      handL: bone('L_Hand'),
      handR: bone('R_Hand'),
      fingersL: fingers('L'),
      fingersR: fingers('R'),
    }
    const all = [
      bones.spine,
      bones.chest,
      bones.neck,
      bones.head,
      bones.upperL,
      bones.upperR,
      bones.armL,
      bones.armR,
      bones.handL,
      bones.handR,
      ...bones.fingersL,
      ...bones.fingersR,
    ].filter((b) => b !== undefined)
    return {
      ...bones,
      all,
      base: all.map((b) => b.quaternion.clone()),
      last: all.map((b) => b.quaternion.clone()),
    }
  }, [scene])

  const tmp = useMemo(
    () => ({
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      axis: new THREE.Vector3(),
      goal: new THREE.Vector3(),
      joint: new THREE.Vector3(),
      tip: new THREE.Vector3(),
      head: new THREE.Vector3(),
      rootQ: new THREE.Quaternion(),
      parentQ: new THREE.Quaternion(),
      q: new THREE.Quaternion(),
      full: new THREE.Quaternion(),
    }),
    [],
  )

  useFrame((_, dt) => {
    const group = root.current
    if (!group || !actions.walk) return

    rig.all.forEach((b, i) => {
      if (b.quaternion.equals(rig.last[i])) b.quaternion.copy(rig.base[i])
      else rig.base[i].copy(b.quaternion)
    })

    const play = (clip: Clip) => {
      if (current.current === clip) return
      const next = actions[clip]
      if (!next) return
      if (clip === 'wave') next.setLoop(THREE.LoopOnce, 1).clampWhenFinished = true
      next.reset().fadeIn(FADE).play()
      if (current.current) actions[current.current]?.fadeOut(FADE)
      current.current = clip
    }

    if (wander && !wandering.current) {
      task.current ??= plan(order.current[jobIndex.current])
      queue.current = [...task.current.via]
      elapsed.current = 0
    }
    wandering.current = wander

    const job = task.current
    const target = wander && job ? (queue.current[0] ?? job.at) : home
    const passing = wander && queue.current.length > 0
    const dx = target[0] - pos.current.x
    const dz = target[1] - pos.current.y
    const dist = Math.hypot(dx, dz)
    let acting = false

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
      queue.current.shift()
    } else if (wander && job) {
      const face = Math.atan2(job.face[0] - pos.current.x, job.face[1] - pos.current.y)
      yaw.current = turnToward(yaw.current, face, 4, dt)
      play(job.clip)
      const off = Math.abs(THREE.MathUtils.euclideanModulo(face - yaw.current + Math.PI, Math.PI * 2) - Math.PI)
      if (off < 0.15 || elapsed.current > 0) {
        elapsed.current += dt
        acting = true
      }
      if (elapsed.current > job.length) {
        jobIndex.current += 1
        if (jobIndex.current >= order.current.length) {
          order.current = shuffle(job.job)
          jobIndex.current = 0
        }
        task.current = plan(order.current[jobIndex.current])
        queue.current = [...task.current.via]
        elapsed.current = 0
        acting = false
      }
    } else {
      yaw.current = turnToward(yaw.current, heading, 4, dt)
      waited.current += dt
      if (current.current === 'wave') {
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
    group.updateMatrixWorld(true)

    const active = task.current
    weight.current =
      acting && active ? envelope(elapsed.current, active.length) : THREE.MathUtils.damp(weight.current, 0, 6, dt)
    const w = weight.current

    chores.logo = -1
    chores.offset.set(0, 0, 0)
    chores.turn.set(0, 0, 0)
    chores.plant = 0
    chores.door = 0
    chores.storm = acting && active?.job === 'window' ? 1 : 0

    if (active && w > 0.001) {
      const t = elapsed.current
      const space = group.parent ?? group
      const world = (x: number, y: number, z: number) => space.localToWorld(tmp.goal.set(x, y, z))
      const forward: Point = [Math.sin(yaw.current), Math.cos(yaw.current)]
      const right: Point = [-forward[1], forward[0]]

      const turn = (bone: THREE.Object3D | undefined, axis: THREE.Vector3, angle: number) => {
        if (!bone?.parent || angle === 0) return
        group.getWorldQuaternion(tmp.rootQ)
        bone.parent.getWorldQuaternion(tmp.parentQ)
        tmp.axis.copy(axis).applyQuaternion(tmp.rootQ).applyQuaternion(tmp.parentQ.invert())
        bone.quaternion.premultiply(tmp.q.setFromAxisAngle(tmp.axis, angle))
      }
      const reach = (hand: THREE.Object3D | undefined, chain: (THREE.Object3D | undefined)[], goal: THREE.Vector3) => {
        if (!hand) return
        for (let pass = 0; pass < 4; pass++) {
          for (const bone of chain) {
            if (!bone?.parent) continue
            bone.getWorldPosition(tmp.joint)
            hand.getWorldPosition(tmp.tip)
            tmp.a.subVectors(tmp.tip, tmp.joint).normalize()
            tmp.b.subVectors(goal, tmp.joint).normalize()
            tmp.q.setFromUnitVectors(tmp.a, tmp.b)
            bone.parent.getWorldQuaternion(tmp.parentQ)
            bone.getWorldQuaternion(tmp.rootQ)
            bone.quaternion.copy(tmp.parentQ.invert().multiply(tmp.q).multiply(tmp.rootQ))
          }
        }
      }
      const curl = (fingers: THREE.Object3D[], amount: number) => fingers.forEach((f) => f.rotateZ(amount))
      const lean = (amount: number) => {
        turn(rig.spine, X, amount * 0.55)
        turn(rig.chest, X, amount * 0.45)
      }

      switch (active.job) {
        case 'logo': {
          const [lx, ly, lz] = logoPosition(active.logo)
          if (active.hold) {
            const out = ramp(t, 0.9, 1.5) - ramp(t, 4.2, 4.8)
            const down = ramp(t, 1.3, 1.9) - ramp(t, 3.6, 4.2)
            chores.offset.set(0.32 * out, 0.03 * out - 0.36 * down, 0.12 * down).multiplyScalar(w)
            chores.turn.set(0, 0, 0.3 * down * w)
            turn(rig.head, X, -0.12 + 0.4 * down)
          } else {
            const k = ramp(t, 0.9, 1.5) - ramp(t, 2.6, 3.2)
            chores.offset.set(0, 0, 0.06 * k * w)
            chores.turn.set(0.12 * k * w, 0, 0)
            turn(rig.head, X, -0.15)
          }
          chores.logo = active.logo
          const cx = lx + chores.offset.x
          const cy = ly + chores.offset.y
          const cz = lz + chores.offset.z
          reach(rig.handR, [rig.armR, rig.upperR], world(cx + 0.08, cy - 0.06, cz - 0.33))
          curl(rig.fingersR, 0.6)
          if (active.hold) {
            reach(rig.handL, [rig.armL, rig.upperL], world(cx + 0.08, cy - 0.06, cz + 0.33))
            curl(rig.fingersL, 0.6)
          }
          break
        }
        case 'board': {
          const spin = t * Math.PI * 2 * 0.85
          lean(0.08)
          turn(rig.head, Y, -0.12 * Math.sin(spin))
          reach(rig.handR, [rig.armR, rig.upperR], world(-1.85 + 0.22 * Math.sin(spin), 2.2 + 0.1 * Math.sin(spin * 2), -2.84))
          break
        }
        case 'monitor': {
          const closer = ramp(t, 2, 2.8) * (1 - ramp(t, 4.2, 5))
          const amount = 0.5 + 0.12 * closer
          lean(amount)
          turn(rig.head, X, -amount * 0.9 - 0.05)
          turn(rig.head, Z, 0.14 * closer)
          const [px, pz] = [pos.current.x + forward[0] * 0.55, pos.current.y + forward[1] * 0.55]
          reach(rig.handR, [rig.armR, rig.upperR], world(px - right[0] * 0.24, 1.32, pz - right[1] * 0.24))
          reach(rig.handL, [rig.armL, rig.upperL], world(px + right[0] * 0.24, 1.32, pz + right[1] * 0.24))
          break
        }
        case 'plant': {
          chores.plant = w
          lean(0.5)
          turn(rig.head, X, 0.25)
          reach(rig.handL, [rig.armL, rig.upperL], world(2.86 + 0.03 * Math.cos(t * 3), 1.15 + 0.06 * Math.sin(t * 3), -2.33))
          curl(rig.fingersL, 0.25)
          break
        }
        case 'basement': {
          chores.door = w
          lean(0.35)
          turn(rig.head, X, 0.4)
          turn(rig.head, Z, 0.12 * Math.sin(t * 0.8))
          rig.head?.getWorldPosition(tmp.head)
          space.worldToLocal(tmp.head)
          reach(
            rig.handR,
            [rig.armR, rig.upperR],
            world(tmp.head.x + forward[0] * 0.13, tmp.head.y - 0.15, tmp.head.z + forward[1] * 0.13),
          )
          curl(rig.fingersR, 0.9)
          break
        }
        case 'window':
          turn(rig.head, X, -0.15)
          break
      }

      rig.all.forEach((b, i) => {
        tmp.full.copy(b.quaternion)
        b.quaternion.slerpQuaternions(rig.base[i], tmp.full, w)
      })
    }

    rig.all.forEach((b, i) => rig.last[i].copy(b.quaternion))
  })

  return (
    <group ref={root}>
      <primitive object={scene} scale={0.014} />
    </group>
  )
}

useGLTF.preload(avatarUrl('me'))
