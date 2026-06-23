import { useEffect, useRef } from 'react'

export interface MoveInput {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
}

/** Tracks WASD / arrow key state in a ref (no re-renders). Client-only input. */
export function useWASD() {
  const input = useRef<MoveInput>({
    forward: false,
    back: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const setKey = (code: string, pressed: boolean) => {
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
    const onKeyDown = (event: KeyboardEvent) => setKey(event.code, true)
    const onKeyUp = (event: KeyboardEvent) => setKey(event.code, false)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return input
}
