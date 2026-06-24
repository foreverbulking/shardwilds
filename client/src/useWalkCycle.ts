import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Object3D } from 'three'
import type { LimbHandles } from './LyraModel'

const SWING_FREQUENCY = 9 // radians per second through the cycle
const SWING_AMPLITUDE = 0.5 // peak swing in radians (~29 degrees)
const RETURN_LERP = 0.2 // how fast limbs settle to neutral when idle

function applySwing(node: Object3D | null, target: number, moving: boolean) {
  if (!node) return
  if (moving) {
    node.rotation.x = target
  } else {
    node.rotation.x += (0 - node.rotation.x) * RETURN_LERP
  }
}

/**
 * Procedural walk: swings the leg/arm nodes about X in opposite phase while
 * moving, and eases them back to neutral when idle. Purely cosmetic.
 */
export function useWalkCycle(
  limbsRef: RefObject<LimbHandles | null>,
  isMovingRef: RefObject<boolean>,
) {
  const phase = useRef(0)

  useFrame((_, delta) => {
    const limbs = limbsRef.current
    if (!limbs) return

    const moving = isMovingRef.current
    if (moving) phase.current += delta * SWING_FREQUENCY
    const target = Math.sin(phase.current) * SWING_AMPLITUDE

    // Legs swing opposite each other; each arm counters its same-side leg.
    applySwing(limbs.legLeft, target, moving)
    applySwing(limbs.legRight, -target, moving)
    applySwing(limbs.armLeft, -target, moving)
    applySwing(limbs.armRight, target, moving)
  })
}
