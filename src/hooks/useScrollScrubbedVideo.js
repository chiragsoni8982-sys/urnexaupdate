import { useEffect, useRef } from 'react'

/**
 * Creates a video element (not rendered visibly — consumed as a texture
 * elsewhere) and ties its currentTime to scroll progress. Returns the video
 * ref plus a ref holding its natural width/height once known, so a shader
 * can do correct "object-fit: cover" math.
 */
export function useScrollScrubbedVideo(src, progressRef) {
  const videoRef = useRef(null)
  const naturalSize = useRef({ width: 1, height: 1 })
  const smoothedRef = useRef(0)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = src
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.loop = false
    video.style.position = 'fixed'
    video.style.width = '2px'
    video.style.height = '2px'
    video.style.opacity = '0'
    video.style.pointerEvents = 'none'
    video.style.left = '-9999px'
    document.body.appendChild(video)
    videoRef.current = video

    const handleLoaded = () => {
      naturalSize.current = { width: video.videoWidth || 1, height: video.videoHeight || 1 }
      const playPromise = video.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => video.pause()).catch(() => {})
      }
    }
    video.addEventListener('loadedmetadata', handleLoaded)

    let rafId
    let lastApplied = -1
    const tick = () => {
      const target = progressRef.current || 0
      smoothedRef.current += (target - smoothedRef.current) * 0.15
      const duration = video.duration || 0
      if (duration > 0) {
        const time = smoothedRef.current * duration
        if (Math.abs(time - lastApplied) > 0.008) {
          video.currentTime = time
          lastApplied = time
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      video.removeEventListener('loadedmetadata', handleLoaded)
      video.pause()
      video.src = ''
      if (video.parentNode) video.parentNode.removeChild(video)
    }
  }, [src, progressRef])

  return { videoRef, naturalSize }
}
