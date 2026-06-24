import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import Player from './Player'
import CameraRig from './CameraRig'

export default function Scene() {
  const playerPosition = useRef(new Vector3(0, 0, 0))

  return (
    <Canvas
      camera={{ position: [0, 3, 6], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      shadows
    >
      <color attach="background" args={['#1a1a2e']} />
      <fog attach="fog" args={['#1a1a2e', 15, 40]} />
      <CameraRig targetRef={playerPosition} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight args={['#87ceeb', '#2d4a1e', 0.4]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#6b8f4e" />
      </mesh>
      <Player positionRef={playerPosition} />
    </Canvas>
  )
}
