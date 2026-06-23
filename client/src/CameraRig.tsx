import type { RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

const FOLLOW_OFFSET = new Vector3(0, 4, 8)
const LOOK_OFFSET = new Vector3(0, 1, 0)

// Reused temporaries to avoid per-frame allocation.
const desiredPosition = new Vector3()
const lookTarget = new Vector3()

export default function CameraRig({ targetRef }: { targetRef: RefObject<Vector3> }) {
  const { camera } = useThree()

  useFrame(() => {
    const target = targetRef.current
    if (!target) return

    desiredPosition.copy(target).add(FOLLOW_OFFSET)
    camera.position.lerp(desiredPosition, 0.1)

    lookTarget.copy(target).add(LOOK_OFFSET)
    camera.lookAt(lookTarget)
  })

  return null
}
