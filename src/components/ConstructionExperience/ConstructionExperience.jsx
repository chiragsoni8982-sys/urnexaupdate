import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, DepthOfField } from '@react-three/postprocessing'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { CONSTRUCTION_STAGES } from '../../utils/constants'
import Building from './Building'
import CameraRig from './CameraRig'
import Site from './Site'
import Clouds from './Clouds'

export default function ConstructionExperience() {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const progressRef = useScrollProgress(sectionRef, {
    end: '+=550%',
    onUpdate: (p) => {
      const idx = Math.min(CONSTRUCTION_STAGES.length - 1, Math.floor(p * CONSTRUCTION_STAGES.length))
      setActiveIndex((prev) => (prev !== idx ? idx : prev))
    },
  })

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-navy" style={{ background: 'var(--color-navy)' }}>
      <div className="absolute inset-0">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [13, 5, 15], fov: 40 }} gl={{ antialias: true }}>
          <color attach="background" args={['#8fb8d6']} />
          <fog attach="fog" args={['#8fb8d6', 20, 46]} />
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[10, 14, 8]}
            intensity={1.7}
            color="#fff3d6"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-16}
            shadow-camera-right={16}
            shadow-camera-top={16}
            shadow-camera-bottom={-16}
          />
          <hemisphereLight args={['#bcdcf0', '#0a0f16', 0.6]} />

          <Clouds />
          <Site />
          <Building progressRef={progressRef} />
          <CameraRig progressRef={progressRef} />

          <EffectComposer multisampling={0}>
            <DepthOfField focusDistance={0.01} focalLength={0.018} bokehScale={2} height={480} />
            <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.2} intensity={0.45} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-transparent to-transparent pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(6,13,21,0.85), transparent 55%)' }} />

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10">
        <div className="flex items-start justify-between">
          <p className="eyebrow">The Build</p>
          <p className="eyebrow">{String(activeIndex + 1).padStart(2, '0')} / {String(CONSTRUCTION_STAGES.length).padStart(2, '0')}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2
            key={activeIndex}
            className="font-display text-cream text-3xl md:text-5xl text-center transition-opacity duration-500"
            style={{ color: 'var(--color-cream)' }}
          >
            {CONSTRUCTION_STAGES[activeIndex].label}
          </h2>
          <div className="w-64 h-px bg-white/15 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold transition-all duration-300"
              style={{ background: 'var(--color-gold)', width: `${((activeIndex + 1) / CONSTRUCTION_STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
