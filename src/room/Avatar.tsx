import { useAnimations, useGLTF, useTexture } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

const SKINS = { me: 'm022', kid: 'cf001' } as const
export type AvatarKind = keyof typeof SKINS

const PROPORTIONS: Partial<Record<AvatarKind, Record<string, number>>> = {
  kid: {
    Spine1: 0.9,
    Neck: 0.7,
    Head: 1.6,
    L_Clavicle: 1.3,
    R_Clavicle: 1.3,
    L_Thigh: 0.72,
    R_Thigh: 0.72,
    L_Calf: 0.9,
    R_Calf: 0.9,
  },
}

const LIMBS: Record<string, string> = { UpperArm: 'Forearm', Forearm: 'Hand', Thigh: 'Calf', Calf: 'Foot' }

const THICKNESS: Partial<Record<AvatarKind, Record<string, number>>> = {
  kid: { UpperArm: 1.45, Forearm: 1.4, Thigh: 1.6, Calf: 1.55 },
}

function thicken(mesh: THREE.SkinnedMesh, sizes: Record<string, number>) {
  const { bones, boneInverses } = mesh.skeleton
  const at = boneInverses.map((inverse) =>
    new THREE.Vector3().applyMatrix4(inverse.clone().invert().premultiply(mesh.bindMatrixInverse)),
  )
  const segments = bones.map((bone, i) => {
    const [, side, part] = bone.name.match(/^Bip02_([LR])_(\w+)$/) ?? []
    const size = sizes[part]
    const end = size ? bones.findIndex((b) => b.name === `Bip02_${side}_${LIMBS[part]}`) : -1
    return end >= 0 ? { size, from: at[i], along: at[end].clone().sub(at[i]) } : null
  })
  const geometry = mesh.geometry.clone()
  const position = geometry.attributes.position
  const { skinIndex, skinWeight } = geometry.attributes
  const point = new THREE.Vector3()
  const offset = new THREE.Vector3()
  const axis = new THREE.Vector3()
  for (let v = 0; v < position.count; v++) {
    point.fromBufferAttribute(position, v)
    offset.set(0, 0, 0)
    for (let k = 0; k < 4; k++) {
      const segment = segments[skinIndex.getComponent(v, k)]
      const weight = skinWeight.getComponent(v, k)
      if (!segment || !weight) continue
      const t = THREE.MathUtils.clamp(
        axis.subVectors(point, segment.from).dot(segment.along) / segment.along.lengthSq(),
        0,
        1,
      )
      axis.copy(segment.along).multiplyScalar(t).add(segment.from)
      offset.addScaledVector(axis.subVectors(point, axis), weight * (segment.size - 1))
    }
    position.setXYZ(v, point.x + offset.x, point.y + offset.y, point.z + offset.z)
  }
  mesh.geometry = geometry
}

const dir = (kind: AvatarKind) => `${import.meta.env.BASE_URL}models/${kind}/`
export const avatarUrl = (kind: AvatarKind) => `${dir(kind)}${kind}.glb`

function textureUrls(kind: AvatarKind) {
  const base = `${dir(kind)}${SKINS[kind]}_`
  return {
    body: `${base}body_color.jpg`,
    bodyNormal: `${base}body_normal.jpg`,
    head: `${base}head_color.jpg`,
    headNormal: `${base}head_normal.jpg`,
  }
}

const TEXTURES: Record<AvatarKind, ReturnType<typeof textureUrls>> = {
  me: textureUrls('me'),
  kid: textureUrls('kid'),
}

export function useAvatar(kind: AvatarKind) {
  const root = useRef<THREE.Group>(null)
  const { scene: source, animations } = useGLTF(avatarUrl(kind))
  const tex = useTexture(TEXTURES[kind])

  const scene = useMemo(() => {
    const skin = SKINS[kind]
    const material = (map: THREE.Texture, normalMap: THREE.Texture, name: string) => {
      const color = map.clone()
      color.colorSpace = THREE.SRGBColorSpace
      color.needsUpdate = true
      return new THREE.MeshStandardMaterial({ name, map: color, normalMap, roughness: 0.78, metalness: 0 })
    }
    const materials: Record<string, THREE.Material> = {
      [`${skin}_body`]: material(tex.body, tex.bodyNormal, `${skin}_body`),
      [`${skin}_head`]: material(tex.head, tex.headNormal, `${skin}_head`),
    }
    const copy = clone(source)
    copy.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return
      o.castShadow = true
      o.frustumCulled = false
      const name = (o.material as THREE.Material).name
      o.material = materials[name] ?? new THREE.MeshStandardMaterial({ name, roughness: 0.78 })
      const sizes = THICKNESS[kind]
      if (sizes && o instanceof THREE.SkinnedMesh) thicken(o, sizes)
    })
    Object.entries(PROPORTIONS[kind] ?? {}).forEach(([bone, size]) => {
      copy.getObjectByName(`Bip02_${bone}`)?.scale.multiplyScalar(size)
    })
    return copy
  }, [kind, source, tex])

  const { actions, mixer } = useAnimations(animations, root)
  return { root, scene, actions, mixer }
}
