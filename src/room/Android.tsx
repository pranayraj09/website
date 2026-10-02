import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Limb } from './Basement'
import { Mat } from './Mat'
import { C } from './palette'
import type { Vec3 } from './stops'

const SHELL = '#f6f7fc'
const JOINT = '#c3c6d8'
const GLOW = '#8ef3ff'

function Pearl() {
  return <meshStandardMaterial color={SHELL} roughness={0.32} metalness={0.08} />
}

function Joint({ position, r }: { position: Vec3; r: number }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[r, 16, 12]} />
      <meshStandardMaterial color={JOINT} roughness={0.35} metalness={0.45} />
    </mesh>
  )
}

function Armchair() {
  return (
    <group>
      <RoundedBox args={[0.92, 0.2, 0.8]} radius={0.06} position={[0, 0.36, 0]} castShadow>
        <Mat color={C.primary} />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.07, 0.66]} radius={0.03} position={[0, 0.48, 0.04]} castShadow>
        <Mat color={C.primarySoft} />
      </RoundedBox>
      <RoundedBox args={[0.92, 0.8, 0.16]} radius={0.06} position={[0, 0.74, -0.34]} rotation={[-0.12, 0, 0]} castShadow>
        <Mat color={C.primary} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.13, 0.32, 0.8]} radius={0.05} position={[s * 0.4, 0.58, 0]} castShadow>
          <Mat color={C.primary} />
        </RoundedBox>
      ))}
      {[
        [-0.38, -0.3],
        [0.38, -0.3],
        [-0.38, 0.3],
        [0.38, 0.3],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.13, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.022, 0.26, 10]} />
          <Mat color={C.ink} />
        </mesh>
      ))}
    </group>
  )
}

function Hand({ open = false }: { open?: boolean }) {
  const fingers = [-0.03, -0.01, 0.01, 0.03]
  return (
    <group>
      <RoundedBox args={[0.085, 0.09, 0.032]} radius={0.013} castShadow>
        <Pearl />
      </RoundedBox>
      {fingers.map((x, i) => (
        <Limb
          key={x}
          from={[x, 0.045, 0]}
          to={[x * (open ? 1.5 : 1), open ? 0.1 - Math.abs(i - 1.5) * 0.008 : 0.08, open ? 0 : 0.03]}
          r={0.0105}
          color={SHELL}
        />
      ))}
      <Limb from={[-0.042, -0.01, 0.005]} to={[-0.075, 0.035, 0.012]} r={0.012} color={SHELL} />
    </group>
  )
}

function Head() {
  const head = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.5) * 0.12
      head.current.rotation.z = 0.06 + Math.sin(t * 0.37) * 0.04
    }
    if (eyes.current) eyes.current.scale.y = t % 4.2 < 0.13 ? 0.12 : 1
  })
  return (
    <group ref={head} position={[0, 1.3, -0.03]}>
      <mesh scale={[0.88, 1.08, 0.98]} castShadow>
        <sphereGeometry args={[0.125, 32, 24]} />
        <Pearl />
      </mesh>
      <mesh position={[0, 0.082, -0.01]} rotation={[Math.PI / 2 + 0.2, 0, 0]} scale={[0.86, 1, 1]}>
        <torusGeometry args={[0.104, 0.0035, 6, 40]} />
        <meshStandardMaterial color={JOINT} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.07, 0.012]} scale={[0.66, 0.5, 0.8]} castShadow>
        <sphereGeometry args={[0.1, 20, 14]} />
        <Pearl />
      </mesh>
      <group ref={eyes} position={[0, 0.012, 0.103]}>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.042, 0, 0]} rotation={[0, s * 0.35, s * -0.12]}>
            <mesh scale={[1.25, 0.7, 0.5]}>
              <sphereGeometry args={[0.022, 16, 10]} />
              <meshStandardMaterial color={C.ink} roughness={0.15} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.008]} scale={[1, 0.62, 0.4]}>
              <sphereGeometry args={[0.014, 14, 10]} />
              <meshBasicMaterial color={GLOW} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.043, 0.05, 0.1]} rotation={[0, s * 0.3, s * -0.15]}>
          <capsuleGeometry args={[0.004, 0.028, 4, 8]} />
          <meshStandardMaterial color={JOINT} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, -0.022, 0.118]} rotation={[0.3, 0, 0]} scale={[0.7, 1.15, 0.9]}>
        <sphereGeometry args={[0.016, 12, 10]} />
        <Pearl />
      </mesh>
      <mesh position={[0, -0.062, 0.104]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.0035, 0.026, 4, 8]} />
        <meshStandardMaterial color="#b4b7cc" roughness={0.5} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.112, 0, -0.005]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.036, 0.036, 0.03, 20]} />
            <meshStandardMaterial color={JOINT} roughness={0.35} metalness={0.45} />
          </mesh>
          <mesh position={[0, s * 0.016, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.004, 20]} />
            <meshBasicMaterial color={C.primary} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Body() {
  const forearm = useRef<THREE.Group>(null)
  const chest = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (forearm.current) {
      const burst = Math.max(0, Math.sin(t * 0.9))
      forearm.current.rotation.z = -0.1 + Math.sin(t * 6) * 0.32 * burst
    }
    if (chest.current) chest.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.012)
  })
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb from={[s * 0.1, 0.56, -0.04]} to={[s * 0.11, 0.56, 0.34]} r={0.066} color={SHELL} />
          <Joint position={[s * 0.11, 0.555, 0.38]} r={0.058} />
          <Limb from={[s * 0.11, 0.53, 0.4]} to={[s * 0.115, 0.13, 0.45]} r={0.05} color={SHELL} />
          <Joint position={[s * 0.115, 0.1, 0.45]} r={0.04} />
          <RoundedBox args={[0.1, 0.07, 0.21]} radius={0.03} position={[s * 0.115, 0.04, 0.5]} castShadow>
            <Pearl />
          </RoundedBox>
          <Joint position={[s * 0.205, 1.02, -0.05]} r={0.064} />
        </group>
      ))}
      <RoundedBox args={[0.34, 0.15, 0.27]} radius={0.06} position={[0, 0.57, -0.06]} castShadow>
        <Pearl />
      </RoundedBox>
      <mesh position={[0, 0.68, -0.07]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.1, 20]} />
        <meshStandardMaterial color={JOINT} roughness={0.35} metalness={0.45} />
      </mesh>
      <group ref={chest} position={[0, 0.9, -0.07]} rotation={[-0.08, 0, 0]}>
        <mesh scale={[1, 1, 0.68]} castShadow>
          <capsuleGeometry args={[0.165, 0.18, 10, 24]} />
          <Pearl />
        </mesh>
        <mesh position={[0, 0.05, 0.11]}>
          <circleGeometry args={[0.034, 32]} />
          <meshBasicMaterial color={GLOW} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.05, 0.109]}>
          <ringGeometry args={[0.034, 0.048, 32]} />
          <meshBasicMaterial color={C.primary} />
        </mesh>
      </group>
      <mesh position={[0, 1.16, -0.04]} castShadow>
        <cylinderGeometry args={[0.042, 0.05, 0.1, 16]} />
        <meshStandardMaterial color={JOINT} roughness={0.35} metalness={0.45} />
      </mesh>
      <Limb from={[-0.21, 1.0, -0.05]} to={[-0.27, 0.77, 0.02]} r={0.045} color={SHELL} />
      <Joint position={[-0.27, 0.76, 0.03]} r={0.042} />
      <Limb from={[-0.27, 0.75, 0.04]} to={[-0.16, 0.65, 0.3]} r={0.038} color={SHELL} />
      <group position={[-0.15, 0.63, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <Hand />
      </group>
      <Limb from={[0.21, 1.0, -0.05]} to={[0.37, 0.9, 0.06]} r={0.045} color={SHELL} />
      <Joint position={[0.38, 0.9, 0.07]} r={0.042} />
      <group ref={forearm} position={[0.38, 0.9, 0.07]}>
        <Limb from={[0, 0, 0]} to={[0.02, 0.24, 0.03]} r={0.037} color={SHELL} />
        <group position={[0.025, 0.31, 0.035]}>
          <Hand open />
        </group>
      </group>
      <Head />
    </group>
  )
}

export function Android({ position, rotation }: { position: Vec3; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Armchair />
      <Body />
    </group>
  )
}
