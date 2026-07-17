import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionReveal from '../SectionReveal/SectionReveal'
import MagneticButton from '../MagneticButton/MagneticButton'

const initialValues = { name: '', email: '', project: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please tell us your name.'
  if (!values.email.trim()) {
    errors.email = 'Please add an email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'That email address looks incomplete.'
  }
  if (!values.message.trim()) errors.message = 'Tell us a little about the project.'
  return errors
}

function Field({ label, id, error, children }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(245,245,245,0.5)' }}>
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs mt-1"
            style={{ color: '#e07a5f' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputClass =
  'w-full bg-transparent border-b border-white/20 py-3 text-cream focus:outline-none focus:border-gold transition-colors placeholder:text-cream/30'

export default function Contact() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
    }
  }

  return (
    <section className="relative py-28 md:py-36 px-6 md:px-10 bg-navy" style={{ background: 'var(--color-navy)' }} id="contact">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16">
        <SectionReveal>
          <p className="eyebrow mb-4">Start a Project</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6 text-cream" style={{ color: 'var(--color-cream)' }}>
            Tell us what you're building.
          </h2>
          <p className="text-cream/60 max-w-md" style={{ color: 'rgba(245,245,245,0.6)' }}>
            Share a few details and a principal from our studio will respond within one business day.
          </p>

          <div className="mt-12 aspect-video border border-white/10 flex items-center justify-center text-cream/30 text-sm" style={{ color: 'rgba(245,245,245,0.3)' }}>
            Map — 200 Meridian Avenue, New York, NY
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center border border-gold/30 p-10"
                style={{ borderColor: 'rgba(212,175,55,0.3)' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--color-gold)' }}>
                  <Check size={26} color="#0d1b2a" />
                </div>
                <h3 className="font-display text-2xl mb-2 text-cream" style={{ color: 'var(--color-cream)' }}>
                  Message received.
                </h3>
                <p className="text-cream/60" style={{ color: 'rgba(245,245,245,0.6)' }}>
                  Thank you, {values.name.split(' ')[0]}. We'll be in touch shortly.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-7"
              >
                <Field label="Name" id="name" error={errors.name}>
                  <input id="name" name="name" value={values.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
                </Field>
                <Field label="Email" id="email" error={errors.email}>
                  <input id="email" name="email" type="email" value={values.email} onChange={handleChange} className={inputClass} placeholder="you@company.com" />
                </Field>
                <Field label="Project Type" id="project">
                  <input id="project" name="project" value={values.project} onChange={handleChange} className={inputClass} placeholder="e.g. Private residence" />
                </Field>
                <Field label="Message" id="message" error={errors.message}>
                  <textarea id="message" name="message" rows={4} value={values.message} onChange={handleChange} className={inputClass} placeholder="Tell us about the site, scope, and timeline." />
                </Field>

                <MagneticButton
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 text-xs tracking-[0.2em] uppercase"
                  style={{ background: 'var(--color-gold)', color: 'var(--color-navy-deep)' }}
                >
                  Send Message
                </MagneticButton>
              </motion.form>
            )}
          </AnimatePresence>
        </SectionReveal>
      </div>
    </section>
  )
}
