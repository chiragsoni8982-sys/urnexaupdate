import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function stageT(global, start, end) {
  const raw = THREE.MathUtils.clamp((global - start) / (end - start), 0, 1)
  return raw * raw * (3 - 2 * raw)
}

// Wide, low-slung bungalow massing — deliberately generous footprint so the
// house reads as grand and fills the frame instead of looking like a box
// floating in empty space.
const FLOOR_H = 2.6
const W = 11        // width (x)
const D = 7.5        // depth (z)
const ROOF_OVERHANG = 1.6

export default function Building({ progressRef }) {
  const foundation = useRef(null)
  const columns = useRef([])
  const ringBeams = useRef([])
  const walls = useRef([])
  const glass = useRef([])
  const roof = useRef(null)
  const roofTrim = useRef([])
  const lawn = useRef(null)
  const hedges = useRef([])
  const trees = useRef([])
  const flowerBeds = useRef([])
  const path = useRef([])
  const poolBasin = useRef(null)
  const poolWater = useRef(null)
  const poolDeck = useRef(null)
  const glow = useRef(null)

  const smoothed = useRef(0)

  useFrame((_, delta) => {
    const target = progressRef.current
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target, 4, delta)
    const p = smoothed.current

    // Stage 1 — Foundation slab rises from below grade
    const tFoundation = stageT(p, 0.02, 0.13)
    if (foundation.current) {
      foundation.current.position.y = THREE.MathUtils.lerp(-1.3, 0, tFoundation)
      foundation.current.material.opacity = tFoundation
    }

    // Stage 2 — Perimeter + portico columns extrude upward
    const tColumns = stageT(p, 0.11, 0.23)
    columns.current.forEach((col, i) => {
      if (!col) return
      const stagger = THREE.MathUtils.clamp(tColumns * 1.4 - i * 0.05, 0, 1)
      col.scale.y = Math.max(stagger, 0.001)
      col.position.y = (FLOOR_H * stagger) / 2
    })

    // Stage 3 — Ring beam / roof support frame
    const tBeams = stageT(p, 0.21, 0.32)
    ringBeams.current.forEach((beam, i) => {
      if (!beam) return
      const stagger = THREE.MathUtils.clamp(tBeams * 1.5 - i * 0.15, 0, 1)
      const axis = beam.userData.growAxis
      beam.scale[axis] = Math.max(stagger, 0.001)
      beam.material.opacity = stagger
    })

    // Stage 4 — Walls rise on all four sides
    const tWalls = stageT(p, 0.3, 0.46)
    walls.current.forEach((wall, i) => {
      if (!wall) return
      const stagger = THREE.MathUtils.clamp(tWalls * 1.5 - i * 0.1, 0, 1)
      wall.scale.y = Math.max(stagger, 0.001)
      wall.position.y = (FLOOR_H * stagger) / 2
    })

    // Stage 5 — Floor-to-ceiling glass fades + slides into openings
    const tGlass = stageT(p, 0.44, 0.56)
    glass.current.forEach((pane, i) => {
      if (!pane) return
      const stagger = THREE.MathUtils.clamp(tGlass * 1.5 - i * 0.06, 0, 1)
      pane.material.opacity = stagger * 0.9
      pane.position.z = pane.userData.baseZ + (1 - stagger) * 0.5 * pane.userData.dir
    })

    // Stage 6 — Wide overhanging roof slides down into place
    const tRoof = stageT(p, 0.54, 0.66)
    if (roof.current) {
      roof.current.position.y = THREE.MathUtils.lerp(FLOOR_H + 3.5, FLOOR_H + 0.35, tRoof)
      roof.current.material.opacity = tRoof
    }

    // Stage 7 — Cladding + gold roof trim, walls warm from raw concrete to finished stone
    const tCladding = stageT(p, 0.64, 0.75)
    roofTrim.current.forEach((trim) => {
      if (!trim) return
      trim.material.opacity = tCladding
    })
    walls.current.forEach((wall) => {
      if (!wall) return
      wall.material.color.lerpColors(new THREE.Color('#48505a'), new THREE.Color('#ece6d8'), tCladding)
    })

    // Stage 8 — Lush garden: lawn, hedges, trees, flower beds, path
    const tGarden = stageT(p, 0.73, 0.88)
    if (lawn.current) lawn.current.material.opacity = tGarden
    hedges.current.forEach((hedge, i) => {
      if (!hedge) return
      hedge.scale.setScalar(THREE.MathUtils.clamp(tGarden * 1.4 - i * 0.05, 0, 1))
    })
    trees.current.forEach((tree, i) => {
      if (!tree) return
      tree.scale.setScalar(THREE.MathUtils.clamp(tGarden * 1.3 - i * 0.12, 0, 1))
    })
    flowerBeds.current.forEach((bed, i) => {
      if (!bed) return
      bed.scale.setScalar(THREE.MathUtils.clamp(tGarden * 1.5 - i * 0.08, 0, 1))
    })
    path.current.forEach((tile, i) => {
      if (!tile) return
      tile.scale.setScalar(THREE.MathUtils.clamp(tGarden * 1.8 - i * 0.1, 0, 1))
    })

    // Stage 9 — Swimming pool fills with water + final reveal glow
    const tPool = stageT(p, 0.84, 0.97)
    if (poolBasin.current) poolBasin.current.material.opacity = THREE.MathUtils.clamp(tPool * 2, 0, 1)
    if (poolDeck.current) poolDeck.current.material.opacity = THREE.MathUtils.clamp(tPool * 2, 0, 1)
    if (poolWater.current) {
      poolWater.current.position.y = THREE.MathUtils.lerp(-0.55, -0.08, tPool)
      poolWater.current.material.opacity = tPool * 0.92
    }

    const tReveal = stageT(p, 0.9, 1)
    if (glow.current) glow.current.intensity = THREE.MathUtils.lerp(0, 2.6, tReveal)
  })

  const halfW = W / 2
  const halfD = D / 2

  const columnPositions = [
    [-halfW, -halfD], [-halfW * 0.5, -halfD], [halfW * 0.5, -halfD], [halfW, -halfD],
    [-halfW, halfD], [halfW, halfD],
    [-halfW * 0.5, halfD + 1.8], [halfW * 0.5, halfD + 1.8], // portico columns
  ]

  const windowSpansFront = [-3.6, -1.9, 1.9, 3.6]

  return (
    <group position={[0, -0.5, 0]}>
      {/* Foundation slab */}
      <mesh ref={foundation} receiveShadow position={[0, -1.3, 0]}>
        <boxGeometry args={[W + 1.5, 0.4, D + 1.5]} />
        <meshStandardMaterial color="#5c5c5c" roughness={0.9} transparent opacity={0} />
      </mesh>

      {/* Columns */}
      {columnPositions.map((pos, i) => (
        <mesh key={`col-${i}`} ref={(el) => (columns.current[i] = el)} position={[pos[0], 0, pos[1]]} scale={[1, 0.001, 1]} castShadow>
          <boxGeometry args={[0.28, FLOOR_H, 0.28]} />
          <meshStandardMaterial color="#9a9fa6" roughness={0.5} metalness={0.35} />
        </mesh>
      ))}

      {/* Ring beam around the whole perimeter */}
      {[
        { pos: [0, FLOOR_H, -halfD], size: [W, 0.14, 1], axis: 'x' },
        { pos: [0, FLOOR_H, halfD], size: [W, 0.14, 1], axis: 'x' },
        { pos: [-halfW, FLOOR_H, 0], size: [1, 0.14, D], axis: 'z' },
        { pos: [halfW, FLOOR_H, 0], size: [1, 0.14, D], axis: 'z' },
      ].map((b, i) => (
        <mesh
          key={`beam-${i}`}
          ref={(el) => {
            if (el) el.userData.growAxis = b.axis
            ringBeams.current[i] = el
          }}
          position={b.pos}
          scale={b.axis === 'x' ? [0.001, 1, 1] : [1, 1, 0.001]}
        >
          <boxGeometry args={b.size} />
          <meshStandardMaterial color="#c9ccd1" metalness={0.7} roughness={0.3} transparent opacity={0} />
        </mesh>
      ))}

      {/* Walls: front, back, left, right */}
      {[
        { key: 'back', pos: [0, 0, -halfD] },
        { key: 'front', pos: [0, 0, halfD] },
        { key: 'left', pos: [-halfW, 0, 0], rotY: Math.PI / 2 },
        { key: 'right', pos: [halfW, 0, 0], rotY: Math.PI / 2 },
      ].map((w, i) => (
        <mesh
          key={`wall-${w.key}`}
          ref={(el) => (walls.current[i] = el)}
          position={[w.pos[0], 0, w.pos[2]]}
          rotation={[0, w.rotY || 0, 0]}
          scale={[1, 0.001, 1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[w.rotY ? D : W, FLOOR_H, 0.18]} />
          <meshStandardMaterial color="#48505a" roughness={0.85} />
        </mesh>
      ))}

      {/* Wide floor-to-ceiling glass across the front facade */}
      {windowSpansFront.map((x, i) => (
        <mesh
          key={`glass-front-${i}`}
          ref={(el) => {
            if (el) { el.userData.baseZ = halfD + 0.1; el.userData.dir = 1 }
            glass.current[i] = el
          }}
          position={[x, FLOOR_H * 0.42, halfD + 0.1]}
        >
          <planeGeometry args={[1.5, FLOOR_H * 0.75]} />
          <meshPhysicalMaterial color="#cfe6f2" transparent opacity={0} roughness={0.04} metalness={0.05} transmission={0.7} reflectivity={0.7} />
        </mesh>
      ))}
      {/* Side glass panels */}
      {[-2, 0, 2].map((z, i) => (
        <mesh
          key={`glass-side-${i}`}
          ref={(el) => {
            if (el) { el.userData.baseZ = halfW + 0.1; el.userData.dir = 1 }
            glass.current[windowSpansFront.length + i] = el
          }}
          rotation={[0, Math.PI / 2, 0]}
          position={[halfW + 0.1, FLOOR_H * 0.42, z]}
        >
          <planeGeometry args={[1.6, FLOOR_H * 0.75]} />
          <meshPhysicalMaterial color="#cfe6f2" transparent opacity={0} roughness={0.04} metalness={0.05} transmission={0.7} reflectivity={0.7} />
        </mesh>
      ))}

      {/* Wide overhanging flat roof */}
      <mesh ref={roof} position={[0, FLOOR_H + 3.5, 0]} castShadow>
        <boxGeometry args={[W + ROOF_OVERHANG * 2, 0.3, D + ROOF_OVERHANG * 2]} />
        <meshStandardMaterial color="#1c2430" roughness={0.6} transparent opacity={0} />
      </mesh>
      {/* Gold trim line under the roof edge */}
      {[[-halfW - ROOF_OVERHANG + 0.05, -halfD - ROOF_OVERHANG], [halfW + ROOF_OVERHANG - 0.05, -halfD - ROOF_OVERHANG]].map((pos, i) => (
        <mesh key={`trim-${i}`} ref={(el) => (roofTrim.current[i] = el)} position={[pos[0], FLOOR_H + 0.05, 0]}>
          <boxGeometry args={[0.05, 0.05, D + ROOF_OVERHANG * 2]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.25} transparent opacity={0} />
        </mesh>
      ))}

      {/* Lawn */}
      <mesh ref={lawn} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.29, halfD + 6]} receiveShadow>
        <planeGeometry args={[W + 12, 10]} />
        <meshStandardMaterial color="#3c6b45" roughness={1} transparent opacity={0} />
      </mesh>

      {/* Garden hedges lining the front path */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = -halfW + 1.2 + i * ((W - 2.4) / 7)
        return (
          <mesh key={`hedge-${i}`} ref={(el) => (hedges.current[i] = el)} position={[x, -1.05, halfD + 2.4]} scale={0}>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshStandardMaterial color="#2f4d34" roughness={1} />
          </mesh>
        )
      })}

      {/* Flower beds */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = -halfW + 0.8 + i * ((W - 1.6) / 9)
        const colors = ['#d46a6a', '#e0b84a', '#c76fc2']
        return (
          <mesh key={`flower-${i}`} ref={(el) => (flowerBeds.current[i] = el)} position={[x, -1.15, halfD + 1.6]} scale={0}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color={colors[i % colors.length]} roughness={0.8} />
          </mesh>
        )
      })}

      {/* Ornamental trees */}
      {[[-halfW - 2, -halfD - 1.5], [halfW + 2.2, -halfD - 1], [-halfW - 2.5, halfD + 3], [halfW + 2.8, halfD + 4]].map((pos, i) => (
        <group key={`tree-${i}`} ref={(el) => (trees.current[i] = el)} position={[pos[0], -1.3, pos[1]]} scale={0}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.1, 0.13, 1.2, 6]} />
            <meshStandardMaterial color="#4a3728" roughness={1} />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <sphereGeometry args={[0.9, 10, 10]} />
            <meshStandardMaterial color="#3a6142" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Stone path from the entry */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`path-${i}`} ref={(el) => (path.current[i] = el)} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.27, halfD + 1.3 + i * 0.8]} scale={0}>
          <circleGeometry args={[0.35, 16]} />
          <meshStandardMaterial color="#cfc7b6" roughness={0.9} />
        </mesh>
      ))}

      {/* Swimming pool, set beside the house */}
      <group position={[halfW + 5.5, 0, -halfD * 0.2]}>
        <mesh ref={poolDeck} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]} receiveShadow>
          <planeGeometry args={[6.5, 4.5]} />
          <meshStandardMaterial color="#d8d2c4" roughness={0.85} transparent opacity={0} />
        </mesh>
        <mesh ref={poolBasin} position={[0, -1.2, 0]}>
          <boxGeometry args={[5, 0.5, 3]} />
          <meshStandardMaterial color="#8fa6ad" roughness={0.6} transparent opacity={0} />
        </mesh>
        <mesh ref={poolWater} position={[0, -0.55, 0]}>
          <boxGeometry args={[4.7, 0.1, 2.7]} />
          <meshPhysicalMaterial color="#2fa6c9" transparent opacity={0} roughness={0.05} transmission={0.4} reflectivity={0.5} />
        </mesh>
      </group>

      {/* Interior glow revealed at the very end */}
      <pointLight ref={glow} position={[0, FLOOR_H * 0.6, 0]} color="#ffd9a0" intensity={0} distance={10} />
    </group>
  )
}
