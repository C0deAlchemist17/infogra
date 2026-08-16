'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface HeroSceneProps {
  progress: number
  scrollProgress: number
  isActive: boolean
  deviceTier: string
}

export function HeroScene({ progress, scrollProgress, isActive, deviceTier }: HeroSceneProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  const particleCount = deviceTier === 'low' ? 300 : deviceTier === 'medium' ? 600 : 1200
  
  const { positions, initialPositions, targetPositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const initialPos = new Float32Array(particleCount * 3)
    const targetPos = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Initial scattered positions (digital birth state)
      initialPos[i3] = (Math.random() - 0.5) * 30
      initialPos[i3 + 1] = (Math.random() - 0.5) * 30
      initialPos[i3 + 2] = (Math.random() - 0.5) * 20 - 10
      
      // Target positions - assemble into INFOGRA-inspired structure
      // Create a complex geometric shape representing technology
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2 + Math.random() * 2
      
      targetPos[i3] = radius * Math.sin(phi) * Math.cos(theta)
      targetPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      targetPos[i3 + 2] = radius * Math.cos(phi) - 5
      
      // Current positions start at initial
      pos[i3] = initialPos[i3]
      pos[i3 + 1] = initialPos[i3 + 1]
      pos[i3 + 2] = initialPos[i3 + 2]
    }
    
    return { positions: pos, initialPositions: initialPos, targetPositions: targetPos }
  }, [particleCount])

  useEffect(() => {
    if (!particlesRef.current) return
    
    const geometry = particlesRef.current.geometry
    const positionAttribute = geometry.attributes.position
    
    // Animate particles from scattered to assembled based on progress
    const animateParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        // Interpolate between initial and target positions
        const assemblyProgress = Math.min(progress * 1.5, 1) // Speed up assembly
        const easeProgress = 1 - Math.pow(1 - assemblyProgress, 3) // Ease out cubic
        
        positionAttribute.array[i3] = THREE.MathUtils.lerp(
          initialPositions[i3],
          targetPositions[i3],
          easeProgress
        )
        positionAttribute.array[i3 + 1] = THREE.MathUtils.lerp(
          initialPositions[i3 + 1],
          targetPositions[i3 + 1],
          easeProgress
        )
        positionAttribute.array[i3 + 2] = THREE.MathUtils.lerp(
          initialPositions[i3 + 2],
          targetPositions[i3 + 2],
          easeProgress
        )
      }
      
      positionAttribute.needsUpdate = true
    }
    
    animateParticles()
  }, [progress, particleCount, initialPositions, targetPositions])

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation of the entire particle system
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
      
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
    
    if (particlesRef.current) {
      // Individual particle subtle movement
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        // Add subtle noise to assembled particles
        if (progress > 0.5) {
          positions[i3] += Math.sin(state.clock.elapsedTime + i) * 0.001
          positions[i3 + 1] += Math.cos(state.clock.elapsedTime + i) * 0.001
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      <Points ref={particlesRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={deviceTier === 'low' ? 0.05 : deviceTier === 'medium' ? 0.04 : 0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
      
      {/* Add subtle glowing core when assembled */}
      {progress > 0.7 && (
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.1 * (progress - 0.7) * 3.33}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}
