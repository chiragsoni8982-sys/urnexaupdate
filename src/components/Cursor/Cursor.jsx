import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches
    if (!isFine) return

    const dot = dotRef.current
    const ring = ringRef.current
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }

    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      gsap.set(dot, { x: pos.x, y: pos.y })
    }

    const ticker = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      gsap.set(ring, { x: ringPos.x, y: ringPos.y })
    }

    const grow = () => gsap.to(ring, { scale: 2.2, duration: 0.35, ease: 'power2.out' })
    const shrink = () => gsap.to(ring, { scale: 1, duration: 0.35, ease: 'power2.out' })

    window.addEventListener('pointermove', move)
    gsap.ticker.add(ticker)

    const interactive = document.querySelectorAll('a, button, [data-cursor="hover"]')
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('pointermove', move)
      gsap.ticker.remove(ticker)
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [])

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-90">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'var(--color-gold)' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border -translate-x-1/2 -translate-y-1/2"
        style={{ borderColor: 'var(--color-gold)' }}
      />
    </div>
  )
}
