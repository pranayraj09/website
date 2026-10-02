import { useAnimations, useGLTF, useTexture } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

const SKINS = { me: 'm022', kid: 'cf001' } as const
export type AvatarKind = keyof typeof SKINS

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
    })
    return copy
  }, [kind, source, tex])

  const { actions, mixer } = useAnimations(animations, root)
  return { root, scene, actions, mixer }
}
