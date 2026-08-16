'use client'

import { createContext, useContext, useRef, useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface TransitionContextType {
  isTransitioning: boolean
  transitionProgress: number
  startTransition: (fromRoute: string, toRoute: string) => void
  endTransition: () => void
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  transitionProgress: 0,
  startTransition: () => {},
  endTransition: () => {},
})

export function useTransitionManager() {
  return useContext(TransitionContext)
}

interface TransitionManagerProps {
  children: React.ReactNode
}

export function TransitionManager({ children }: TransitionManagerProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null)

  const startTransition = (fromRoute: string, toRoute: string) => {
    setIsTransitioning(true)
    setTransitionProgress(0)

    // Create a transition timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false)
        setTransitionProgress(1)
      },
    })

    // Transition phases
    timeline
      .to({}, { duration: 0.3, onUpdate: () => setTransitionProgress(timeline.progress()) }) // Fade out current scene
      .to({}, { duration: 0.2 }) // Mid-transition pause
      .to({}, { duration: 0.3, onUpdate: () => setTransitionProgress(timeline.progress()) }) // Fade in new scene

    transitionTimelineRef.current = timeline
  }

  const endTransition = () => {
    if (transitionTimelineRef.current) {
      transitionTimelineRef.current.kill()
    }
    setIsTransitioning(false)
    setTransitionProgress(1)
  }

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        transitionProgress,
        startTransition,
        endTransition,
      }}
    >
      {children}
    </TransitionContext.Provider>
  )
}
