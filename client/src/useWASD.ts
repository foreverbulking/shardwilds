import { useEffect, useRef } from 'react'

export interface PlayerInput {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
  /** Edge-triggered: set true once per Space press, consumed by the player. */
  jumpRequested: boolean
}

/** Tracks movement keys + an edge-triggered jump in a ref (no re-renders). */
export function useWASD() {
  const input = useRef<PlayerInput>({
    forward: false,
    back: false,
    left: false,
    right: false,
    jumpRequested: false,
  })
  const jumpHeld = useRef(false)

  useEffect(() => {
    const setMove = (code: string, pressed: boolean) => {
      switch (code) {
        case 'KeyW':
        case 'ArrowUp':
          input.current.forward = pressed
          break
        case 'KeyS':
        case 'ArrowDown':
          input.current.back = pressed
          break
        case 'KeyA':
        case 'ArrowLeft':
          input.current.left = pressed
          break
        case 'KeyD':
        case 'ArrowRight':
          input.current.right = pressed
          break
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        // Edge trigger: one jump per press, ignore key auto-repeat.
        if (!jumpHeld.current) {
          input.current.jumpRequested = true
          jumpHeld.current = true
        }
        return
      }
      setMove(event.code, true)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        jumpHeld.current = false
        return
      }
      setMove(event.code, false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return input
}
