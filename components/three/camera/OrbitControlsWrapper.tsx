'use client'

import { OrbitControls as OrbitControlsImpl } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

interface OrbitControlsWrapperProps {
  enabled?: boolean
  enableZoom?: boolean
  enablePan?: boolean
  enableRotate?: boolean
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
  enableDamping?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
}

export function OrbitControlsWrapper({
  enabled = true,
  enableZoom = false,
  enablePan = false,
  enableRotate = true,
  minDistance = 5,
  maxDistance = 15,
  minPolarAngle = Math.PI / 3,
  maxPolarAngle = Math.PI / 1.5,
  enableDamping = true,
  autoRotate = false,
  autoRotateSpeed = 0.5,
}: OrbitControlsWrapperProps) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 10)
  }, [camera])

  return (
    <OrbitControlsImpl
      enabled={enabled}
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableRotate={enableRotate}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      enableDamping={enableDamping}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
    />
  )
}
