import type { RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

const FOLLOW_OFFSET = new Vector3(0, 4, 8)
const LOOK_HEIGHT = 1

// Reused temporaries to avoid per-frame allocation.
const desiredPosition = new Vector3()
const lookTarget = new Vector3()

export default function CameraRig({ targetRef }: { targetRef: RefObject<Vector3> }) {
  const { camera } = useThree()

  useFrame(() => {
    const target = targetRef.current
    if (!target) return

    // Follow X/Z only; keep a fixed camera height so jumps don't bob the view.
    desiredPosition.set(
      target.x + FOLLOW_OFFSET.x,
      FOLLOW_OFFSET.y,
      target.z + FOLLOW_OFFSET.z,
    )
    camera.position.lerp(desiredPosition, 0.1)

    lookTarget.set(target.x, LOOK_HEIGHT, target.z)
    camera.lookAt(lookTarget)
  })

  return null
}
