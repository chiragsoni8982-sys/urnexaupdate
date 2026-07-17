import SectionReveal from './SectionReveal/SectionReveal'

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="pt-40 pb-16 px-6 md:px-10 bg-navy" style={{ background: 'var(--color-navy)' }}>
      <div className="max-w-4xl mx-auto">
        <SectionReveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="font-display text-4xl md:text-6xl text-cream mb-6" style={{ color: 'var(--color-cream)' }}>
            {title}
          </h1>
          {description && (
            <p className="text-cream/60 max-w-xl" style={{ color: 'rgba(245,245,245,0.6)' }}>
              {description}
            </p>
          )}
        </SectionReveal>
      </div>
    </section>
  )
}
