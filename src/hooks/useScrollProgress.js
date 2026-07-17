import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pins `triggerRef` for the given scroll distance and reports 0..1 progress
 * into a mutable ref (no re-renders) plus an optional onUpdate callback for
 * things that do need React state (like a progress bar label).
 */
export function useScrollProgress(triggerRef, { end = '+=400%', onUpdate } = {}) {
  const progress = useRef(0)

  useEffect(() => {
    if (!triggerRef.current) return

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top top',
      end,
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      onUpdate: (self) => {
        progress.current = self.progress
        onUpdate?.(self.progress)
      },
    })

    return () => st.kill()
  }, [triggerRef, end, onUpdate])

  return progress
}
