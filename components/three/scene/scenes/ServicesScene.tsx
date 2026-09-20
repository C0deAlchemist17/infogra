'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line, Stars } from '@react-three/drei'
import * as THREE from 'three'

interface ServicesSceneProps {
  progress: number
  scrollProgress: number
  isActive: boolean
  deviceTier: string
}

export function ServicesScene({ progress, scrollProgress, isActive, deviceTier }: ServicesSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.Group>(null)
  
  const particleCount = deviceTier === 'low' ? 300 : deviceTier === 'medium' ? 450 : 600
  const lineCount = 25
  
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
      
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 7 + Math.random() * 14
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = radius * Math.cos(phi) - 10
      
      origPos[i3] = pos[i3]
      origPos[i3 + 1] = pos[i3 + 1]
      origPos[i3 + 2] = pos[i3 + 2]
      
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
      const radius = 9 + Math.random() * 7
      lineData.push({
        angle,
        radius,
        speed: 0.18 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2
      })
    }
    return lineData
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.009
      groupRef.current.rotation.x = Math.sin(time * 0.008) * 0.015
      groupRef.current.position.y = Math.sin(time * 0.1) * 0.03
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      
      // Pattern selection based on scroll progress
      const scrollPattern = Math.floor(scrollProgress * 4)
      const scrollInfluence = scrollProgress * 0.2
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        const origX = originalPositions[i3]
        const origY = originalPositions[i3 + 1]
        const origZ = originalPositions[i3 + 2]
        
        let targetX, targetY, targetZ
        
        if (scrollPattern === 0) {
          const spiralAngle = (i / particleCount) * Math.PI * 6 + time * 0.15
          const spiralRadius = 3 + (i / particleCount) * 8
          targetX = Math.cos(spiralAngle) * spiralRadius
          targetY = Math.sin(spiralAngle) * spiralRadius * 0.3
          targetZ = Math.sin(spiralAngle * 2) * 2 - 10
        } else if (scrollPattern === 1) {
          const galaxyAngle = (i / particleCount) * Math.PI * 8
          const galaxyRadius = 2 + (i / particleCount) * 8 * (1 + Math.sin(galaxyAngle) * 0.2)
          targetX = Math.cos(galaxyAngle) * galaxyRadius
          targetY = Math.sin(galaxyAngle) * galaxyRadius * 0.2
          targetZ = (i / particleCount - 0.5) * 5 - 10
        } else if (scrollPattern === 2) {
          const wavePhase = (i / particleCount) * Math.PI * 3
          targetX = (i / particleCount - 0.5) * 12
          targetY = Math.sin(wavePhase + time * 0.8) * 2.5
          targetZ = Math.cos(wavePhase + time * 0.6) * 2.5 - 10
        } else {
          const constellationPhase = (i / particleCount) * Math.PI * 4
          targetX = origX + Math.sin(constellationPhase + time * 0.4) * 1.2
          targetY = origY + Math.cos(constellationPhase + time * 0.3) * 1.2
          targetZ = origZ + Math.sin(constellationPhase + time * 0.5) * 1.2
        }
        
        const blendFactor = Math.pow(Math.sin((time * 0.15) % 1 * Math.PI), 0.5)
        const scrollOffset = scrollInfluence * Math.sin(i * 0.01 + time * 0.4) * 1
        
        positions[i3] = THREE.MathUtils.lerp(origX, targetX, blendFactor * 0.12) + scrollOffset
        positions[i3 + 1] = THREE.MathUtils.lerp(origY, targetY, blendFactor * 0.12) + scrollOffset * 0.3
        positions[i3 + 2] = THREE.MathUtils.lerp(origZ, targetZ, blendFactor * 0.12)
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        if (line instanceof THREE.Line) {
          const lineData = lines[i]
          const angle = lineData.angle + time * lineData.speed * 0.8
          const radius = lineData.radius + Math.sin(time * 1.5 + lineData.phase) * 1.9
          
          const x = Math.cos(angle) * radius
          const y = Math.sin(time * 2 + lineData.phase) * 2.85
          const z = Math.sin(angle) * radius
          
          line.position.set(x, y, z)
          line.rotation.y = time * 0.08
          line.rotation.x = Math.sin(time * 0.25 + lineData.phase) * 0.14
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      <Stars radius={80} depth={40} count={400} factor={3} saturation={0.1} fade speed={0.4} />
      
      <Points ref={particlesRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={deviceTier === 'low' ? 0.045 : deviceTier === 'medium' ? 0.032 : 0.023}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      <group ref={linesRef}>
        {lines.map((line, i) => (
          <group key={i}>
            <Line
              points={[
                [0, 0, 0],
                [line.radius, 0, 0]
              ]}
              color="#6366f1"
              opacity={0.14}
              lineWidth={0.14}
            />
          </group>
        ))}
      </group>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[11, 0.014, 128]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[17, 0.009, 128]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[24, 0.007, 128]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}