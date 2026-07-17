import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouseParallax } from '../../hooks/useMouseParallax'

// Camera keyframes pulled back further to frame the wider bungalow, garden,
// and pool all together by the final reveal.
const KEYFRAMES = [
  { p: 0, pos: [13, 5, 15], look: [0, 0.5, 0] },
  { p: 0.13, pos: [11, 2.5, 12], look: [0, -0.2, 0] },
  { p: 0.32, pos: [9.5, 3, 11], look: [0, 1.2, 0] },
  { p: 0.56, pos: [8.5, 3.6, 10], look: [1, 1.6, 0] },
  { p: 0.75, pos: [10, 4.4, 11.5], look: [2, 1.8, 0] },
  { p: 0.9, pos: [13, 5.5, 14], look: [3, 1.6, -1] },
  { p: 1, pos: [16, 6.5, 17], look: [3, 1.4, -1] },
]

function sampleKeyframes(p) {
  if (p <= KEYFRAMES[0].p) return KEYFRAMES[0]
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i]
    const b = KEYFRAMES[i + 1]
    if (p >= a.p && p <= b.p) {
      const t = (p - a.p) / (b.p - a.p)
      return {
        pos: a.pos.map((v, idx) => THREE.MathUtils.lerp(v, b.pos[idx], t)),
        look: a.look.map((v, idx) => THREE.MathUtils.lerp(v, b.look[idx], t)),
      }
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1]
}

export default function CameraRig({ progressRef }) {
  const smoothed = useRef(0)
  const pointer = useMouseParallax()
  const lookTarget = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    smoothed.current = THREE.MathUtils.damp(smoothed.current, progressRef.current, 3, delta)
    const { pos, look } = sampleKeyframes(smoothed.current)

    const parallaxX = pointer.current.x * 0.5
    const parallaxY = pointer.current.y * 0.25

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, pos[0] + parallaxX, 4, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, pos[1] + parallaxY, 4, delta)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, pos[2], 4, delta)

    lookTarget.current.lerp(new THREE.Vector3(...look), 0.05)
    state.camera.lookAt(lookTarget.current)
  })

  return null
}
