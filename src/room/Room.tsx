import { Html, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import * as THREE from 'three'
import { certifications, experience, type Certification, type Job } from '../content'
import { jumpToSection } from '../jump'
import { chores, logoPosition } from './chores'
import { Me } from './Me'
import { Basement } from './Basement'
import { Mat } from './Mat'
import { C } from './palette'
import { basementStops, HATCH, stops, type Stop, type Vec3 } from './stops'
import { FONT, roundRect, useCanvasTexture, wrapText } from './textures'


const FocusedView = createContext(false)


function Hotspot({
  target,
  onSelect,
  disabled = false,
  raised = false,
  label,
  tag,
  children,
}: {
  target?: string
  onSelect?: () => void
  disabled?: boolean
  raised?: boolean
  label: string
  tag: [number, number, number]
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const still = useContext(FocusedView)
  const lit = hovered && !disabled
  const canvas = useThree((state) => state.gl.domElement)
  const portal = useMemo(() => ({ current: canvas.parentElement as HTMLElement }), [canvas])

  useFrame((_, dt) => {
    const group = ref.current
    if (!group) return
    group.position.y = THREE.MathUtils.damp(group.position.y, raised || (lit && !still) ? 0.1 : 0, 10, dt)
  })

  useEffect(() => {
    if (!lit) return
    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = ''
    }
  }, [lit])

  const over = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(true)
  }

  return (
    <group
      ref={ref}
      onPointerOver={disabled ? undefined : over}
      onPointerOut={disabled ? undefined : () => setHovered(false)}
      onClick={
        disabled
          ? undefined
          : (event) => {
              event.stopPropagation()
              if (onSelect) onSelect()
              else if (target) jumpToSection(target)
            }
      }
    >
      {children}
      {!disabled && (
        <Html position={tag} center portal={portal} zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
          <span className={lit ? 'room-tag is-active' : 'room-tag'}>
            <i />
            <b>{label}</b>
          </span>
        </Html>
      )}
    </group>
  )
}

function Shell() {
  return (
    <group>
      <RoundedBox args={[6.6, 0.4, 6.6]} radius={0.12} position={[0, -0.2, 0]} receiveShadow>
        <Mat color={C.floor} />
      </RoundedBox>
      <RoundedBox args={[6.6, 4.4, 0.3]} radius={0.1} position={[0, 2.0, -3.15]} receiveShadow castShadow>
        <Mat color={C.wallBack} />
      </RoundedBox>
      <RoundedBox args={[0.3, 4.4, 6.6]} radius={0.1} position={[-3.15, 2.0, 0]} receiveShadow castShadow>
        <Mat color={C.wallLeft} />
      </RoundedBox>
      <mesh position={[0.4, 0.011, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.9, 64]} />
        <Mat color={C.primaryPale} />
      </mesh>
      <mesh position={[0.4, 0.013, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.55, 1.62, 64]} />
        <Mat color={C.white} />
      </mesh>
    </group>
  )
}

const SKY = new THREE.Color('#d9ecff')
const STORM = new THREE.Color('#ffd23f')
const FLASH = new THREE.Color('#fffbe6')

function Window() {
  const glass = useRef<THREE.MeshBasicMaterial>(null)
  const light = useRef<THREE.PointLight>(null)
  const storm = useRef(0)
  useFrame((state, dt) => {
    storm.current = THREE.MathUtils.damp(storm.current, chores.storm, chores.storm > storm.current ? 1.6 : 0.5, dt)
    const s = storm.current
    const t = state.clock.elapsedTime
    const flash = s * Math.pow(Math.max(0, Math.sin(t * 1.3) * Math.sin(t * 4.7) * Math.sin(t * 0.7)), 6)
    glass.current?.color.lerpColors(SKY, STORM, s).lerp(FLASH, Math.min(1, flash * 3))
    if (light.current) light.current.intensity = s * 1.4 + flash * 6
  })
  return (
    <group position={[-2.98, 2.35, 1.5]}>
      <RoundedBox args={[0.12, 1.7, 1.6]} radius={0.04} castShadow>
        <Mat color={C.white} />
      </RoundedBox>
      <mesh position={[0.065, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.38, 1.48]} />
        <meshBasicMaterial ref={glass} color={SKY} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0.6, 0, 0]} intensity={0} distance={3.5} color="#ffd566" />
      <mesh position={[0.08, 0, 0]}>
        <boxGeometry args={[0.03, 1.48, 0.06]} />
        <Mat color={C.white} />
      </mesh>
      <mesh position={[0.08, 0, 0]}>
        <boxGeometry args={[0.03, 0.06, 1.38]} />
        <Mat color={C.white} />
      </mesh>
      <RoundedBox args={[0.32, 0.08, 1.8]} radius={0.03} position={[0.14, -0.9, 0]} castShadow>
        <Mat color={C.white} />
      </RoundedBox>
    </group>
  )
}

const drawScreen = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#1e2040'
  ctx.fillRect(0, 0, w, h)
  const dots = ['#ff6b6b', '#ffd166', '#5dd39e']
  dots.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(34 + i * 30, 30, 9, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.font = `700 34px ${FONT}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText('~/projects', 34, 104)
  const lines = [
    { x: 34, w: 220, c: '#9fa2ee' },
    { x: 64, w: 320, c: '#ffffff' },
    { x: 64, w: 260, c: '#5dd39e' },
    { x: 94, w: 300, c: '#ffd166' },
    { x: 64, w: 180, c: '#ffffff' },
    { x: 34, w: 120, c: '#9fa2ee' },
  ]
  lines.forEach((line, i) => {
    ctx.globalAlpha = 0.85
    ctx.fillStyle = line.c
    roundRect(ctx, line.x, 150 + i * 36, line.w, 14, 7)
  })
  ctx.globalAlpha = 1
  ctx.fillStyle = '#5b5bd6'
  roundRect(ctx, w - 214, h - 74, 180, 46, 23)
  ctx.font = `700 22px ${FONT}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Open  →', w - 176, h - 43)
}

const drawSite = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#f8f8fc'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 24, 18, w - 48, 40, 20)
  ctx.fillStyle = '#5b5bd6'
  ctx.beginPath()
  ctx.arc(46, 38, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#c9cbf6'
  for (let i = 0; i < 5; i++) roundRect(ctx, w - 300 + i * 54, 33, 40, 10, 5)
  ctx.fillStyle = '#eef0fd'
  roundRect(ctx, 34, 96, 74, 24, 12)
  ctx.fillStyle = '#1b1d2b'
  ctx.font = `800 46px ${FONT}`
  ctx.fillText('Pranay Raj', 32, 170)
  ctx.fillText('Kyatham', 32, 218)
  ctx.fillStyle = '#5b5bd6'
  ctx.font = `700 17px ${FONT}`
  ctx.fillText('Staff Software Engineer', 34, 250)
  ctx.fillStyle = '#c3c6d8'
  ;[230, 250, 190].forEach((lw, i) => roundRect(ctx, 34, 270 + i * 18, lw, 8, 4))
  ctx.fillStyle = '#5b5bd6'
  roundRect(ctx, 34, 336, 96, 32, 16)
  ctx.fillStyle = '#ffffff'
  ;[140, 222].forEach((x) => roundRect(ctx, x, 336, 72, 32, 16))
  const cx = 470
  const cy = 260
  const s = 120
  const wall = s * 1.05
  const face = (points: number[][], color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.closePath()
    ctx.fill()
  }
  const back = [cx, cy - s * 0.55]
  const left = [cx - s, cy]
  const right = [cx + s, cy]
  const front = [cx, cy + s * 0.55]
  face([left, back, [back[0], back[1] - wall], [left[0], left[1] - wall]], '#c9cbf6')
  face([back, right, [right[0], right[1] - wall], [back[0], back[1] - wall]], '#e6e8fc')
  face([back, right, front, left], '#9fa2ee')
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, cx - 82, cy - 150, 26, 18, 3)
  roundRect(ctx, cx - 48, cy - 168, 26, 18, 3)
  ctx.fillStyle = '#5b5bd6'
  roundRect(ctx, cx + 30, cy - 150, 44, 28, 4)
  ctx.fillStyle = '#2a2d45'
  ctx.beginPath()
  ctx.ellipse(cx, cy + 10, 20, 10, 0, 0, Math.PI * 2)
  ctx.fill()
}

function Monitor({ texture, position, rotation }: { texture: THREE.Texture; position: Vec3; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, -0.75, 0.05]} castShadow>
        <boxGeometry args={[0.3, 0.04, 0.2]} />
        <Mat color={C.ink} />
      </mesh>
      <mesh position={[0, -0.55, 0]} castShadow>
        <boxGeometry args={[0.06, 0.38, 0.05]} />
        <Mat color={C.ink} />
      </mesh>
      <RoundedBox args={[1.12, 0.72, 0.06]} radius={0.03} castShadow>
        <Mat color={C.ink} />
      </RoundedBox>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[1.04, 0.64]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Desk() {
  const screen = useCanvasTexture(640, 400, drawScreen)
  const site = useCanvasTexture(640, 400, drawSite)
  return (
    <Hotspot target="projects" label="Projects" tag={[0.7, 2.75, -2.4]}>
      <group position={[0.7, 0, -2.25]}>
        <RoundedBox args={[2.9, 0.1, 1.15]} radius={0.04} position={[0, 1.2, 0]} castShadow receiveShadow>
          <Mat color={C.white} />
        </RoundedBox>
        {[
          [-1.35, -0.48],
          [1.35, -0.48],
          [-1.35, 0.48],
          [1.35, 0.48],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.58, z]} castShadow>
            <boxGeometry args={[0.07, 1.16, 0.07]} />
            <Mat color={C.ink} />
          </mesh>
        ))}
        <Monitor texture={screen} position={[-0.56, 2.02, -0.3]} rotation={0.16} />
        <Monitor texture={site} position={[0.56, 2.02, -0.3]} rotation={-0.16} />
        <RoundedBox args={[0.9, 0.04, 0.28]} radius={0.015} position={[-0.05, 1.27, 0.2]} castShadow>
          <Mat color={C.wallLeft} />
        </RoundedBox>
        <RoundedBox args={[0.16, 0.035, 0.24]} radius={0.015} position={[0.6, 1.27, 0.22]} castShadow>
          <Mat color={C.wallLeft} />
        </RoundedBox>
        <group position={[1.1, 1.25, 0.15]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.08, 0.2, 24]} />
            <Mat color={C.primary} />
          </mesh>
          <mesh position={[0.1, 0.11, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.05, 0.015, 8, 16]} />
            <Mat color={C.primary} />
          </mesh>
        </group>
        <Lamp />
      </group>
    </Hotspot>
  )
}

function Lamp() {
  return (
    <group position={[-1.32, 1.25, 0.25]} rotation={[0, -0.6, 0]}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.06, 24]} />
        <Mat color={C.ink} />
      </mesh>
      <mesh position={[0.08, 0.36, 0]} rotation={[0, 0, -0.35]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <Mat color={C.ink} />
      </mesh>
      <mesh position={[0.26, 0.68, 0.06]} rotation={[0.3, 0, 0.9]} castShadow>
        <coneGeometry args={[0.17, 0.28, 24, 1, true]} />
        <Mat color={C.primary} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.33, 0.6, 0.09]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={C.warm} />
      </mesh>
      <pointLight position={[0.38, 0.5, 0.2]} intensity={2.2} distance={3.2} color={C.warm} />
    </group>
  )
}

function Chair() {
  return (
    <group position={[0.6, 0, -1.15]} rotation={[0, -0.35, 0]}>
      <RoundedBox args={[0.75, 0.12, 0.72]} radius={0.05} position={[0, 0.82, 0]} castShadow>
        <Mat color={C.primary} />
      </RoundedBox>
      <RoundedBox args={[0.75, 0.8, 0.12]} radius={0.05} position={[0, 1.3, 0.34]} rotation={[-0.08, 0, 0]} castShadow>
        <Mat color={C.primary} />
      </RoundedBox>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.7, 12]} />
        <Mat color={C.ink} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.08, 0]} rotation={[0, (i / 5) * Math.PI * 2, 0]} castShadow>
          <boxGeometry args={[0.06, 0.05, 0.7]} />
          <Mat color={C.ink} />
        </mesh>
      ))}
    </group>
  )
}

const drawEnvelope = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#e6e8fc'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#9fa2ee'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(10, 10)
  ctx.lineTo(w / 2, h * 0.58)
  ctx.lineTo(w - 10, 10)
  ctx.stroke()
  ctx.fillStyle = '#5b5bd6'
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.58, 34, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = `800 40px ${FONT}`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('@', w / 2, h * 0.58 + 2)
}

function Envelope() {
  const texture = useCanvasTexture(512, 320, drawEnvelope)
  return (
    <Hotspot target="contact" label="Say hi" tag={[1.75, 1.75, -1.85]}>
      <group position={[1.75, 1.265, -1.85]} rotation={[0, -0.22, 0]}>
        <RoundedBox args={[0.46, 0.03, 0.29]} radius={0.01} castShadow receiveShadow>
          <Mat color="#e6e8fc" />
        </RoundedBox>
        <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.44, 0.275]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </Hotspot>
  )
}

const ORANGE = '#f08a32'

const drawBookCover = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const fill = ctx.createLinearGradient(0, 0, w, h)
  fill.addColorStop(0, '#f8a24a')
  fill.addColorStop(1, '#e8742a')
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
  ctx.lineWidth = 6
  ctx.strokeRect(34, 34, w - 68, h - 68)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 30px ${FONT}`
  ctx.fillText('PRANAY RAJ KYATHAM', w / 2, 120)
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, w / 2 - 70, 230, 140, 180, 16)
  ctx.fillStyle = ORANGE
  for (let i = 0; i < 5; i++) roundRect(ctx, w / 2 - 44, 270 + i * 26, i === 0 ? 60 : 88 - (i % 2) * 22, 10, 5)
  ctx.fillStyle = '#ffffff'
  ctx.font = `800 84px ${FONT}`
  ctx.fillText('View', w / 2, 520)
  ctx.fillText('resume', w / 2, 610)
  ctx.font = `600 30px ${FONT}`
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.fillText('Click to open', w / 2, 710)
}

const drawBookPage = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#fffaf3'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#2a2d45'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `800 42px ${FONT}`
  ctx.fillText('Pranay Raj Kyatham', 50, 100)
  ctx.fillStyle = ORANGE
  ctx.font = `700 26px ${FONT}`
  ctx.fillText('Staff Software Engineer', 50, 142)
  for (let block = 0; block < 4; block++) {
    const y = 210 + block * 145
    ctx.fillStyle = '#2a2d45'
    roundRect(ctx, 50, y, 180, 14, 7)
    ctx.fillStyle = '#c9c6d6'
    for (let line = 0; line < 4; line++) roundRect(ctx, 50, y + 32 + line * 24, w - 100 - ((line * 37) % 120), 9, 4)
  }
}

function Book({ active, open, onOpen }: { active: boolean; open: boolean; onOpen: () => void }) {
  const cover = useRef<THREE.Group>(null)
  const [opening, setOpening] = useState(false)
  const front = useCanvasTexture(600, 800, drawBookCover)
  const page = useCanvasTexture(600, 800, drawBookPage)
  const W = 0.3
  const D = 0.4
  useFrame((_, dt) => {
    if (!cover.current) return
    cover.current.rotation.z = THREE.MathUtils.damp(cover.current.rotation.z, open || opening ? 2.75 : 0, 4.5, dt)
  })
  const select = () => {
    if (!active) {
      jumpToSection('resume')
      return
    }
    if (opening || open) return
    setOpening(true)
    window.setTimeout(() => {
      onOpen()
      setOpening(false)
    }, 750)
  }
  return (
    <Hotspot onSelect={select} label="Resume" tag={[0, 1.55, -1.93]}>
      <group position={[0, 1.25, -1.93]} rotation={[0, 0.12, 0]}>
        <RoundedBox args={[W, 0.012, D]} radius={0.004} position={[0, 0.006, 0]} castShadow receiveShadow>
          <Mat color={ORANGE} />
        </RoundedBox>
        <mesh position={[0.006, 0.032, 0]} castShadow>
          <boxGeometry args={[W - 0.016, 0.04, D - 0.016]} />
          <Mat color="#fbf3e6" />
        </mesh>
        <mesh position={[0.006, 0.0525, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - 0.02, D - 0.02]} />
          <meshBasicMaterial map={page} toneMapped={false} />
        </mesh>
        <RoundedBox args={[0.016, 0.066, D]} radius={0.006} position={[-W / 2, 0.033, 0]} castShadow>
          <Mat color="#d9661f" />
        </RoundedBox>
        <group ref={cover} position={[-W / 2, 0.06, 0]}>
          <RoundedBox args={[W, 0.012, D]} radius={0.004} position={[W / 2, 0, 0]} castShadow>
            <Mat color={ORANGE} />
          </RoundedBox>
          <mesh position={[W / 2, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 0.008, D - 0.008]} />
            <meshBasicMaterial map={front} toneMapped={false} />
          </mesh>
          <mesh position={[W / 2, -0.0065, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 0.02, D - 0.02]} />
            <Mat color="#f3b77f" />
          </mesh>
        </group>
      </group>
    </Hotspot>
  )
}

function LogoBlock({ job, index, position }: { job: Job; index: number; position: Vec3 }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    const group = ref.current
    if (!group) return
    const [x, y, z] = position
    if (chores.logo === index) {
      group.position.set(x, y, z).add(chores.offset)
      group.rotation.copy(chores.turn)
    } else {
      group.position.set(x, y, z)
      group.rotation.set(0, 0, 0)
    }
  })
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      if (!job.logo) {
        ctx.font = `800 120px ${FONT}`
        ctx.fillStyle = C.primary
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(job.company.toLowerCase(), w / 2, h / 2 + 6)
      }
    },
    [job],
  )
  const texture = useCanvasTexture(512, 320, draw, job.logo)
  return (
    <group ref={ref} position={position}>
      <RoundedBox args={[0.1, 0.42, 0.62]} radius={0.03} castShadow>
        <Mat color={index === 0 ? C.primary : C.white} />
      </RoundedBox>
      <mesh position={[0.052, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.56, 0.35]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Shelves({
  interactive,
  focused,
  onOpenJob,
}: {
  interactive: boolean
  focused: Job | null
  onOpenJob: (job: Job) => void
}) {
  return (
    <Hotspot target="experience" label="Experience" tag={[-2.6, 3.55, -0.8]} disabled={interactive}>
      {[3.0, 2.15].map((y) => (
        <RoundedBox key={y} args={[0.5, 0.07, 2.4]} radius={0.02} position={[-2.75, y, -0.8]} castShadow receiveShadow>
          <Mat color={C.white} />
        </RoundedBox>
      ))}
      {experience.slice(0, 6).map((job, i) => {
        const [x, y, z] = logoPosition(i)
        return (
          <Hotspot
            key={job.company}
            label={job.company}
            tag={[x + 0.1, y + 0.36, z]}
            disabled={!interactive}
            raised={focused === job}
            onSelect={() => onOpenJob(job)}
          >
            <LogoBlock job={job} index={i} position={[x, y, z]} />
          </Hotspot>
        )
      })}
    </Hotspot>
  )
}

const drawBadge = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w / 2 - 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = C.primarySoft
  ctx.lineWidth = 8
  ctx.stroke()
}

function Frame({ cert, position }: { cert: Certification; position: [number, number, number] }) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = C.primarySoft
      ctx.lineWidth = 10
      ctx.strokeRect(26, 26, w - 52, h - 52)
      ctx.fillStyle = C.primary
      ctx.font = `800 26px ${FONT}`
      ctx.fillText('CERTIFIED', 62, 98)
      ctx.fillStyle = C.ink
      ctx.font = `750 36px ${FONT}`
      wrapText(ctx, cert.name, 62, 156, w - 124, 43)
      ctx.fillStyle = '#555a6e'
      ctx.font = `600 28px ${FONT}`
      ctx.fillText(`${cert.issuer} · ${cert.year}`, 62, h - 66)
    },
    [cert],
  )
  const texture = useCanvasTexture(512, 400, draw)
  const badge = useCanvasTexture(256, 256, drawBadge, cert.badge)
  return (
    <group position={position}>
      <RoundedBox args={[1.08, 0.86, 0.06]} radius={0.02} castShadow>
        <Mat color={C.ink} />
      </RoundedBox>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[0.98, 0.76]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {cert.badge && (
        <mesh position={[0.33, 0.22, 0.034]}>
          <circleGeometry args={[0.095, 48]} />
          <meshBasicMaterial map={badge} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

function Frames() {
  return (
    <Hotspot target="certifications" label="Certifications" tag={[0.75, 3.95, -2.9]}>
      {certifications.slice(0, 2).map((cert, i) => (
        <Frame key={cert.name} cert={cert} position={[0.05 + i * 1.3, 3.25, -2.97]} />
      ))}
    </Hotspot>
  )
}

const drawBoard = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#fbfbff'
  ctx.fillRect(0, 0, w, h)
  const notes = [
    { t: 'React', x: 36, y: 34, r: -0.05, c: '#c9cbf6' },
    { t: 'TypeScript', x: 262, y: 44, r: 0.04, c: '#ffffff' },
    { t: 'Node.js', x: 52, y: 214, r: 0.05, c: '#ffffff' },
    { t: 'AI agents', x: 270, y: 206, r: -0.04, c: '#c9cbf6' },
  ]
  for (const note of notes) {
    ctx.save()
    ctx.translate(note.x + 100, note.y + 70)
    ctx.rotate(note.r)
    ctx.shadowColor = 'rgba(40,40,120,0.18)'
    ctx.shadowBlur = 14
    ctx.shadowOffsetY = 6
    ctx.fillStyle = note.c
    roundRect(ctx, -100, -70, 200, 140, 10)
    ctx.shadowColor = 'transparent'
    ctx.fillStyle = C.primary
    ctx.beginPath()
    ctx.arc(0, -52, 9, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = C.ink
    ctx.font = `750 30px ${FONT}`
    ctx.textAlign = 'center'
    ctx.fillText(note.t, 0, 14)
    ctx.restore()
  }
}

function Pinboard() {
  const texture = useCanvasTexture(512, 400, drawBoard)
  return (
    <Hotspot target="skills" label="Skills" tag={[-1.95, 3.0, -2.85]}>
      <group position={[-1.95, 2.15, -2.97]}>
        <RoundedBox args={[1.3, 1.02, 0.06]} radius={0.03} castShadow>
          <Mat color={C.white} />
        </RoundedBox>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.2, 0.93]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </Hotspot>
  )
}

function Cabinet() {
  const books = [
    { h: 0.5, c: C.primary },
    { h: 0.44, c: C.ink },
    { h: 0.54, c: C.primarySoft },
    { h: 0.46, c: C.white },
    { h: 0.5, c: C.primary },
  ]
  return (
    <Hotspot target="education" label="Education" tag={[-2.55, 1.95, 1.2]}>
      <group position={[-2.6, 0, 0.9]}>
        <RoundedBox args={[0.7, 0.9, 1.6]} radius={0.05} position={[0, 0.45, 0]} castShadow receiveShadow>
          <Mat color={C.white} />
        </RoundedBox>
        <mesh position={[0.355, 0.45, 0]}>
          <boxGeometry args={[0.01, 0.02, 1.4]} />
          <Mat color={C.floorEdge} />
        </mesh>
        {books.map((book, i) => (
          <RoundedBox
            key={i}
            args={[0.4, book.h, 0.1]}
            radius={0.015}
            position={[0, 0.9 + book.h / 2, -0.55 + i * 0.12]}
            castShadow
          >
            <Mat color={book.c} />
          </RoundedBox>
        ))}
        <group position={[0, 0.9, 0.35]}>
          <RoundedBox args={[0.42, 0.08, 0.42]} radius={0.02} position={[0, 0.04, 0]} castShadow>
            <Mat color={C.primarySoft} />
          </RoundedBox>
          <mesh position={[0, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.15, 0.14, 24]} />
            <Mat color={C.ink} />
          </mesh>
          <mesh position={[0, 0.24, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <boxGeometry args={[0.42, 0.025, 0.42]} />
            <Mat color={C.ink} />
          </mesh>
          <mesh position={[0.14, 0.16, 0.14]}>
            <cylinderGeometry args={[0.01, 0.01, 0.16, 6]} />
            <Mat color={C.warm} />
          </mesh>
        </group>
      </group>
    </Hotspot>
  )
}

function Plant() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const angle = (i / 9) * Math.PI * 2
        return { angle, tilt: 0.5 + (i % 3) * 0.18, height: 0.9 + (i % 3) * 0.12 }
      }),
    [],
  )
  const sway = useRef<(THREE.Group | null)[]>([])
  const rustle = useRef(0)
  useFrame((state, dt) => {
    rustle.current = THREE.MathUtils.damp(rustle.current, chores.plant, 4, dt)
    const t = state.clock.elapsedTime
    sway.current.forEach((leaf, i) => {
      if (!leaf) return
      leaf.rotation.x = Math.sin(t * 9 + i * 1.7) * 0.07 * rustle.current
      leaf.rotation.z = Math.sin(t * 7 + i * 2.3) * 0.05 * rustle.current
    })
  })
  return (
    <group position={[2.55, 0, -2.5]}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.25, 0.64, 32]} />
        <Mat color={C.white} />
      </mesh>
      {leaves.map((leaf, i) => (
        <group key={i} position={[0, 0.6, 0]} rotation={[0, leaf.angle, 0]}>
          <group
            ref={(el) => {
              sway.current[i] = el
            }}
          >
            <mesh position={[0, leaf.height / 2, 0.18]} rotation={[leaf.tilt, 0, 0]} scale={[0.14, leaf.height / 2, 0.05]} castShadow>
              <sphereGeometry args={[1, 16, 12]} />
              <Mat color={i % 2 ? C.leaf : C.leafDark} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

function AboutMe({ wander }: { wander: boolean }) {
  return (
    <Hotspot target="about" label="About me" tag={[1.3, 2.9, 1.3]}>
      <Suspense fallback={null}>
        <Me home={[1.3, 1.3]} heading={0.75} wander={wander} />
      </Suspense>
    </Hotspot>
  )
}

type Motion = { progress: number; x: number; y: number }
type Place = 'room' | 'basement'
type Shot = { pos: THREE.Vector3; look: THREE.Vector3 }

const toKeys = (list: Stop[]) =>
  list.map((stop) => ({
    pos: new THREE.Vector3(...stop.camera.pos),
    look: new THREE.Vector3(...stop.camera.look),
    shift: stop.camera.shift,
    lambda: stop.camera.lambda ?? 8,
    via: stop.camera.via ? new THREE.Vector3(...stop.camera.via) : null,
  }))
const roomKeys = toKeys(stops)
const basementKeys = toKeys(basementStops)

const shot = (pos: Vec3, look: Vec3): Shot => ({ pos: new THREE.Vector3(...pos), look: new THREE.Vector3(...look) })
const [hx, , hz] = HATCH
const descent = [
  { at: 1.4, ...shot([-0.2, 2.9, 5.2], [hx, 0.1, hz]) },
  { at: 2.8, ...shot([hx, 1.6, hz + 1.05], [hx, -0.2, hz - 0.1]) },
  { at: 3.9, ...shot([hx, 0.3, hz + 0.12], [hx, -2, hz - 0.25]) },
]
const arrival = shot([-2.6, 3.3, 3.6], [-0.5, 1.0, -0.8])

function ease(t: number) {
  return t * t * (3 - 2 * t)
}

function CameraRig({
  motion,
  focus,
  place,
  descending,
  still,
}: {
  motion: RefObject<Motion>
  focus: Vec3 | null
  place: Place
  descending: boolean
  still: boolean
}) {
  const pos = useRef(roomKeys[0].pos.clone())
  const look = useRef(roomKeys[0].look.clone())
  const shift = useRef(roomKeys[0].shift)
  const smooth = useRef(0)
  const tilt = useRef({ x: 0, y: 0 })
  const cine = useRef<{ start: number; from: Shot } | null>(null)
  const lastPlace = useRef(place)
  const goalPos = useMemo(() => new THREE.Vector3(), [])
  const goalLook = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (lastPlace.current === place) return
    lastPlace.current = place
    const spot = place === 'basement' ? arrival : descent[0]
    pos.current.copy(spot.pos)
    look.current.copy(spot.look)
  }, [place])

  useFrame((state, dt) => {
    const camera = state.camera as THREE.PerspectiveCamera
    const { progress, x, y } = motion.current
    const keyframes = place === 'basement' ? basementKeys : roomKeys
    const lambda = 5
    const last = keyframes.length - 1
    const target = THREE.MathUtils.clamp(progress, 0, last)
    if (Math.abs(target - smooth.current) > 1.5) smooth.current = target
    else smooth.current = THREE.MathUtils.damp(smooth.current, target, keyframes[Math.round(target)].lambda, dt)
    if (descending) {
      if (!cine.current) cine.current = { start: state.clock.elapsedTime, from: { pos: pos.current.clone(), look: look.current.clone() } }
      const elapsed = state.clock.elapsedTime - cine.current.start
      let from = { at: 0, ...cine.current.from }
      let to = descent[descent.length - 1]
      for (const point of descent) {
        if (elapsed < point.at) {
          to = point
          break
        }
        from = point
      }
      const t = elapsed >= to.at ? 1 : ease((elapsed - from.at) / (to.at - from.at))
      pos.current.lerpVectors(from.pos, to.pos, t)
      look.current.lerpVectors(from.look, to.look, t)
      shift.current = THREE.MathUtils.damp(shift.current, 0, lambda, dt)
    } else {
      cine.current = null
      const p = smooth.current
      const i = Math.min(Math.floor(p), last - 1)
      const t = ease(p - i)
      const a = keyframes[i]
      const b = keyframes[i + 1]
      let goalShift = THREE.MathUtils.lerp(a.shift, b.shift, t)
      if (focus) {
        goalLook.set(...focus)
        goalPos.set(focus[0] + 2.1, focus[1] + 0.2, focus[2] + 0.3)
        goalShift = 0.12
      } else {
        if (b.via) {
          goalPos
            .copy(a.pos)
            .multiplyScalar((1 - t) * (1 - t))
            .addScaledVector(b.via, 2 * (1 - t) * t)
            .addScaledVector(b.pos, t * t)
        } else {
          goalPos.lerpVectors(a.pos, b.pos, t)
        }
        goalLook.lerpVectors(a.look, b.look, t)
      }
      pos.current.x = THREE.MathUtils.damp(pos.current.x, goalPos.x, lambda, dt)
      pos.current.y = THREE.MathUtils.damp(pos.current.y, goalPos.y, lambda, dt)
      pos.current.z = THREE.MathUtils.damp(pos.current.z, goalPos.z, lambda, dt)
      look.current.x = THREE.MathUtils.damp(look.current.x, goalLook.x, lambda, dt)
      look.current.y = THREE.MathUtils.damp(look.current.y, goalLook.y, lambda, dt)
      look.current.z = THREE.MathUtils.damp(look.current.z, goalLook.z, lambda, dt)
      shift.current = THREE.MathUtils.damp(shift.current, goalShift, lambda, dt)
    }
    tilt.current.x = THREE.MathUtils.damp(tilt.current.x, still ? 0 : x, 3, dt)
    tilt.current.y = THREE.MathUtils.damp(tilt.current.y, still ? 0 : y, 3, dt)

    camera.position.copy(pos.current)
    camera.lookAt(look.current)
    camera.rotateY(-tilt.current.x * 0.025)
    camera.rotateX(tilt.current.y * 0.018)
    const { width, height } = state.size
    camera.setViewOffset(width, height, -shift.current * width, 0, width, height)
  })
  return null
}

const drawHole = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#14152a'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = `rgba(255, 217, 168, ${0.08 + i * 0.07})`
    roundRect(ctx, 30 + i * 8, 30 + i * 38, w - 60 - i * 16, 14, 3)
  }
}

function Hatch({ open, startOpen }: { open: boolean; startOpen: boolean }) {
  const group = useRef<THREE.Group>(null)
  const door = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const progress = useRef(startOpen ? 2 : 0)
  const hole = useCanvasTexture(256, 256, drawHole)
  useFrame((_, dt) => {
    const p = open ? Math.min(2, progress.current + dt) : Math.max(0, progress.current - dt * 1.2)
    progress.current = p
    const appear = ease(THREE.MathUtils.clamp(p / 0.5, 0, 1))
    const swing = ease(THREE.MathUtils.clamp((p - 0.7) / 1.1, 0, 1))
    if (group.current) {
      group.current.visible = p > 0.001
      group.current.scale.setScalar(Math.max(0.001, appear))
    }
    if (door.current) door.current.rotation.x = -swing * 1.95
    if (light.current) light.current.intensity = swing * 1.6
  })
  return (
    <group ref={group} position={HATCH} visible={false}>
      {([[0, -0.43, 1.02, 0.06], [0, 0.43, 1.02, 0.06], [-0.48, 0, 0.06, 0.8], [0.48, 0, 0.06, 0.8]] as const).map(
        ([x, z, w, d]) => (
          <RoundedBox key={`${x}${z}`} args={[w, 0.03, d]} radius={0.01} position={[x, 0.015, z]} receiveShadow>
            <Mat color={C.primarySoft} />
          </RoundedBox>
        ),
      )}
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.8]} />
        <meshBasicMaterial map={hole} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0.25, 0]} intensity={0} distance={2.2} color={C.warm} />
      <group ref={door} position={[0, 0.03, -0.4]}>
        <group position={[0, 0.025, 0.4]}>
          <Planks width={0.9} depth={0.8} height={0.05} gap={0.006} />
        </group>
        {[0.2, 0.6].map((z) => (
          <RoundedBox key={z} args={[0.86, 0.012, 0.06]} radius={0.005} position={[0, 0.056, z]}>
            <Mat color={BATTEN} />
          </RoundedBox>
        ))}
        <mesh position={[0, 0.062, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.05, 0.012, 8, 20]} />
          <Mat color={C.ink} />
        </mesh>
      </group>
    </group>
  )
}

const drawShaft = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const fill = ctx.createLinearGradient(0, h, 0, 0)
  fill.addColorStop(0, 'rgba(255, 196, 110, 1)')
  fill.addColorStop(0.35, 'rgba(255, 210, 140, 0.45)')
  fill.addColorStop(1, 'rgba(255, 220, 160, 0)')
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, w, h)
}

const WOOD = ['#b7804f', '#a46f3e', '#c08a58', '#aa7443', '#ba8552']
const BATTEN = '#80522e'

function Planks({ width, depth, height, gap }: { width: number; depth: number; height: number; gap: number }) {
  const w = (width - gap * (WOOD.length - 1)) / WOOD.length
  return (
    <>
      {WOOD.map((color, i) => (
        <RoundedBox
          key={color}
          args={[w, height, depth]}
          radius={0.004}
          position={[-width / 2 + w / 2 + i * (w + gap), 0, 0]}
          castShadow
          receiveShadow
        >
          <Mat color={color} />
        </RoundedBox>
      ))}
    </>
  )
}

const PLANK_GAP = 0.014

const SEAMS = [
  { pos: [0, 0, 0.395], size: [0.88, 0.018], turn: 0 },
  { pos: [0, 0, -0.395], size: [0.88, 0.018], turn: 0 },
  { pos: [0.44, 0, 0], size: [0.018, 0.78], turn: Math.PI / 2 },
  { pos: [-0.44, 0, 0], size: [0.018, 0.78], turn: Math.PI / 2 },
] as const

function DoorHint({ visible, onOpen }: { visible: boolean; onOpen: () => void }) {
  const group = useRef<THREE.Group>(null)
  const beams = useRef<THREE.Group>(null)
  const level = useRef(0)
  const [hovered, setHovered] = useState(false)
  const lit = hovered && visible
  const shaft = useCanvasTexture(32, 256, drawShaft)
  const seam = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#ffb54d', transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
    [],
  )
  const beam = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: shaft,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [shaft],
  )

  useFrame((state, dt) => {
    level.current = THREE.MathUtils.damp(level.current, visible ? (lit ? 1 : 0.4 + 0.4 * chores.door) : 0, 6, dt)
    const flicker = 0.88 + 0.12 * Math.sin(state.clock.elapsedTime * 2.2) * Math.sin(state.clock.elapsedTime * 3.7)
    const l = level.current
    seam.opacity = Math.min(1, l * 2.2) * flicker
    beam.opacity = l * 0.8 * flicker
    if (beams.current) beams.current.scale.y = 0.25 + l * 1.15
    if (group.current) group.current.visible = l > 0.005
  })

  useEffect(() => {
    if (!lit) return
    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = ''
    }
  }, [lit])

  return (
    <group
      ref={group}
      position={HATCH}
      onPointerOver={
        visible
          ? (event) => {
              event.stopPropagation()
              setHovered(true)
            }
          : undefined
      }
      onPointerOut={visible ? () => setHovered(false) : undefined}
      onClick={
        visible
          ? (event) => {
              event.stopPropagation()
              onOpen()
            }
          : undefined
      }
    >
      {([[0, -0.42, 0.94, 0.035], [0, 0.42, 0.94, 0.035], [-0.47, 0, 0.035, 0.84], [0.47, 0, 0.035, 0.84]] as const).map(
        ([x, z, w, d]) => (
          <RoundedBox key={`${x}${z}`} args={[w, 0.012, d]} radius={0.004} position={[x, 0.006, z]} receiveShadow>
            <Mat color={C.primarySoft} />
          </RoundedBox>
        ),
      )}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={seam}>
        <planeGeometry args={[0.9, 0.8]} />
      </mesh>
      <group position={[0, 0.011, 0]}>
        <Planks width={0.86} depth={0.76} height={0.016} gap={PLANK_GAP} />
      </group>
      {[-0.22, 0.22].map((z) => (
        <RoundedBox key={z} args={[0.84, 0.01, 0.06]} radius={0.003} position={[0, 0.024, z]} castShadow>
          <Mat color={BATTEN} />
        </RoundedBox>
      ))}
      <mesh position={[0.3, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.035, 0.008, 8, 20]} />
        <Mat color={C.ink} />
      </mesh>
      <group ref={beams}>
        {SEAMS.filter(({ pos }) => pos[0] + pos[2] < 0).map(({ pos, size, turn }) => (
          <mesh key={`${pos[0]}${pos[2]}`} position={[pos[0], 0.2, pos[2]]} rotation={[0, turn, 0]} material={beam}>
            <planeGeometry args={[Math.max(size[0], size[1]), 0.4]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Intro({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const intro = useRef(0)
  useFrame((_, dt) => {
    const group = ref.current
    if (!group || intro.current >= 1) return
    intro.current = Math.min(1, intro.current + dt * 0.7)
    const e = 1 - Math.pow(1 - intro.current, 3)
    group.rotation.y = -(1 - e) * 0.5
    group.position.y = -(1 - e) * 1.2
    group.scale.setScalar(0.88 + 0.12 * e)
  })
  return <group ref={ref}>{children}</group>
}

export default function Room({
  activeId,
  focusJob,
  onOpenJob,
  place,
  descending,
  returning,
  onOpenResume,
  resumeOpen,
  onOpenDoor,
}: {
  activeId: string | undefined
  focusJob: Job | null
  onOpenJob: (job: Job) => void
  onOpenResume: () => void
  resumeOpen: boolean
  onOpenDoor: () => void
  place: Place
  descending: boolean
  returning: boolean
}) {
  const focusIndex = focusJob ? experience.indexOf(focusJob) : -1
  const focus = focusIndex >= 0 ? logoPosition(focusIndex) : null
  const focused = focus !== null || (activeId !== undefined && !['home', 'room', 'basement'].includes(activeId))
  const motion = useRef<Motion>({ progress: 0, x: 0, y: 0 })
  useEffect(() => {
    const state = motion.current
    const onScroll = () => {
      state.progress = window.scrollY / window.innerHeight
    }
    const onPointer = (event: PointerEvent) => {
      state.x = (event.clientX / window.innerWidth) * 2 - 1
      state.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <Canvas
      className="room"
      shadows="percentage"
      flat
      dpr={[1, 2]}
      camera={{ position: [11, 9, 11], fov: 30, near: 0.1, far: 100 }}
    >
      <hemisphereLight args={['#ffffff', '#c9cbf6', 1.7]} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <CameraRig
        motion={motion}
        focus={place === 'room' ? focus : null}
        place={place}
        descending={descending}
        still={focused}
      />
      <FocusedView.Provider value={focused}>
        <Intro>
        {place === 'room' ? (
          <>
            <Shell />
            <Window />
            <Desk />
            <Envelope />
            <Book active={activeId === 'resume'} open={resumeOpen} onOpen={onOpenResume} />
            <Chair />
            <Shelves interactive={activeId === 'experience' || focus !== null} focused={focusJob} onOpenJob={onOpenJob} />
            <Frames />
            <Pinboard />
            <Cabinet />
            <Plant />
            <AboutMe wander={activeId === undefined || activeId === 'home'} />
            <Hatch open={descending} startOpen={returning} />
            <DoorHint
              visible={!descending && !returning && (activeId === undefined || activeId === 'home' || activeId === 'room')}
              onOpen={onOpenDoor}
            />
          </>
        ) : (
          <Basement />
        )}
        </Intro>
      </FocusedView.Provider>
    </Canvas>
  )
}
