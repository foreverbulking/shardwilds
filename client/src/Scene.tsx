import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import Player from './Player'
import CameraRig from './CameraRig'

export default function Scene() {
  const playerPosition = useRef(new Vector3(0, 0, 0))

  return (
    <Canvas camera={{ position: [0, 5, 9], fov: 50 }}>
      <CameraRig targetRef={playerPosition} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#6b8f4e" />
      </mesh>
      <Player positionRef={playerPosition} />
    </Canvas>
  )
}
