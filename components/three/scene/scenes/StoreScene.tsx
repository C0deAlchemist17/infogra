'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StoreSceneProps {
  progress: number
  scrollProgress: number
  isActive: boolean
  deviceTier: string
}

export function StoreScene({ progress, scrollProgress, isActive, deviceTier }: StoreSceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* 3D Showroom environment */}
      <mesh position={[0, 0, -5]}>
        <boxGeometry args={[3, 2, 1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Floating product representations */}
      <mesh position={[-2, 1, -4]}>
        <boxGeometry args={[0.8, 0.6, 0.1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      <mesh position={[2, 1, -4]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
    </group>
  )
}
