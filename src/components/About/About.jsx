import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STATS } from '../../utils/constants'
import SectionReveal from '../SectionReveal/SectionReveal'

gsap.registerPlugin(ScrollTrigger)

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const counter = { val: 0 }
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        val: value,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => setDisplay(Math.round(counter.val)),
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [value])

  return (
    <span ref={ref} className="font-display text-5xl md:text-6xl" style={{ color: 'var(--color-gold)' }}>
      {display}
      {suffix}
    </span>
  )
}

export default function About() {
  return (
    <section className="relative py-28 md:py-36 px-6 md:px-10 bg-navy" style={{ background: 'var(--color-navy)' }} id="about">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <SectionReveal>
          <p className="eyebrow mb-4">The Studio</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6 text-cream" style={{ color: 'var(--color-cream)' }}>
            Twenty-seven years of turning ambitious sites into architecture people remember.
          </h2>
          <p className="text-cream/60 leading-relaxed max-w-lg" style={{ color: 'rgba(245,245,245,0.6)' }}>
            URBNEXA was founded on a simple premise: that a construction company can hold itself to the
            same standard of craft as the architects and clients it works alongside. We plan, engineer,
            and build with that premise intact on every project, from single residences to civic landmarks.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-2 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <SectionReveal key={stat.label} delay={i * 0.08}>
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-cream/60 tracking-wide" style={{ color: 'rgba(245,245,245,0.6)' }}>
                {stat.label}
              </p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
