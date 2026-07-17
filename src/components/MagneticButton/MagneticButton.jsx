import { useRef } from 'react'
import gsap from 'gsap'

export default function MagneticButton({ children, className = '', as: Tag = 'button', ...props }) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    gsap.to(el, { x: relX * 0.35, y: relY * 0.35, duration: 0.5, ease: 'power3.out' })
  }

  const handleLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="hover"
      className={`focus-ring inline-flex items-center justify-center will-change-transform ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
