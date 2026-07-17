import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fades and lifts children into place as they enter the viewport.
 * `y` controls travel distance, `delay` staggers groups of reveals.
 */
export default function SectionReveal({ children, className = '', y = 40, delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [y, delay])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
