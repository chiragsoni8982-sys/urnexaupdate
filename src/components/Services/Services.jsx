import { useRef } from 'react'
import gsap from 'gsap'
import { Building2, Landmark, Layers, Compass, ClipboardCheck, Gem } from 'lucide-react'
import { SERVICES } from '../../utils/constants'
import SectionReveal from '../SectionReveal/SectionReveal'

const ICONS = {
  residential: Building2,
  commercial: Landmark,
  fitout: Layers,
  planning: Compass,
  management: ClipboardCheck,
  villas: Gem,
}

function ServiceCard({ service, index }) {
  const cardRef = useRef(null)
  const Icon = ICONS[service.id]

  const handleMove = (e) => {
    const el = cardRef.current
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <SectionReveal delay={index * 0.08}>
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        data-cursor="hover"
        className="group relative p-8 border border-white/10 h-full will-change-transform hover:border-gold/60 transition-colors"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Icon
          size={32}
          className="mb-6 transition-transform duration-500 group-hover:scale-110"
          style={{ color: 'var(--color-gold)' }}
        />
        <h3 className="font-display text-2xl mb-3 text-cream" style={{ color: 'var(--color-cream)' }}>
          {service.title}
        </h3>
        <p className="text-cream/60 leading-relaxed" style={{ color: 'rgba(245,245,245,0.6)' }}>
          {service.description}
        </p>
      </div>
    </SectionReveal>
  )
}

export default function Services() {
  return (
    <section className="relative py-28 md:py-36 px-6 md:px-10 bg-navy" style={{ background: 'var(--color-navy)' }} id="services">
      <div className="max-w-7xl mx-auto">
        <SectionReveal className="mb-16 max-w-2xl">
          <p className="eyebrow mb-4">What We Do</p>
          <h2 className="font-display text-4xl md:text-6xl text-cream" style={{ color: 'var(--color-cream)' }}>
            Capabilities built for the long view.
          </h2>
        </SectionReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
