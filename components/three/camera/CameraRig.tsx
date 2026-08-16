'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollController } from '../controls/ScrollController'
import { useInteractionManager } from '../controls/InteractionManager'
import { usePerformance } from '../managers/PerformanceManager'

interface CameraRigProps {
  children: React.ReactNode
}

function CameraController() {
  const { camera } = useThree()
  const { scrollProgress, currentSection } = useScrollController()
  const { pointerPosition } = useInteractionManager()
  const { reducedMotion, isMobile } = usePerformance()
  
  const targetPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 10))
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const currentPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 10))
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    if (reducedMotion) return

    // Calculate camera position based on scroll progress and section
    const sectionOffset = currentSection * 0.1
    const scrollOffset = scrollProgress * 2
    
    // Base camera movement
    targetPositionRef.current.set(
      pointerPosition.x * 0.5,
      -scrollOffset + sectionOffset + pointerPosition.y * 0.3,
      10 - scrollProgress * 3
    )

    // Smooth camera movement
    const lerpFactor = isMobile ? 2 : 4
    currentPositionRef.current.lerp(targetPositionRef.current, lerpFactor * delta)
    currentLookAtRef.current.lerp(targetLookAtRef.current, lerpFactor * delta)

    camera.position.copy(currentPositionRef.current)
    camera.lookAt(currentLookAtRef.current)
  })

  return null
}

export function CameraRig({ children }: CameraRigProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
      <CameraController />
      {children}
    </>
  )
}
