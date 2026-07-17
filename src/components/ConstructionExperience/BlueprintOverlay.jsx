import { useEffect, useRef } from 'react'

// Simple architectural elevation drawn as line paths: foundation, walls,
// roofline, door, windows, and a dimension line — the "blueprint" language.
const LINES = [
  'M 60 340 L 340 340',                       // ground line
  'M 90 340 L 90 200 L 200 130 L 310 200 L 310 340', // house outline + roof
  'M 90 200 L 310 200',                       // eave line
  'M 175 340 L 175 260 L 225 260 L 225 340',  // door
  'M 115 230 L 150 230 L 150 265 L 115 265 Z', // window left
  'M 250 230 L 285 230 L 285 265 L 250 265 Z', // window right
  'M 40 340 L 40 355 M 360 340 L 360 355 M 40 350 L 360 350', // dimension line
]

export default function BlueprintOverlay({ progressRef }) {
  const groupRef = useRef(null)
  const pathRefs = useRef([])
  const gridRef = useRef(null)

  useEffect(() => {
    pathRefs.current.forEach((path) => {
      if (!path) return
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length}`
    })
  }, [])

  useEffect(() => {
    let rafId
    const tick = () => {
      const p = progressRef.current || 0
      // Draw-on happens across the first ~32% of the section's scroll,
      // then the whole blueprint fades out gently by ~55% as real footage takes over.
      const drawT = Math.min(1, p / 0.32)
      const fadeT = 1 - Math.min(1, Math.max(0, (p - 0.34) / 0.22))

      pathRefs.current.forEach((path, i) => {
        if (!path) return
        const length = path.getTotalLength()
        const stagger = Math.min(1, Math.max(0, drawT * 1.3 - i * 0.1))
        path.style.strokeDashoffset = `${length * (1 - stagger)}`
      })

      if (groupRef.current) groupRef.current.style.opacity = fadeT
      if (gridRef.current) gridRef.current.style.opacity = fadeT * 0.4

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progressRef])

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <svg
        ref={gridRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      >
        <defs>
          <pattern id="blueprint-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#7fb3d5" strokeWidth="0.5" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
      </svg>

      <svg
        ref={groupRef}
        viewBox="0 0 400 400"
        className="w-[70vmin] h-[70vmin] max-w-2xl max-h-2xl"
        style={{ opacity: 1 }}
      >
        {LINES.map((d, i) => (
          <path
            key={i}
            ref={(el) => (pathRefs.current[i] = el)}
            d={d}
            fill="none"
            stroke="#e8cf82"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
        ))}
      </svg>
    </div>
  )
}
