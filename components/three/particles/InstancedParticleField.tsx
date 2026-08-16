'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface InstancedParticleFieldProps {
  count?: number
  color?: string
  size?: number
  spread?: number
  animationSpeed?: number
  deviceTier?: string
}

export function InstancedParticleField({
  count = 1000,
  color = '#3b82f6',
  size = 0.05,
  spread = 10,
  animationSpeed = 1,
  deviceTier = 'high',
}: InstancedParticleFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummyRef = useRef<THREE.Object3D>(new THREE.Object3D())
  
  // Adjust particle count based on device tier
  const adjustedCount = deviceTier === 'low' ? count / 3 : deviceTier === 'medium' ? count / 2 : count

  const { positions, velocities, initialPositions } = useMemo(() => {
    const pos = new Float32Array(adjustedCount * 3)
    const vel = new Float32Array(adjustedCount * 3)
    const initialPos = new Float32Array(adjustedCount * 3)
    
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      
      // Random positions within spread
      pos[i3] = (Math.random() - 0.5) * spread
      pos[i3 + 1] = (Math.random() - 0.5) * spread
      pos[i3 + 2] = (Math.random() - 0.5) * spread
      
      // Store initial positions
      initialPos[i3] = pos[i3]
      initialPos[i3 + 1] = pos[i3 + 1]
      initialPos[i3 + 2] = pos[i3 + 2]
      
      // Random velocities
      vel[i3] = (Math.random() - 0.5) * 0.02
      vel[i3 + 1] = (Math.random() - 0.5) * 0.02
      vel[i3 + 2] = (Math.random() - 0.5) * 0.02
    }
    
    return { positions: pos, velocities: vel, initialPositions: initialPos }
  }, [adjustedCount, spread])

  const geometry = useMemo(() => new THREE.SphereGeometry(size, 8, 8), [size])
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.3,
    metalness: 0.7,
    transparent: true,
    opacity: 0.8,
  }), [color])

  useFrame((state) => {
    if (!meshRef.current) return

    const dummy = dummyRef.current
    const time = state.clock.elapsedTime * animationSpeed

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      
      // Update positions based on velocities
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]
      
      // Boundary check - wrap around
      if (Math.abs(positions[i3]) > spread) positions[i3] = -positions[i3]
      if (Math.abs(positions[i3 + 1]) > spread) positions[i3 + 1] = -positions[i3 + 1]
      if (Math.abs(positions[i3 + 2]) > spread) positions[i3 + 2] = -positions[i3 + 2]
      
      // Add subtle wave motion
      const wave = Math.sin(time + i * 0.1) * 0.5
      positions[i3 + 1] += wave * 0.01
      
      // Update instance matrix
      dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2])
      dummy.rotation.set(time * 0.1 + i, time * 0.05 + i, 0)
      dummy.scale.setScalar(1 + Math.sin(time + i) * 0.2)
      dummy.updateMatrix()
      
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, adjustedCount]}
    />
  )
}
