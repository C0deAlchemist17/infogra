'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AboutSceneProps {
  progress: number
  scrollProgress: number
  isActive: boolean
  deviceTier: string
}

export function AboutScene({ progress, scrollProgress, isActive, deviceTier }: AboutSceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* INFOGRA Core - central technological structure */}
      <mesh position={[0, 0, -5]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Orbiting rings */}
      <mesh position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      
      <mesh position={[0, 0, -5]} rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[3, 0.03, 16, 100]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}
