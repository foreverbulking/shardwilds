import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Object3D } from 'three'

const MODEL_URL = '/models/lyra_blockout.glb'

/** Joint nodes the walk cycle swings. Null until the GLB has loaded. */
export interface LimbHandles {
  legLeft: Object3D | null
  legRight: Object3D | null
  armLeft: Object3D | null
  armRight: Object3D | null
}

/**
 * Presentational Lyra blockout model loaded from the exported GLB.
 * Populates `limbsRef` with the named joint nodes so a system can animate them.
 * No game logic — the parent group owns position, scale, and movement.
 */
export default function LyraModel({ limbsRef }: { limbsRef: RefObject<LimbHandles | null> }) {
  const { scene } = useGLTF(MODEL_URL)

  useEffect(() => {
    limbsRef.current = {
      legLeft: scene.getObjectByName('Lyra_Leg_L') ?? null,
      legRight: scene.getObjectByName('Lyra_Leg_R') ?? null,
      armLeft: scene.getObjectByName('Lyra_Arm_L') ?? null,
      armRight: scene.getObjectByName('Lyra_Arm_R') ?? null,
    }
    return () => {
      limbsRef.current = null
    }
  }, [scene, limbsRef])

  return <primitive object={scene} />
}

useGLTF.preload(MODEL_URL)
