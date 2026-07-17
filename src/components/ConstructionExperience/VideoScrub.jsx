import { useEffect, useRef } from 'react'

/**
 * Renders a video whose playback position is driven entirely by scroll
 * progress (0..1) rather than by autoplay. This is the "scrub" technique
 * used on sites like loftthirtyone.com — scrolling forward plays the video
 * forward, scrolling back rewinds it, frame-accurately.
 *
 * `progressRef` should be a ref whose `.current` is a 0..1 number, updated
 * every frame elsewhere (e.g. by GSAP ScrollTrigger via useScrollProgress).
 */
export default function VideoScrub({ src, progressRef, className = '', objectFit = 'cover', style }) {
  const videoRef = useRef(null)
  const smoothedRef = useRef(0)
  const durationRef = useRef(0)
  const rafRef = useRef(null)
  const lastAppliedRef = useRef(-1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoaded = () => {
      durationRef.current = video.duration || 0
      // iOS Safari refuses to let JS scrub currentTime until the video has
      // been "played" at least once. Playing then immediately pausing
      // unlocks scrubbing without the user ever seeing it move.
      const playPromise = video.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => video.pause()).catch(() => {})
      }
    }

    video.addEventListener('loadedmetadata', handleLoaded)
    if (video.readyState >= 1) handleLoaded()

    const tick = () => {
      const target = progressRef.current || 0
      // Damped follow so fast scroll flicks feel cinematic, not jumpy.
      smoothedRef.current += (target - smoothedRef.current) * 0.15

      const duration = durationRef.current
      if (duration > 0) {
        const time = smoothedRef.current * duration
        if (Math.abs(time - lastAppliedRef.current) > 0.008) {
          video.currentTime = time
          lastAppliedRef.current = time
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded)
      cancelAnimationFrame(rafRef.current)
    }
  }, [progressRef])

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      className={`absolute inset-0 w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      style={style}
    />
  )
}
