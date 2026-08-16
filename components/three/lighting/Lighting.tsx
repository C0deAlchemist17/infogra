'use client'

import { useThree } from '@react-three/fiber'
import { usePerformance } from '../managers/PerformanceManager'
import { useEffect } from 'react'
import * as THREE from 'three'

export function Lighting() {
  const { scene } = useThree()
  const { reducedMotion, deviceTier } = usePerformance()

  useEffect(() => {
    // Configure environment and lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1)
    keyLight.position.set(5, 5, 5)
    keyLight.castShadow = deviceTier !== 'low'
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024 * (deviceTier === 'high' ? 2 : 1)
      keyLight.shadow.mapSize.height = 1024 * (deviceTier === 'high' ? 2 : 1)
      keyLight.shadow.camera.near = 0.5
      keyLight.shadow.camera.far = 50
      keyLight.shadow.camera.left = -10
      keyLight.shadow.camera.right = 10
      keyLight.shadow.camera.top = 10
      keyLight.shadow.camera.bottom = -10
    }
    scene.add(keyLight)

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.5)
    rimLight.position.set(-5, 5, -5)
    scene.add(rimLight)

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x06b6d4, 0.3)
    fillLight.position.set(5, -5, -5)
    scene.add(fillLight)

    // Accent lights for dynamic feel
    const accentLight1 = new THREE.PointLight(0x3b82f6, 0.5, 20)
    accentLight1.position.set(10, 10, 10)
    scene.add(accentLight1)

    const accentLight2 = new THREE.PointLight(0xec4899, 0.3, 20)
    accentLight2.position.set(-10, -10, 10)
    scene.add(accentLight2)

    return () => {
      scene.remove(ambientLight)
      scene.remove(keyLight)
      scene.remove(rimLight)
      scene.remove(fillLight)
      scene.remove(accentLight1)
      scene.remove(accentLight2)
    }
  }, [scene, deviceTier])

  return null
}
