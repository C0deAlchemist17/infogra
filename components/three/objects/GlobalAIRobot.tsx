'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AICoreRobot } from './AICoreRobot'

interface GlobalAIRobotProps {
  isHovered?: boolean
  isActive?: boolean
  size?: number
  onClick?: () => void
}

export function GlobalAIRobot({ isHovered = false, isActive = false, size = 100, onClick }: GlobalAIRobotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div 
      style={{ width: size, height: size }} 
      className="cursor-pointer overflow-visible"
      onClick={onClick}
    >
      <Canvas
        camera={{ position: [0, 0.4, 2.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 5]} intensity={1.2} />
        <pointLight position={[-2, 1.5, 2]} intensity={isHovered ? 2 : 0.8} color="#8b5cf6" />
        <pointLight position={[2, -1, 3]} intensity={0.4} color="#3b82f6" />

        <group position={[0, -0.3, 0]}>
          <AICoreRobot 
            isHovered={isHovered} 
            isActive={isActive} 
            position={[0, 0, 0]}
            scale={1}
          />
        </group>
      </Canvas>
    </div>
  )
}
