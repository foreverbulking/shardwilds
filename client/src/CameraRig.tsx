import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

// Fixed follow offset and look target for now. STORY-024 will drive the
// look target from the live player position so the camera actually follows.
const CAMERA_OFFSET = new Vector3(0, 4, 8)
const LOOK_TARGET = new Vector3(0, 1, 0)

export default function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    camera.position.lerp(CAMERA_OFFSET, 0.1)
    camera.lookAt(LOOK_TARGET)
  })

  return null
}
