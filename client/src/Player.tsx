import { Suspense, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { useWASD } from './useWASD'
import LyraModel from './LyraModel'
import type { LimbHandles } from './LyraModel'
import { useWalkCycle } from './useWalkCycle'

// GLB is ~6.4 units tall (Z-up source). Scale to roughly player height.
const MODEL_SCALE = 0.6

const SPEED = 5 // world units per second
const JUMP_SPEED = 7 // initial upward velocity
const GRAVITY = 20 // downward acceleration

export default function Player({ positionRef }: { positionRef: RefObject<Vector3> }) {
  const groupRef = useRef<Group>(null)
  const input = useWASD()
  const verticalVelocity = useRef(0)
  const limbsRef = useRef<LimbHandles | null>(null)
  const isMovingRef = useRef(false)

  useWalkCycle(limbsRef, isMovingRef)

  useFrame((_, delta) => {
    const position = positionRef.current
    if (!position) return

    // Horizontal movement (XZ plane).
    let dx = 0
    let dz = 0
    if (input.current.forward) dz -= 1
    if (input.current.back) dz += 1
    if (input.current.left) dx -= 1
    if (input.current.right) dx += 1
    isMovingRef.current = dx !== 0 || dz !== 0
    if (isMovingRef.current) {
      const length = Math.hypot(dx, dz)
      position.x += (dx / length) * SPEED * delta
      position.z += (dz / length) * SPEED * delta
    }

    // Jump + gravity (Y axis).
    const grounded = position.y <= 0
    if (input.current.jumpRequested) {
      input.current.jumpRequested = false
      if (grounded) verticalVelocity.current = JUMP_SPEED
    }
    verticalVelocity.current -= GRAVITY * delta
    position.y += verticalVelocity.current * delta
    if (position.y < 0) {
      position.y = 0
      verticalVelocity.current = 0
    }

    groupRef.current?.position.set(position.x, position.y, position.z)
  })

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <group scale={MODEL_SCALE} castShadow>
          <LyraModel limbsRef={limbsRef} />
        </group>
      </Suspense>
    </group>
  )
}
