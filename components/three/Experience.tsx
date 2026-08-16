'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import ThreeErrorBoundary from './ThreeErrorBoundary'
import { PerformanceManager } from './managers/PerformanceManager'
import { Lighting } from './lighting/Lighting'
import { CameraRig } from './camera/CameraRig'
import { SceneManager } from './scene/SceneManager'
import { ScrollController } from './controls/ScrollController'
import { InteractionManager } from './controls/InteractionManager'
import { TransitionManager } from './transitions/TransitionManager'

interface ExperienceProps {
  route?: string
}

export default function Experience({ route = 'home' }: ExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <ThreeErrorBoundary>
        <Canvas
          ref={canvasRef}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
            stencil: true,
            depth: true,
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <PerformanceManager>
              <Lighting />
              <CameraRig>
                <ScrollController>
                  <InteractionManager>
                    <TransitionManager>
                      <SceneManager currentRoute={route} />
                    </TransitionManager>
                  </InteractionManager>
                </ScrollController>
              </CameraRig>
            </PerformanceManager>
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  )
}
