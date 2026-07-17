import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronDown } from 'lucide-react'
import HeroScene from './HeroScene'

export default function Hero() {
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const eyebrowRef = useRef(null)

  useEffect(() => {
    const words = headlineRef.current.querySelectorAll('.word')
    const tl = gsap.timeline({ delay: 2.6, defaults: { ease: 'power4.out' } })
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo(words, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08 }, '-=0.4')
      .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-navy-deep/40" style={{ background: 'linear-gradient(to top, var(--color-navy-deep), transparent 55%, rgba(6,13,21,0.4))' }} />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p ref={eyebrowRef} className="eyebrow mb-6 opacity-0">
          URBNEXA — Est. 1998
        </p>
        <h1
          ref={headlineRef}
          className="font-display text-cream text-[13vw] leading-[0.95] md:text-[6.5vw] max-w-5xl"
          style={{ color: 'var(--color-cream)' }}
        >
          <span className="block overflow-hidden">
            <span className="word inline-block">Building</span>
          </span>
          <span className="block overflow-hidden">
            <span className="word inline-block">Tomorrow&rsquo;s</span>{' '}
            <span className="word inline-block italic" style={{ color: 'var(--color-gold)' }}>
              Landmarks.
            </span>
          </span>
        </h1>
        <p
          ref={subRef}
          className="mt-8 max-w-xl text-cream/70 text-lg opacity-0"
          style={{ color: 'rgba(245,245,245,0.7)' }}
        >
          Luxury construction solutions designed with precision.
        </p>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 text-cream/50" style={{ color: 'rgba(245,245,245,0.5)' }}>
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  )
}
