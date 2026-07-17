import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { TESTIMONIALS } from '../../utils/constants'
import SectionReveal from '../SectionReveal/SectionReveal'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (paused) return
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, 5500)
    return () => clearInterval(timer.current)
  }, [paused])

  const t = TESTIMONIALS[index]

  return (
    <section className="relative py-28 md:py-36 px-6 md:px-10 bg-charcoal" style={{ background: 'var(--color-charcoal)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <SectionReveal>
          <p className="eyebrow mb-10">Client Voices</p>
        </SectionReveal>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative p-10 md:p-14 border border-white/10 backdrop-blur-sm rounded-sm min-h-[260px] flex flex-col items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Quote size={28} className="mb-6" style={{ color: 'var(--color-gold)' }} />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-xl md:text-2xl text-cream leading-relaxed" style={{ color: 'var(--color-cream)' }}>
                "{t.quote}"
              </p>
              <p className="mt-6 text-sm tracking-wide" style={{ color: 'var(--color-gold)' }}>
                {t.name}
              </p>
              <p className="text-xs text-cream/50 mt-1" style={{ color: 'rgba(245,245,245,0.5)' }}>
                {t.role}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className="w-2 h-2 rounded-full transition-colors focus-ring"
                style={{ background: i === index ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
