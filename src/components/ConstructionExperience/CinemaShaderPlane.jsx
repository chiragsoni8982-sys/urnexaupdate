import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVideo;
  uniform vec2 uResolution;
  uniform vec2 uVideoResolution;
  uniform float uTime;
  uniform float uProgress;
  uniform float uAberration;
  uniform float uVignette;
  uniform float uGrain;

  // Standard object-fit: cover UV remap for a fullscreen quad
  vec2 coverUv(vec2 uv, vec2 screen, vec2 tex) {
    float screenRatio = screen.x / screen.y;
    float texRatio = tex.x / tex.y;
    vec2 scaledTex = screenRatio < texRatio
      ? vec2(tex.x * screen.y / tex.y, screen.y)
      : vec2(screen.x, tex.y * screen.x / tex.x);
    vec2 offset = (screenRatio < texRatio
      ? vec2((scaledTex.x - screen.x) * 0.5, 0.0)
      : vec2(0.0, (scaledTex.y - screen.y) * 0.5)) / scaledTex;
    return uv * screen / scaledTex + offset;
  }

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uVideoResolution);

    vec2 center = uv - 0.5;
    float dist = length(center);

    // Chromatic aberration: stronger at the start of the build, settling
    // down as the house completes — the image "comes into focus".
    float aberrationAmount = uAberration * (0.4 + dist * 1.6);
    vec2 dir = normalize(center + 0.0001);

    float r = texture2D(uVideo, uv + dir * aberrationAmount).r;
    float g = texture2D(uVideo, uv).g;
    float b = texture2D(uVideo, uv - dir * aberrationAmount).b;
    vec3 color = vec3(r, g, b);

    // Dynamic vignette: tighter/darker early, opens up toward the reveal
    float vignette = smoothstep(0.85, uVignette, dist);
    color *= 1.0 - vignette * 0.85;

    // Film grain
    float grain = (rand(uv * uResolution.xy * 0.75 + uTime) - 0.5) * uGrain;
    color += grain;

    // Subtle warm cinematic grade
    color = mix(color, color * vec3(1.05, 1.0, 0.92), 0.35);

    gl_FragColor = vec4(color, 1.0);
  }
`

export default function CinemaShaderPlane({ videoRef, naturalSize, progressRef }) {
  const meshRef = useRef(null)
  const { size, gl } = useThree()
  const textureRef = useRef(null)
  const [ready, setReady] = useState(false)

  const uniforms = useMemo(
    () => ({
      uVideo: { value: null },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uVideoResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uAberration: { value: 0.012 },
      uVignette: { value: 0.35 },
      uGrain: { value: 0.05 },
    }),
    []
  )

  useEffect(() => {
    uniforms.uResolution.value.set(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio())
  }, [size, gl, uniforms])

  useFrame((state) => {
    const video = videoRef.current
    if (!video) return

    if (!textureRef.current && video.readyState >= 2) {
      const tex = new THREE.VideoTexture(video)
      tex.colorSpace = THREE.SRGBColorSpace
      textureRef.current = tex
      uniforms.uVideo.value = tex
      setReady(true)
    }

    uniforms.uVideoResolution.value.set(naturalSize.current.width, naturalSize.current.height)
    uniforms.uTime.value = state.clock.elapsedTime

    const p = progressRef.current || 0
    uniforms.uProgress.value = p
    // Aberration + vignette ease off as the build progresses toward reveal
    uniforms.uAberration.value = THREE.MathUtils.lerp(0.02, 0.003, THREE.MathUtils.smoothstep(p, 0, 0.75))
    uniforms.uVignette.value = THREE.MathUtils.lerp(0.25, 0.5, THREE.MathUtils.smoothstep(p, 0, 0.75))
  })

  if (!ready) return null

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} depthTest={false} depthWrite={false} />
    </mesh>
  )
}
