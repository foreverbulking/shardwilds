import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { useWASD } from './useWASD'

const SPEED = 5 // world units per second
const JUMP_SPEED = 7 // initial upward velocity
const GRAVITY = 20 // downward acceleration

export default function Player({ positionRef }: { positionRef: RefObject<Vector3> }) {
  const groupRef = useRef<Group>(null)
  const input = useWASD()
  const verticalVelocity = useRef(0)

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
    if (dx !== 0 || dz !== 0) {
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
      {/* body */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#3a6ea5" />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#e8c39e" />
      </mesh>
    </group>
  )
}
