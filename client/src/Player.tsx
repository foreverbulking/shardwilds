export default function Player() {
  return (
    <group position={[0, 0, 0]}>
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
