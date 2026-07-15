'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'

export default function ParticleField() {
  const pointsRef = useRef<any>(null)
  
  const particleCount = 1000 // Reduced from 2000 for better performance
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20
  }
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01 // Slow but visible rotation
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.03} // Smaller particles
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}
