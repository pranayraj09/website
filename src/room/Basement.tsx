import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Mat } from './Mat'
import { C } from './palette'
import type { Vec3 } from './stops'
import { FONT, roundRect, useCanvasTexture } from './textures'

const B = {
  floor: '#e4e2f8',
  wallBack: '#f2f1fc',
  wallLeft: '#e8e6f9',
  rubber: '#4a4d6e',
  steel: '#c3c6d8',
  sofa: '#8b8ee6',
  cushion: '#a5a8ef',
  wood: '#efc07a',
  woodDark: '#d9a35e',
  pink: '#f2a7c3',
  red: '#f27474',
  yellow: '#ffd166',
  hair: '#1d1a24',
  skin: '#e2b591',
  skinKid: '#efc6a4',
  pad: '#22232f',
  glow: '#8ef3ff',
}

function Limb({ from, to, r, color }: { from: Vec3; to: Vec3; r: number; color: string }) {
  const { mid, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    const length = dir.length()
    return {
      mid: a.add(b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()),
      len: length,
    }
  }, [from, to])
  return (
    <mesh position={mid} quaternion={quat} castShadow>
      <capsuleGeometry args={[r, len, 6, 12]} />
      <Mat color={color} />
    </mesh>
  )
}

function Shell() {
  return (
    <group>
      <RoundedBox args={[6.6, 0.4, 6.6]} radius={0.12} position={[0, -0.2, 0]} receiveShadow>
        <Mat color={B.floor} />
      </RoundedBox>
      <RoundedBox args={[6.6, 4.4, 0.3]} radius={0.1} position={[0, 2.0, -3.15]} receiveShadow castShadow>
        <Mat color={B.wallBack} />
      </RoundedBox>
      <RoundedBox args={[0.3, 4.4, 6.6]} radius={0.1} position={[-3.15, 2.0, 0]} receiveShadow castShadow>
        <Mat color={B.wallLeft} />
      </RoundedBox>
      <mesh position={[0.2, 0.008, -1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.7, 2.3]} />
        <Mat color={C.primaryPale} />
      </mesh>
      <mesh position={[-2.2, 0.007, -1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.5, 2.6]} />
        <Mat color={B.rubber} />
      </mesh>
    </group>
  )
}

function Stairs() {
  return (
    <group position={[-2.6, 0, 1.3]}>
      {Array.from({ length: 8 }, (_, i) => (
        <RoundedBox
          key={i}
          args={[0.8, 0.3 * (i + 1), 0.24]}
          radius={0.02}
          position={[0, 0.15 * (i + 1), 0.24 * i]}
          castShadow
          receiveShadow
        >
          <Mat color={i % 2 ? B.wallBack : B.wallLeft} />
        </RoundedBox>
      ))}
      <Limb from={[0.42, 0.75, -0.1]} to={[0.42, 2.95, 1.75]} r={0.025} color={C.ink} />
      {[0, 0.6, 1.2, 1.7].map((z) => (
        <Limb key={z} from={[0.42, 0.3 + z * 1.25, z]} to={[0.42, 0.85 + z * 1.25, z]} r={0.018} color={C.ink} />
      ))}
    </group>
  )
}

function Dumbbell({ position, size }: { position: Vec3; size: number }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.34, 10]} />
        <Mat color={B.steel} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[size, size, 0.08, 6]} />
          <Mat color={C.ink} />
        </mesh>
      ))}
    </group>
  )
}

function Gym() {
  const tiers = [
    { x: -2.5, y: 0.42, sizes: [0.1, 0.095, 0.09, 0.085, 0.08] },
    { x: -2.72, y: 0.8, sizes: [0.075, 0.07, 0.065, 0.06, 0.055] },
  ]
  return (
    <group>
      {[-2.45, -0.35].map((z) => (
        <RoundedBox key={z} args={[0.55, 0.92, 0.06]} radius={0.02} position={[-2.62, 0.46, z]} castShadow>
          <Mat color={C.ink} />
        </RoundedBox>
      ))}
      {tiers.map((tier) => (
        <group key={tier.y}>
          <RoundedBox args={[0.36, 0.04, 2.1]} radius={0.015} position={[tier.x, tier.y, -1.4]} castShadow receiveShadow>
            <Mat color={C.primarySoft} />
          </RoundedBox>
          {tier.sizes.map((size, j) => (
            <Dumbbell key={j} position={[tier.x, tier.y + size + 0.02, -2.2 + j * 0.4]} size={size} />
          ))}
        </group>
      ))}
      <group position={[-1.55, 0, -1.7]} rotation={[0, 0.25, 0]}>
        <RoundedBox args={[0.36, 0.1, 1.15]} radius={0.04} position={[0, 0.46, 0]} castShadow>
          <Mat color={C.primary} />
        </RoundedBox>
        {[-0.42, 0.42].map((z) => (
          <RoundedBox key={z} args={[0.3, 0.42, 0.06]} radius={0.015} position={[0, 0.21, z]} castShadow>
            <Mat color={C.ink} />
          </RoundedBox>
        ))}
      </group>
      <group position={[-1.95, 0, -0.25]}>
        <mesh position={[0, 0.11, 0]} castShadow>
          <sphereGeometry args={[0.11, 20, 16]} />
          <Mat color={C.ink} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <torusGeometry args={[0.06, 0.018, 8, 20]} />
          <Mat color={C.ink} />
        </mesh>
      </group>
    </group>
  )
}

const drawRace = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const half = w / 2
  const horizon = h * 0.42
  const view = (x0: number, car: string, label: string, place: string, speed: number, bend: number) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(x0, 0, half, h)
    ctx.clip()
    const sky = ctx.createLinearGradient(0, 0, 0, horizon)
    sky.addColorStop(0, '#5aa9e6')
    sky.addColorStop(1, '#cfe8ff')
    ctx.fillStyle = sky
    ctx.fillRect(x0, 0, half, horizon)
    ctx.fillStyle = '#8a9bc4'
    ctx.beginPath()
    ctx.moveTo(x0, horizon)
    ;[0.12, 0.3, 0.46, 0.66, 0.84, 1].forEach((f, i) => ctx.lineTo(x0 + half * f, horizon - (i % 2 ? 22 : 46)))
    ctx.lineTo(x0 + half, horizon)
    ctx.fill()
    ctx.fillStyle = '#6fbf73'
    ctx.fillRect(x0, horizon, half, h - horizon)
    const cx = x0 + half / 2
    const vx = cx + bend
    ctx.fillStyle = '#4b4f5c'
    ctx.beginPath()
    ctx.moveTo(vx - 6, horizon)
    ctx.lineTo(vx + 6, horizon)
    ctx.lineTo(cx + half * 0.62, h)
    ctx.lineTo(cx - half * 0.62, h)
    ctx.fill()
    for (const side of [-1, 1]) {
      for (let k = 0; k < 9; k++) {
        const a = k / 9
        const b = (k + 0.5) / 9
        const at = (f: number) => [vx + (cx + side * half * 0.62 - vx) * f, horizon + (h - horizon) * f]
        const [x1, y1] = at(a * a)
        const [x2, y2] = at(b * b)
        ctx.strokeStyle = k % 2 ? '#ffffff' : '#e8443a'
        ctx.lineWidth = 2 + b * b * 10
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }
    ctx.strokeStyle = '#f5f5f5'
    for (let k = 1; k < 8; k += 2) {
      const a = (k / 8) ** 2
      const b = ((k + 0.6) / 8) ** 2
      ctx.lineWidth = 1 + b * 6
      ctx.beginPath()
      ctx.moveTo(vx + (cx - vx) * a, horizon + (h - horizon) * a)
      ctx.lineTo(vx + (cx - vx) * b, horizon + (h - horizon) * b)
      ctx.stroke()
    }
    const by = h - 30
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.beginPath()
    ctx.ellipse(cx, by + 6, 74, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#16171d'
    roundRect(ctx, cx - 70, by - 22, 26, 30, 6)
    roundRect(ctx, cx + 44, by - 22, 26, 30, 6)
    ctx.fillStyle = car
    roundRect(ctx, cx - 66, by - 50, 132, 44, 14)
    roundRect(ctx, cx - 44, by - 78, 88, 34, 12)
    ctx.fillStyle = '#2a3142'
    roundRect(ctx, cx - 36, by - 72, 72, 22, 7)
    ctx.fillStyle = '#ff3b3b'
    roundRect(ctx, cx - 60, by - 40, 26, 9, 4)
    roundRect(ctx, cx + 34, by - 40, 26, 9, 4)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
    roundRect(ctx, cx - 22, by - 24, 44, 10, 3)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
    roundRect(ctx, cx - 58, by - 49, 116, 4, 2)
    ctx.fillStyle = 'rgba(20, 22, 34, 0.55)'
    roundRect(ctx, x0 + 12, 12, 92, 46, 10)
    ctx.fillStyle = '#ffffff'
    ctx.font = `800 22px ${FONT}`
    ctx.textAlign = 'left'
    ctx.fillText(place, x0 + 22, 42)
    ctx.font = `700 11px ${FONT}`
    ctx.fillText(label, x0 + 66, 30)
    ctx.fillText('LAP 2/3', x0 + 60, 48)
    ctx.textAlign = 'right'
    ctx.font = `800 26px ${FONT}`
    ctx.fillText(String(speed), x0 + half - 50, h - 16)
    ctx.font = `700 11px ${FONT}`
    ctx.fillText('KM/H', x0 + half - 14, h - 16)
    ctx.textAlign = 'left'
    ctx.restore()
  }
  view(0, '#9ea4ae', 'P1', '2nd', 212, -38)
  view(half, '#e23b3b', 'P2', '1st', 218, -30)
  ctx.fillStyle = '#14151c'
  ctx.fillRect(half - 2, 0, 4, h)
}

function TvCorner() {
  const screen = useCanvasTexture(640, 360, drawRace)
  return (
    <group>
      <group position={[0.2, 1.75, -2.97]}>
        <RoundedBox args={[1.9, 1.1, 0.06]} radius={0.03} castShadow>
          <Mat color={C.ink} />
        </RoundedBox>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.8, 1.0]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
      <pointLight position={[0.2, 1.3, -2.2]} intensity={1.4} distance={4} color="#ffb38a" />
      <RoundedBox args={[2.1, 0.42, 0.45]} radius={0.04} position={[0.2, 0.21, -2.78]} castShadow receiveShadow>
        <Mat color={C.white} />
      </RoundedBox>
      <group position={[0.95, 0.42, -2.78]}>
        <RoundedBox args={[0.2, 0.44, 0.2]} radius={0.02} position={[0, 0.22, 0]} castShadow>
          <Mat color={B.pad} />
        </RoundedBox>
        <mesh position={[0, 0.445, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.006, 24]} />
          <meshBasicMaterial color="#2f6b3c" />
        </mesh>
        <mesh position={[0.06, 0.38, 0.102]}>
          <circleGeometry args={[0.012, 12]} />
          <meshBasicMaterial color="#7dff9b" />
        </mesh>
      </group>
    </group>
  )
}

function Controller() {
  return (
    <group position={[0, 0.4, -0.33]} rotation={[-0.5, 0, 0]}>
      <RoundedBox args={[0.15, 0.035, 0.075]} radius={0.015} castShadow>
        <Mat color={B.pad} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.062, -0.012, 0.04]} rotation={[0.7, 0, s * 0.25]} castShadow>
          <capsuleGeometry args={[0.024, 0.05, 4, 10]} />
          <Mat color={B.pad} />
        </mesh>
      ))}
      {[
        [-0.042, -0.008],
        [0.022, 0.016],
      ].map(([x, z]) => (
        <mesh key={x} position={[x, 0.022, z]}>
          <cylinderGeometry args={[0.011, 0.011, 0.014, 12]} />
          <Mat color="#3a3c4c" />
        </mesh>
      ))}
      {[
        [0.05, -0.022, '#ffd166'],
        [0.062, -0.01, '#f27474'],
        [0.038, -0.01, '#5b8def'],
        [0.05, 0.002, '#7dff9b'],
      ].map(([x, z, color]) => (
        <mesh key={color} position={[x as number, 0.019, z as number]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.0055, 10]} />
          <meshBasicMaterial color={color as string} />
        </mesh>
      ))}
      <mesh position={[0, 0.019, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.009, 14]} />
        <meshBasicMaterial color="#e9fbe9" />
      </mesh>
    </group>
  )
}

const torsoGeometry = new THREE.LatheGeometry(
  [
    [0.001, 0],
    [0.15, 0],
    [0.16, 0.07],
    [0.142, 0.2],
    [0.16, 0.32],
    [0.185, 0.42],
    [0.185, 0.47],
    [0.135, 0.52],
    [0.055, 0.55],
    [0.001, 0.55],
  ].map(([x, y]) => new THREE.Vector2(x, y)),
  32,
)

const skirtGeometry = new THREE.LatheGeometry(
  [
    [0.15, 0.2],
    [0.17, 0.12],
    [0.22, 0.02],
    [0.24, -0.02],
  ].map(([x, y]) => new THREE.Vector2(x, y)),
  32,
)

function Hair({ kid }: { kid: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.012, 0.004]} rotation={[0.55, 0, 0]} scale={[0.96, 1.08, 1.02]} castShadow>
        <sphereGeometry args={[0.126, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <Mat color={B.hair} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.01, 0.03]} scale={[0.86, 0.95, 0.85]} castShadow>
        <sphereGeometry args={[0.122, 24, 16]} />
        <Mat color={B.hair} />
      </mesh>
      {kid
        ? [-0.055, -0.018, 0.018, 0.055].map((x) => (
            <mesh key={x} position={[x, 0.07, -0.09]} rotation={[0.5, 0, x * 3]} scale={[1.1, 0.42, 0.65]}>
              <sphereGeometry args={[0.038, 14, 10]} />
              <Mat color={B.hair} />
            </mesh>
          ))
        : [
            [-0.05, 0.1, -0.055, 0.3],
            [0.005, 0.118, -0.068, 0],
            [0.058, 0.102, -0.05, -0.3],
          ].map(([x, y, z, r]) => (
            <mesh key={x} position={[x, y, z]} rotation={[0.4, 0, r]} scale={[1.15, 0.55, 0.95]} castShadow>
              <sphereGeometry args={[0.05, 16, 12]} />
              <Mat color={B.hair} />
            </mesh>
          ))}
      {kid &&
        [-1, 1].map((s) => (
          <group key={s} position={[s * 0.1, -0.03, 0.045]}>
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <mesh
                key={k}
                position={[s * k * 0.008 + (k % 2 ? 0.006 : -0.006), -k * 0.04, 0]}
                rotation={[0, 0, (k % 2 ? 0.45 : -0.45) * s]}
                scale={[0.8, 1.3, 0.8]}
                castShadow
              >
                <sphereGeometry args={[0.026 - k * 0.0015, 12, 10]} />
                <Mat color={B.hair} />
              </mesh>
            ))}
            <mesh position={[s * 0.045, -0.245, 0]} castShadow>
              <torusGeometry args={[0.016, 0.008, 8, 16]} />
              <Mat color={B.pink} />
            </mesh>
            <mesh position={[s * 0.047, -0.28, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.018, 0.05, 10]} />
              <Mat color={B.hair} />
            </mesh>
          </group>
        ))}
    </group>
  )
}

function Face({ skin }: { skin: string }) {
  return (
    <group>
      <mesh scale={[0.92, 1.06, 0.98]} castShadow>
        <sphereGeometry args={[0.12, 32, 24]} />
        <Mat color={skin} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.108, -0.005, 0.005]} scale={[0.45, 1, 0.75]}>
            <sphereGeometry args={[0.028, 12, 10]} />
            <Mat color={skin} />
          </mesh>
          <mesh position={[s * 0.042, 0.012, -0.104]} scale={[1, 0.78, 0.5]}>
            <sphereGeometry args={[0.02, 14, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[s * 0.04, 0.01, -0.113]}>
            <sphereGeometry args={[0.0105, 12, 10]} />
            <meshStandardMaterial color="#2b1d16" roughness={0.2} />
          </mesh>
          <mesh position={[s * 0.043, 0.048, -0.104]} rotation={[0, 0, s * -0.15]}>
            <capsuleGeometry args={[0.005, 0.03, 4, 8]} />
            <Mat color={B.hair} />
          </mesh>
          <mesh position={[s * 0.07, -0.035, -0.088]} scale={[1, 0.6, 0.4]}>
            <sphereGeometry args={[0.02, 10, 8]} />
            <meshStandardMaterial color="#f2a08f" roughness={0.9} transparent opacity={0.45} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.015, -0.118]} scale={[0.8, 1.1, 1]}>
        <sphereGeometry args={[0.016, 12, 10]} />
        <Mat color={skin} />
      </mesh>
      <group position={[0, -0.056, -0.103]} rotation={[-0.35, 0, 0]}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.008, 0.006, 0]} rotation={[0, 0, s * -0.18]} scale={[1, 0.42, 0.5]}>
            <sphereGeometry args={[0.013, 14, 10]} />
            <meshStandardMaterial color="#c97a72" roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, -0.005, 0.001]} scale={[1.45, 0.55, 0.55]}>
          <sphereGeometry args={[0.0135, 16, 10]} />
          <meshStandardMaterial color="#d48a80" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

function Person({
  position,
  scale = 1,
  head = 1,
  skin,
  top,
  bottom,
  shoe,
  kid = false,
}: {
  position: Vec3
  scale?: number
  head?: number
  skin: string
  top: string
  bottom: string
  shoe: string
  kid?: boolean
}) {
  return (
    <group position={position} scale={scale}>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb from={[s * 0.09, 0.08, 0.02]} to={[s * 0.1, 0.08, -0.38]} r={0.07} color={kid ? C.primarySoft : bottom} />
          <Limb from={[s * 0.1, 0.07, -0.42]} to={[s * 0.1, -0.3, -0.46]} r={0.052} color={kid ? C.primarySoft : bottom} />
          {kid && (
            <mesh position={[s * 0.1, -0.3, -0.465]}>
              <cylinderGeometry args={[0.056, 0.056, 0.05, 14]} />
              <Mat color={C.white} />
            </mesh>
          )}
          <group position={[s * 0.1, -0.37, -0.5]}>
            <RoundedBox args={[0.1, 0.07, 0.19]} radius={0.03} castShadow>
              <Mat color={shoe} />
            </RoundedBox>
            <RoundedBox args={[0.108, 0.024, 0.2]} radius={0.01} position={[0, -0.035, -0.004]}>
              <Mat color="#e9eaf3" />
            </RoundedBox>
          </group>
          <Limb from={[s * 0.175, 0.57, 0.01]} to={[s * 0.205, 0.45, -0.05]} r={0.056} color={top} />
          <Limb from={[s * 0.18, 0.55, 0]} to={[s * 0.215, 0.36, -0.1]} r={0.042} color={skin} />
          <Limb from={[s * 0.215, 0.36, -0.1]} to={[s * 0.1, 0.39, -0.28]} r={0.038} color={skin} />
          <mesh position={[s * 0.085, 0.39, -0.31]} rotation={[0, s * 0.4, 0]} scale={[0.85, 0.62, 1.15]} castShadow>
            <sphereGeometry args={[0.042, 14, 10]} />
            <Mat color={skin} />
          </mesh>
          <Limb from={[s * 0.06, 0.41, -0.31]} to={[s * 0.04, 0.43, -0.345]} r={0.012} color={skin} />
        </group>
      ))}
      <RoundedBox args={[0.32, 0.14, 0.26]} radius={0.06} position={[0, 0.07, 0.01]} castShadow>
        <Mat color={kid ? C.primarySoft : bottom} />
      </RoundedBox>
      <mesh geometry={torsoGeometry} position={[0, 0.08, 0.02]} rotation={[-0.1, 0, 0]} scale={[1, 1, 0.66]} castShadow>
        <Mat color={top} />
      </mesh>
      {kid ? (
        <mesh geometry={skirtGeometry} position={[0, 0.08, -0.02]} scale={[1, 1, 0.9]} castShadow>
          <Mat color={top} side={THREE.DoubleSide} />
        </mesh>
      ) : (
        <mesh position={[0, 0.14, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.66, 1]}>
          <torusGeometry args={[0.152, 0.014, 8, 32]} />
          <Mat color="#3a3a8c" />
        </mesh>
      )}
      <mesh position={[0, 0.635, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.058, 0.014, 8, 24]} />
        <Mat color={kid ? '#ffffff' : '#7b7be0'} />
      </mesh>
      <mesh position={[0, 0.67, -0.01]} castShadow>
        <cylinderGeometry args={[0.042, 0.048, 0.09, 14]} />
        <Mat color={skin} />
      </mesh>
      <group position={[0, 0.8, -0.03]} scale={head}>
        <Face skin={skin} />
        <Hair kid={kid} />
      </group>
      <Controller />
    </group>
  )
}

function Sofa() {
  return (
    <group position={[0.2, 0, -0.5]}>
      <RoundedBox args={[2.1, 0.32, 0.9]} radius={0.06} position={[0, 0.26, 0]} castShadow receiveShadow>
        <Mat color={B.sofa} />
      </RoundedBox>
      {[-0.5, 0.5].map((x) => (
        <RoundedBox key={x} args={[0.98, 0.12, 0.78]} radius={0.05} position={[x, 0.48, -0.04]} castShadow receiveShadow>
          <Mat color={B.cushion} />
        </RoundedBox>
      ))}
      <RoundedBox args={[2.1, 0.62, 0.22]} radius={0.08} position={[0, 0.72, 0.36]} castShadow>
        <Mat color={B.sofa} />
      </RoundedBox>
      {[-1.05, 1.05].map((x) => (
        <RoundedBox key={x} args={[0.2, 0.5, 0.9]} radius={0.07} position={[x, 0.45, 0]} castShadow>
          <Mat color={B.sofa} />
        </RoundedBox>
      ))}
      <Person position={[-0.42, 0.54, 0]} skin={B.skin} top={C.primary} bottom="#3b4a72" shoe={C.white} />
      <Person position={[0.42, 0.54, 0.05]} scale={0.6} head={1.22} skin={B.skinKid} top={B.pink} bottom={B.pink} shoe="#e46a9a" kid />
    </group>
  )
}

function ToyCorner() {
  const blocks: { p: Vec3; c: string; r: number }[] = [
    { p: [1.9, 0.07, -1.5], c: B.red, r: 0.3 },
    { p: [2.06, 0.07, -1.62], c: C.primary, r: -0.2 },
    { p: [1.98, 0.21, -1.56], c: B.yellow, r: 0.6 },
    { p: [2.45, 0.07, -1.15], c: C.leaf, r: 0.1 },
    { p: [1.68, 0.07, -1.08], c: B.yellow, r: -0.5 },
  ]
  const rings = [B.red, B.yellow, C.leaf, C.primary]
  return (
    <group>
      <group position={[2.55, 0, -2.6]}>
        <RoundedBox args={[0.9, 0.5, 0.6]} radius={0.04} position={[0, 0.25, 0]} castShadow receiveShadow>
          <Mat color={B.wood} />
        </RoundedBox>
        <RoundedBox args={[0.92, 0.06, 0.08]} radius={0.02} position={[0, 0.3, 0.29]}>
          <Mat color={B.woodDark} />
        </RoundedBox>
        <mesh position={[-0.18, 0.5, 0.02]} castShadow>
          <sphereGeometry args={[0.13, 20, 16]} />
          <Mat color={B.red} />
        </mesh>
        <mesh position={[0.2, 0.5, 0.04]} castShadow>
          <sphereGeometry args={[0.1, 20, 16]} />
          <Mat color="#c99566" />
        </mesh>
        <group position={[0, 0.5, -0.3]} rotation={[-1.0, 0, 0]}>
          <RoundedBox args={[0.94, 0.06, 0.62]} radius={0.025} position={[0, 0, 0.31]} castShadow>
            <Mat color={B.woodDark} />
          </RoundedBox>
        </group>
      </group>
      {blocks.map((block, i) => (
        <RoundedBox key={i} args={[0.14, 0.14, 0.14]} radius={0.02} position={block.p} rotation={[0, block.r, 0]} castShadow>
          <Mat color={block.c} />
        </RoundedBox>
      ))}
      <group position={[2.68, 0, -1.6]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.04, 20]} />
          <Mat color={C.white} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.3, 10]} />
          <Mat color={C.white} />
        </mesh>
        {rings.map((color, i) => (
          <mesh key={color} position={[0, 0.07 + i * 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.09 - i * 0.012, 0.03, 10, 24]} />
            <Mat color={color} />
          </mesh>
        ))}
      </group>
      <group position={[1.45, 0, -1.85]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.13, 0]} castShadow>
          <sphereGeometry args={[0.13, 20, 16]} />
          <Mat color="#c99566" />
        </mesh>
        <mesh position={[0, 0.3, 0.02]} castShadow>
          <sphereGeometry args={[0.09, 20, 16]} />
          <Mat color="#c99566" />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.065, 0.38, 0.01]} castShadow>
            <sphereGeometry args={[0.035, 12, 10]} />
            <Mat color="#b07f52" />
          </mesh>
        ))}
        <mesh position={[0, 0.29, 0.1]}>
          <sphereGeometry args={[0.035, 12, 10]} />
          <Mat color="#e8c9a4" />
        </mesh>
      </group>
      <mesh position={[2.15, 0.1, -0.85]} castShadow>
        <sphereGeometry args={[0.1, 20, 16]} />
        <Mat color={B.yellow} />
      </mesh>
    </group>
  )
}

function Scooter() {
  return (
    <group position={[2.3, 0, 0.25]} rotation={[0, 0.6, 0]}>
      <RoundedBox args={[0.5, 0.04, 0.15]} radius={0.015} position={[0, 0.08, 0]} castShadow>
        <Mat color={B.pink} />
      </RoundedBox>
      {([[-0.24, 0], [0.24, 0.075], [0.24, -0.075]] as const).map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.035, 16]} />
          <Mat color={C.white} />
        </mesh>
      ))}
      <Limb from={[0.25, 0.1, 0]} to={[0.18, 0.68, 0]} r={0.02} color={C.white} />
      <Limb from={[0.18, 0.68, -0.17]} to={[0.18, 0.68, 0.17]} r={0.018} color={C.white} />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.18, 0.68, s * 0.19]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.026, 0.06, 4, 10]} />
          <Mat color={B.pink} />
        </mesh>
      ))}
    </group>
  )
}

const drawAgents = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#1b1d2b'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#ffffff'
  ctx.font = `800 26px ${FONT}`
  ctx.fillText('AI agents', 24, 44)
  ctx.fillStyle = '#9fa2ee'
  ctx.font = `600 15px ${FONT}`
  ctx.fillText('4 running', w - 104, 42)
  const rows = [
    ['Orchestrator', 0.82, '#7cc3a4'],
    ['Reviewer', 0.56, '#ffd166'],
    ['Builder', 0.68, '#8ef3ff'],
    ['Tester', 0.4, '#f2a7c3'],
  ] as const
  rows.forEach(([label, done, color], i) => {
    const y = 84 + i * 40
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(32, y - 5, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#e6e8fc'
    ctx.font = `650 15px ${FONT}`
    ctx.fillText(label, 48, y)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
    roundRect(ctx, 160, y - 12, w - 190, 10, 5)
    ctx.fillStyle = '#5b5bd6'
    roundRect(ctx, 160, y - 12, (w - 190) * done, 10, 5)
  })
}

const cableCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.012, -0.25),
  new THREE.Vector3(0.06, 0.01, -0.5),
  new THREE.Vector3(-0.03, 0.01, -0.7),
  new THREE.Vector3(0, 0.03, -0.92),
])

const UP = new THREE.Vector3(0, 1, 0)
const ARM = 0.26
const armFrom = new THREE.Vector3()
const armTo = new THREE.Vector3()

function Bot({
  angle,
  phase,
  cable,
  keys,
}: {
  angle: number
  phase: number
  cable: THREE.TubeGeometry
  keys: THREE.Texture
}) {
  const arms = useRef<(THREE.Mesh | null)[]>([])
  const hands = useRef<(THREE.Group | null)[]>([])
  const head = useRef<THREE.Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime + phase
    for (const i of [0, 1]) {
      const s = i ? 1 : -1
      const press = Math.max(0, Math.sin(t * 11 + i * Math.PI)) * 0.012
      const slide = Math.sin(t * 1.7 + i * 2) * 0.025
      armFrom.set(s * 0.13, 0.23, -0.04)
      armTo.set(s * 0.06 + slide, 0.046 + press, -0.19 + Math.sin(t * 2.3 + i) * 0.012)
      const arm = arms.current[i]
      const hand = hands.current[i]
      if (hand) hand.position.copy(armTo)
      if (arm) {
        arm.position.addVectors(armFrom, armTo).multiplyScalar(0.5)
        const dir = armTo.clone().sub(armFrom)
        arm.scale.y = dir.length() / ARM
        arm.quaternion.setFromUnitVectors(UP, dir.normalize())
      }
    }
    if (head.current) head.current.rotation.x = -0.22 + Math.sin(t * 1.3) * 0.04
  })
  return (
    <group position={[Math.sin(angle) * 0.95, 0, Math.cos(angle) * 0.95]} rotation={[0, angle, 0]}>
      <RoundedBox args={[0.24, 0.26, 0.2]} radius={0.07} position={[0, 0.15, 0]} rotation={[-0.12, 0, 0]} castShadow>
        <Mat color={C.white} />
      </RoundedBox>
      <group ref={head} position={[0, 0.38, -0.02]}>
        <RoundedBox args={[0.22, 0.16, 0.18]} radius={0.05} castShadow>
          <Mat color={C.white} />
        </RoundedBox>
        <RoundedBox args={[0.18, 0.08, 0.02]} radius={0.01} position={[0, 0, -0.09]}>
          <Mat color={C.ink} />
        </RoundedBox>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.04, -0.005, -0.102]}>
            <circleGeometry args={[0.016, 12]} />
            <meshBasicMaterial color={B.glow} side={THREE.DoubleSide} />
          </mesh>
        ))}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
          <Mat color={C.ink} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <sphereGeometry args={[0.022, 10, 8]} />
          <meshBasicMaterial color={C.primary} />
        </mesh>
      </group>
      {[0, 1].map((i) => (
        <group key={i}>
          <mesh
            ref={(el) => {
              arms.current[i] = el
            }}
            castShadow
          >
            <capsuleGeometry args={[0.022, ARM, 4, 10]} />
            <Mat color={C.primarySoft} />
          </mesh>
          <group
            ref={(el) => {
              hands.current[i] = el
            }}
          >
            <RoundedBox args={[0.055, 0.028, 0.05]} radius={0.012} castShadow>
              <Mat color={C.white} />
            </RoundedBox>
          </group>
        </group>
      ))}
      <group position={[0, 0, -0.2]}>
        <RoundedBox args={[0.26, 0.03, 0.1]} radius={0.008} position={[0, 0.015, 0]} castShadow receiveShadow>
          <Mat color={C.ink} />
        </RoundedBox>
        <mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.24, 0.085]} />
          <meshBasicMaterial map={keys} toneMapped={false} />
        </mesh>
      </group>
      <mesh geometry={cable}>
        <Mat color={C.primary} />
      </mesh>
    </group>
  )
}

const drawKeys = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#2a2d45'
  ctx.fillRect(0, 0, w, h)
  const cols = 12
  const rows = 4
  const kw = w / cols
  const kh = h / rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === rows - 1 && c > 2 && c < 9) continue
      ctx.fillStyle = '#4a4e6e'
      roundRect(ctx, c * kw + 3, r * kh + 3, kw - 6, kh - 6, 4)
    }
  }
  ctx.fillStyle = '#4a4e6e'
  roundRect(ctx, 3 * kw + 3, (rows - 1) * kh + 3, 6 * kw - 6, kh - 6, 4)
}

function AiTable() {
  const screen = useCanvasTexture(400, 260, drawAgents)
  const keys = useCanvasTexture(240, 85, drawKeys)
  const cable = useMemo(() => new THREE.TubeGeometry(cableCurve, 24, 0.008, 6, false), [])
  useEffect(() => () => cable.dispose(), [cable])
  return (
    <group position={[1.5, 0, 2.0]}>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.03, 24]} />
        <Mat color={C.ink} />
      </mesh>
      <mesh position={[0, 0.29, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.55, 12]} />
        <Mat color={C.ink} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 40]} />
        <Mat color={C.white} />
      </mesh>
      <group position={[0, 0.6, 0.02]} rotation={[0, -0.45, 0]}>
        <group position={[0, 0.15, 0]} rotation={[-0.3, 0, 0]}>
          <RoundedBox args={[0.42, 0.3, 0.02]} radius={0.01} castShadow>
            <Mat color={C.ink} />
          </RoundedBox>
          <mesh position={[0, 0, 0.011]}>
            <planeGeometry args={[0.39, 0.27]} />
            <meshBasicMaterial map={screen} toneMapped={false} />
          </mesh>
        </group>
        <RoundedBox args={[0.12, 0.02, 0.14]} radius={0.008} position={[0, 0.01, -0.02]}>
          <Mat color={C.ink} />
        </RoundedBox>
      </group>
      <pointLight position={[0, 0.9, 0.2]} intensity={0.8} distance={2} color={B.glow} />
      {[0.4, 1.6, 2.8, 4.0].map((angle, i) => (
        <Bot key={angle} angle={angle} phase={i * 1.7} cable={cable} keys={keys} />
      ))}
    </group>
  )
}

export function Basement() {
  return (
    <group>
      <Shell />
      <Stairs />
      <Gym />
      <TvCorner />
      <Sofa />
      <ToyCorner />
      <Scooter />
      <AiTable />
      <pointLight position={[0.3, 3.2, 0.4]} intensity={1.6} distance={7} color={C.warm} />
    </group>
  )
}
