import { useEffect, useRef } from 'react'

/**
 * Tracks normalized pointer position (-1 to 1 on each axis) in a ref so
 * consumers (e.g. a Three.js camera rig) can read it inside useFrame
 * without triggering React re-renders on every mouse move.
 */
export function useMouseParallax() {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return pointer
}
