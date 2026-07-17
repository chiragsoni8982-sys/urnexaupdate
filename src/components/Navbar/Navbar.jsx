import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS, BRAND } from '../../utils/constants'
import MagneticButton from '../MagneticButton/MagneticButton'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-80 transition-colors duration-500 ${
        scrolled ? 'bg-navy-deep/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
      style={{ background: scrolled ? 'rgba(6,13,21,0.8)' : 'transparent' }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-20">
        <Link to="/" className="font-display text-xl tracking-widest text-cream" style={{ color: 'var(--color-cream)' }}>
          {BRAND.name}
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                data-cursor="hover"
                className="text-sm tracking-wide text-cream/80 hover:text-gold transition-colors focus-ring"
                style={{ color: 'rgba(245,245,245,0.8)' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <MagneticButton
          as={Link}
          to="/contact"
          className="hidden md:inline-flex px-5 py-2.5 text-xs tracking-[0.2em] uppercase border border-gold text-gold hover:bg-gold hover:text-navy-deep transition-colors"
          style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
        >
          Start a Project
        </MagneticButton>

        <button
          className="md:hidden text-cream focus-ring"
          style={{ color: 'var(--color-cream)' }}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-6 pb-8 bg-navy-deep/95" style={{ background: 'rgba(6,13,21,0.97)' }}>
          <ul className="flex flex-col gap-5 pt-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-lg text-cream" style={{ color: 'var(--color-cream)' }}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="text-lg" style={{ color: 'var(--color-gold)' }}>
                Start a Project
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
