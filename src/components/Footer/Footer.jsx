import { Link } from 'react-router-dom'
import { Globe, Link2, Mail } from 'lucide-react'
import { BRAND, NAV_LINKS } from '../../utils/constants'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-deep" style={{ background: 'var(--color-navy-deep)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-display text-3xl text-cream" style={{ color: 'var(--color-cream)' }}>
            {BRAND.name}
          </h3>
          <p className="mt-4 max-w-sm text-cream/60" style={{ color: 'rgba(245,245,245,0.6)' }}>
            {BRAND.tagline}
          </p>
          <div className="flex gap-4 mt-6">
            {[Globe, Link2, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                data-cursor="hover"
                aria-label="Social link"
                className="w-10 h-10 flex items-center justify-center border border-white/15 rounded-full hover:border-gold hover:text-gold transition-colors"
                style={{ color: 'var(--color-cream)' }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Navigate</p>
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-cream/70 hover:text-gold transition-colors" style={{ color: 'rgba(245,245,245,0.7)' }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Stud  io</p>
          <address className="not-italic text-cream/70 space-y-2" style={{ color: 'rgba(245,245,245,0.7)' }}>
            <p>udaipur,rajasthan</p>
            <p>udaipur,313001</p>
            <p>hello@urbnexa.com</p>
            <p>+1 (212) 555 0148</p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-cream/40" style={{ color: 'rgba(245,245,245,0.4)' }}>
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  )
}
