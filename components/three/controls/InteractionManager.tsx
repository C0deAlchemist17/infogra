'use client'

import { createContext, useContext, useRef, useEffect, useState } from 'react'

interface InteractionContextType {
  pointerPosition: { x: number; y: number }
  isPointerDown: boolean
  pointerVelocity: { x: number; y: number }
}

const InteractionContext = createContext<InteractionContextType>({
  pointerPosition: { x: 0, y: 0 },
  isPointerDown: false,
  pointerVelocity: { x: 0, y: 0 },
})

export function useInteractionManager() {
  return useContext(InteractionContext)
}

interface InteractionManagerProps {
  children: React.ReactNode
}

export function InteractionManager({ children }: InteractionManagerProps) {
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 })
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [pointerVelocity, setPointerVelocity] = useState({ x: 0, y: 0 })
  
  const previousPositionRef = useRef({ x: 0, y: 0 })
  const previousTimeRef = useRef(0)

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      
      setPointerPosition({ x, y })

      // Calculate velocity
      const now = performance.now()
      const dt = now - previousTimeRef.current
      if (dt > 0) {
        const vx = (x - previousPositionRef.current.x) / dt
        const vy = (y - previousPositionRef.current.y) / dt
        setPointerVelocity({ x: vx, y: vy })
      }

      previousPositionRef.current = { x, y }
      previousTimeRef.current = now
    }

    const handlePointerDown = () => setIsPointerDown(true)
    const handlePointerUp = () => setIsPointerDown(false)

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return (
    <InteractionContext.Provider
      value={{
        pointerPosition,
        isPointerDown,
        pointerVelocity,
      }}
    >
      {children}
    </InteractionContext.Provider>
  )
}
