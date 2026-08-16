'use client'

import { useRef, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useScrollController } from '../controls/ScrollController'
import { usePerformance } from '../managers/PerformanceManager'
import * as THREE from 'three'
import { HeroScene } from './scenes/HeroScene'
import { ServicesScene } from './scenes/ServicesScene'
import { PortfolioScene } from './scenes/PortfolioScene'
import { AboutScene } from './scenes/AboutScene'
import { StoreScene } from './scenes/StoreScene'
import { ContactScene } from './scenes/ContactScene'

interface SceneManagerProps {
  currentRoute: string
}

interface Scene {
  id: string
  component: React.ComponentType<any>
  scrollRange: [number, number] // start and end progress (0-1)
}

export function SceneManager({ currentRoute }: SceneManagerProps) {
  const { scene } = useThree()
  const { scrollProgress, currentSection } = useScrollController()
  const { deviceTier } = usePerformance()
  
  const scenesRef = useRef<Scene[]>([
    { id: 'hero', component: HeroScene, scrollRange: [0, 0.15] },
    { id: 'services', component: ServicesScene, scrollRange: [0.15, 0.3] },
    { id: 'portfolio', component: PortfolioScene, scrollRange: [0.3, 0.45] },
    { id: 'about', component: AboutScene, scrollRange: [0.45, 0.6] },
    { id: 'store', component: StoreScene, scrollRange: [0.6, 0.8] },
    { id: 'contact', component: ContactScene, scrollRange: [0.8, 1] },
  ])

  const [activeScene, setActiveScene] = useState<Scene | null>(null)
  const [transitionProgress, setTransitionProgress] = useState(0)

  useEffect(() => {
    // Find active scene based on scroll progress
    const currentScene = scenesRef.current.find(
      scene => scrollProgress >= scene.scrollRange[0] && scrollProgress < scene.scrollRange[1]
    )

    if (currentScene && currentScene.id !== activeScene?.id) {
      setActiveScene(currentScene)
    }

    // Calculate transition progress within the current scene
    if (currentScene) {
      const [start, end] = currentScene.scrollRange
      const range = end - start
      const progress = (scrollProgress - start) / range
      setTransitionProgress(Math.max(0, Math.min(1, progress)))
    }
  }, [scrollProgress, activeScene])

  const SceneComponent = activeScene?.component

  return (
    <group>
      {SceneComponent && (
        <SceneComponent 
          progress={transitionProgress}
          scrollProgress={scrollProgress}
          isActive={true}
          deviceTier={deviceTier}
        />
      )}
    </group>
  )
}
