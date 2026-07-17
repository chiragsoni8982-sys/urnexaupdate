export default function Site() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color="#7a8266" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]} receiveShadow>
        <planeGeometry args={[16, 13]} />
        <meshStandardMaterial color="#33302a" roughness={1} />
      </mesh>
    </>
  )
}
