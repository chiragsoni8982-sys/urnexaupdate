import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function CloudPuff({ position, scale }) {
  return (
    <group position={position} scale={scale}>
      {[
        [0, 0, 0, 1],
        [0.6, 0.1, 0.1, 0.75],
        [-0.6, 0.05, -0.1, 0.7],
        [0.2, 0.25, 0.3, 0.6],
        [-0.3, 0.2, -0.2, 0.55],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={s}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#f4f6f8" roughness={1} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export default function Clouds({ count = 6 }) {
  const groupRef = useRef(null)

  const clouds = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        z: -18 - Math.random() * 14,
        y: 9 + Math.random() * 4,
        startX: -30 + Math.random() * 60,
        scale: 1.6 + Math.random() * 1.8,
        speed: 0.15 + Math.random() * 0.15,
      })),
    [count]
  )

  const refs = useRef([])

  useFrame((_, delta) => {
    refs.current.forEach((el, i) => {
      if (!el) return
      el.position.x += clouds[i].speed * delta
      if (el.position.x > 32) el.position.x = -32
    })
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <group key={c.id} ref={(el) => (refs.current[i] = el)} position={[c.startX, c.y, c.z]}>
          <CloudPuff position={[0, 0, 0]} scale={c.scale} />
        </group>
      ))}
    </group>
  )
}
