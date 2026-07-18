import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PROJECTS } from '../../utils/constants'
import SectionReveal from '../SectionReveal/SectionReveal'

const GRADIENTS = [
  'linear-gradient(135deg, #1c2a3a, #0d1b2a)',
  'linear-gradient(135deg, #2b2117, #121212)',
  'linear-gradient(135deg, #223226, #0d1b2a)',
  'linear-gradient(135deg, #2a2016, #121212)',
]

function ProjectCard({ project, index }) {
  const imgRef = useRef(null)

  const handleMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14
    imgRef.current.style.transform = `scale(1.08) translate(${x}px, ${y}px)`
  }
  const handleLeave = () => {
    imgRef.current.style.transform = 'scale(1) translate(0,0)'
  }

  // Uses a real photo if `project.image` is set; otherwise falls back to the
  // gradient placeholder so the card never breaks while photos are added
  // one at a time.
  const backgroundStyle = project.image
    ? { backgroundImage: `url(${project.image})` }
    : { background: GRADIENTS[index % GRADIENTS.length] }

  return (
    <SectionReveal delay={index * 0.06} y={60}>
      <a
        href="#"
        data-cursor="hover"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group block relative overflow-hidden aspect-[4/3] focus-ring"
      >
        <div
          ref={imgRef}
          className="absolute inset-0 transition-transform duration-500 ease-out bg-cover bg-center"
          style={backgroundStyle}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <p className="eyebrow mb-2">{project.category}</p>
          <h3 className="font-display text-3xl md:text-4xl text-white flex items-center gap-3">
            {project.title}
            <ArrowUpRight
              size={24}
              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400"
              style={{ color: 'var(--color-gold)' }}
            />
          </h3>
          <p className="text-white/60 mt-1 text-sm">{project.location} — {project.year}</p>
        </div>
      </a>
    </SectionReveal>
  )
}

export default function Projects() {
  return (
    <section className="relative py-28 md:py-36 px-6 md:px-10 bg-charcoal" style={{ background: 'var(--color-charcoal)' }} id="work">
      <div className="max-w-7xl mx-auto">
        <SectionReveal className="mb-16 flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Selected Work</p>
            <h2 className="font-display text-4xl md:text-6xl text-cream" style={{ color: 'var(--color-cream)' }}>
              Landmarks already standing.
            </h2>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
