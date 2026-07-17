import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouseParallax } from '../../hooks/useMouseParallax'

function Dust({ count = 400 }) {
  const points = useRef(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = Math.random() * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.y = state.clock.elapsedTime * 0.01
    const arr = points.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.002
      if (arr[i * 3 + 1] > 8) arr[i * 3 + 1] = 0
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#d4af37" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function CraneSilhouette({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.15, 6, 0.15]} />
        <meshStandardMaterial color="#1c2a3a" roughness={0.8} />
      </mesh>
      <mesh position={[1.4, 5.8, 0]}>
        <boxGeometry args={[3, 0.12, 0.12]} />
        <meshStandardMaterial color="#1c2a3a" roughness={0.8} />
      </mesh>
      <mesh position={[-0.6, 5.9, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#1c2a3a" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[60, 60, 1, 1]} />
      <meshStandardMaterial color="#0a1420" roughness={1} />
    </mesh>
  )
}

function Rig() {
  const pointer = useMouseParallax()
  useFrame((state) => {
    const cam = state.camera
    cam.position.x += (pointer.current.x * 1.2 - cam.position.x) * 0.03
    cam.position.y += (2 + pointer.current.y * 0.4 - cam.position.y) * 0.03
    cam.lookAt(0, 2, 0)
  })
  return null
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 2, 12], fov: 45 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#0d1b2a']} />
      <fog attach="fog" args={['#0d1b2a', 10, 32]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.4}
        color="#f5e6c8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Ground />
      <CraneSilhouette position={[-4, 0, -3]} />
      <CraneSilhouette position={[5, 0, -6]} />
      <Dust />
      <Rig />
    </Canvas>
  )
}
