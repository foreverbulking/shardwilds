import { Canvas } from '@react-three/fiber'
import Player from './Player'
import CameraRig from './CameraRig'

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 5, 9], fov: 50 }}>
      <CameraRig />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#6b8f4e" />
      </mesh>
      <Player />
    </Canvas>
  )
}
