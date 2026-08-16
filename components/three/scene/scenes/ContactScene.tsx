'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { GlobalGlobe } from '../../objects/GlobalGlobe'
import { OrbitControlsWrapper } from '../../camera/OrbitControlsWrapper'
import * as THREE from 'three'

interface ContactSceneProps {
  progress: number
  scrollProgress: number
  isActive: boolean
  deviceTier: string
}

export function ContactScene({ progress, scrollProgress, isActive, deviceTier }: ContactSceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Global communication network with premium globe */}
      <GlobalGlobe progress={progress} deviceTier={deviceTier} />
      
      {/* Interactive orbit controls for the globe */}
      {isActive && (
        <OrbitControlsWrapper
          enabled={true}
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          enableDamping={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      )}
    </group>
  )
}
