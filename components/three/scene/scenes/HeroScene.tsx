'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line, Stars } from '@react-three/drei'
import * as THREE from 'three'

interface HeroSceneProps {
  progress: number
  scrollProgress: number
  isActive: boolean
  deviceTier: string
}

export function HeroScene({ progress, scrollProgress, isActive, deviceTier }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.Group>(null)
  
  const particleCount = deviceTier === 'low' ? 400 : deviceTier === 'medium' ? 600 : 800
  const lineCount = 30
  
  const { positions, colors, originalPositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const origPos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)
    
    const color1 = new THREE.Color('#3b82f6')
    const color2 = new THREE.Color('#8b5cf6')
    const color3 = new THREE.Color('#06b6d4')
    const color4 = new THREE.Color('#f59e0b')
    const color5 = new THREE.Color('#10b981')
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Create spherical distribution for initial star field
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 8 + Math.random() * 15
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = radius * Math.cos(phi) - 10
      
      origPos[i3] = pos[i3]
      origPos[i3 + 1] = pos[i3 + 1]
      origPos[i3 + 2] = pos[i3 + 2]
      
      // Multi-color gradient
      const colorMix = i / particleCount
      const mixedColor = new THREE.Color()
      if (colorMix < 0.2) {
        mixedColor.lerpColors(color1, color2, colorMix * 5)
      } else if (colorMix < 0.4) {
        mixedColor.lerpColors(color2, color3, (colorMix - 0.2) * 5)
      } else if (colorMix < 0.6) {
        mixedColor.lerpColors(color3, color4, (colorMix - 0.4) * 5)
      } else if (colorMix < 0.8) {
        mixedColor.lerpColors(color4, color5, (colorMix - 0.6) * 5)
      } else {
        mixedColor.lerpColors(color5, color1, (colorMix - 0.8) * 5)
      }
      
      col[i3] = mixedColor.r
      col[i3 + 1] = mixedColor.g
      col[i3 + 2] = mixedColor.b
    }
    
    return { positions: pos, colors: col, originalPositions: origPos }
  }, [particleCount])
  
  const lines = useMemo(() => {
    const lineData = []
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2
      const radius = 10 + Math.random() * 8
      lineData.push({
        angle,
        radius,
        speed: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      })
    }
    return lineData
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      // Continuous automatic rotation - slower for performance
      const smoothRotation = time * 0.01
      groupRef.current.rotation.y = smoothRotation
      groupRef.current.rotation.x = Math.sin(time * 0.01) * 0.02
      groupRef.current.position.y = Math.sin(time * 0.1) * 0.03
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      
      // Pattern selection based on scroll progress (changes when scrolling)
      const scrollPattern = Math.floor(scrollProgress * 4) // 4 patterns based on scroll
      const timePattern = (time * 0.2) % 1 // Time-based pattern when not scrolling
      const scrollInfluence = scrollProgress * 0.2 // Reduced influence for performance
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        const origX = originalPositions[i3]
        const origY = originalPositions[i3 + 1]
        const origZ = originalPositions[i3 + 2]
        
        let targetX, targetY, targetZ
        
        // Different patterns based on scroll position
        if (scrollPattern === 0) {
          // Spiral pattern - at start of scroll
          const spiralAngle = (i / particleCount) * Math.PI * 6 + time * 0.15
          const spiralRadius = 4 + (i / particleCount) * 8
          targetX = Math.cos(spiralAngle) * spiralRadius
          targetY = Math.sin(spiralAngle) * spiralRadius * 0.4
          targetZ = Math.sin(spiralAngle * 2) * 2 - 10
        } else if (scrollPattern === 1) {
          // Galaxy pattern - at 25% scroll
          const galaxyAngle = (i / particleCount) * Math.PI * 8
          const galaxyRadius = 2 + (i / particleCount) * 10 * (1 + Math.sin(galaxyAngle) * 0.2)
          targetX = Math.cos(galaxyAngle) * galaxyRadius
          targetY = Math.sin(galaxyAngle) * galaxyRadius * 0.2
          targetZ = (i / particleCount - 0.5) * 6 - 10
        } else if (scrollPattern === 2) {
          // Wave pattern - at 50% scroll
          const wavePhase = (i / particleCount) * Math.PI * 3
          targetX = (i / particleCount - 0.5) * 15
          targetY = Math.sin(wavePhase + time * 0.8) * 3
          targetZ = Math.cos(wavePhase + time * 0.6) * 3 - 10
        } else {
          // Constellation pattern - at 75%+ scroll
          const constellationPhase = (i / particleCount) * Math.PI * 4
          targetX = origX + Math.sin(constellationPhase + time * 0.4) * 1.5
          targetY = origY + Math.cos(constellationPhase + time * 0.3) * 1.5
          targetZ = origZ + Math.sin(constellationPhase + time * 0.5) * 1.5
        }
        
        // Automatic movement continues regardless of scroll
        const blendFactor = Math.pow(Math.sin((time * 0.15) % 1 * Math.PI), 0.5)
        const scrollOffset = scrollInfluence * Math.sin(i * 0.01 + time * 0.4) * 1
        
        positions[i3] = THREE.MathUtils.lerp(origX, targetX, blendFactor * 0.15) + scrollOffset
        positions[i3 + 1] = THREE.MathUtils.lerp(origY, targetY, blendFactor * 0.15) + scrollOffset * 0.3
        positions[i3 + 2] = THREE.MathUtils.lerp(origZ, targetZ, blendFactor * 0.15)
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        if (line instanceof THREE.Line) {
          const lineData = lines[i]
          // Lines continue moving automatically - slower
          const angle = lineData.angle + time * lineData.speed * 0.4
          const radius = lineData.radius + Math.sin(time * 0.8 + lineData.phase) * 1
          
          const x = Math.cos(angle) * radius
          const y = Math.sin(time * 1 + lineData.phase) * 2
          const z = Math.sin(angle) * radius
          
          line.position.set(x, y, z)
          line.rotation.y = time * 0.04
          line.rotation.x = Math.sin(time * 0.12 + lineData.phase) * 0.08
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Rich star field */}
      <Stars radius={100} depth={50} count={500} factor={4} saturation={0.15} fade speed={0.5} />
      
      {/* Dynamic particle system */}
      <Points ref={particlesRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={deviceTier === 'low' ? 0.05 : deviceTier === 'medium' ? 0.035 : 0.025}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Animated constellation lines */}
      <group ref={linesRef}>
        {lines.map((line, i) => (
          <group key={i}>
            <Line
              points={[
                [0, 0, 0],
                [line.radius, 0, 0]
              ]}
              color="#6366f1"
              opacity={0.15}
              lineWidth={0.15}
            />
          </group>
        ))}
      </group>
      
      {/* Orbital rings - simplified for performance */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 0.01, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[12, 0.008, 64]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[16, 0.005, 64]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}