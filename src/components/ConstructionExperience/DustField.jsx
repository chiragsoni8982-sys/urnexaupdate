import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function DustField({ count = 220 }) {
  const points = useRef(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 2
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2
      arr[i * 3 + 2] = 0
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!points.current) return
    const arr = points.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.0006
      arr[i * 3] += Math.sin(t * 0.3 + i) * 0.00015
      if (arr[i * 3 + 1] > 1) arr[i * 3 + 1] = -1
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.006} color="#e8cf82" transparent opacity={0.4} sizeAttenuation={false} depthWrite={false} blending={2} />
    </points>
  )
}
