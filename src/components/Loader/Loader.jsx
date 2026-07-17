import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Loader({ onFinish }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const rootRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    const counter = { val: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => {
            setDone(true)
            onFinish?.()
          },
        })
      },
    })

    tl.to(counter, {
      val: 100,
      duration: 2.4,
      ease: 'power2.inOut',
      onUpdate: () => setProgress(Math.round(counter.val)),
    })
      .to(barRef.current, { scaleX: 1, duration: 2.4, ease: 'power2.inOut' }, 0)
      .to({}, { duration: 0.3 })

    return () => tl.kill()
  }, [onFinish])

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-navy-deep"
      style={{ background: 'var(--color-navy-deep)' }}
      aria-hidden="true"
    >
      <div className="flex items-end gap-1 overflow-hidden">
        {'URBNEXA'.split('').map((letter, i) => (
          <span
            key={i}
            className="font-display text-4xl md:text-6xl text-cream inline-block"
            style={{
              color: 'var(--color-cream)',
              opacity: progress > i * 12 ? 1 : 0.15,
              transform: progress > i * 12 ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="mt-8 w-56 h-px bg-white/10 overflow-hidden">
        <div
          ref={barRef}
          className="h-full origin-left"
          style={{ background: 'var(--color-gold)', transform: 'scaleX(0)' }}
        />
      </div>
      <p className="mt-4 text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
        {progress}%
      </p>
    </div>
  )
}
