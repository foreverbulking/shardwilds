import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Object3D } from 'three'

const MODEL_URL = '/models/sw_adventurer_base_v001.glb'

export interface LimbHandles {
  legLeft: Object3D | null
  legRight: Object3D | null
  armLeft: Object3D | null
  armRight: Object3D | null
}

export default function SwCharacterModel({ limbsRef }: { limbsRef: RefObject<LimbHandles | null> }) {
  const { scene } = useGLTF(MODEL_URL)

  useEffect(() => {
    // Body is a single mesh — no separate limb nodes yet (pre-rig blockout).
    // Walk cycle will idle gracefully with null refs.
    limbsRef.current = {
      legLeft: null,
      legRight: null,
      armLeft: null,
      armRight: null,
    }
    return () => { limbsRef.current = null }
  }, [scene, limbsRef])

  return <primitive object={scene} />
}

useGLTF.preload(MODEL_URL)
