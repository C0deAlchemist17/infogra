'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

function LoadingScene({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.Group>(null)
  
  const particleCount = 2000
  const lineCount = 50
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)
    
    const color1 = new THREE.Color('#3b82f6')
    const color2 = new THREE.Color('#8b5cf6')
    const color3 = new THREE.Color('#06b6d4')
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      const angle = (i / particleCount) * Math.PI * 2
      const radius = 5 + Math.random() * 2
      const height = (Math.random() - 0.5) * 4
      
      pos[i3] = Math.cos(angle) * radius
      pos[i3 + 1] = height
      pos[i3 + 2] = Math.sin(angle) * radius
      
      const colorMix = i / particleCount
      const mixedColor = new THREE.Color()
      if (colorMix < 0.33) {
        mixedColor.lerpColors(color1, color2, colorMix * 3)
      } else if (colorMix < 0.66) {
        mixedColor.lerpColors(color2, color3, (colorMix - 0.33) * 3)
      } else {
        mixedColor.lerpColors(color3, color1, (colorMix - 0.66) * 3)
      }
      
      col[i3] = mixedColor.r
      col[i3 + 1] = mixedColor.g
      col[i3 + 2] = mixedColor.b
    }
    
    return { positions: pos, colors: col }
  }, [])
  
  const lines = useMemo(() => {
    const lineData = []
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2
      const radius = 6 + Math.random() * 2
      lineData.push({
        angle,
        radius,
        speed: 0.5 + Math.random() * 0.5
      })
    }
    return lineData
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.2
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.5
        const radius = 5 + Math.sin(time + i * 0.01) * 0.5
        const height = Math.sin(time * 2 + i * 0.02) * 2
        
        positions[i3] = Math.cos(angle) * radius
        positions[i3 + 1] = height
        positions[i3 + 2] = Math.sin(angle) * radius
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        if (line instanceof THREE.Line) {
          const lineData = lines[i]
          const time = state.clock.elapsedTime
          const angle = lineData.angle + time * lineData.speed
          const radius = lineData.radius + Math.sin(time * 2) * 0.5
          
          const x = Math.cos(angle) * radius
          const y = Math.sin(time * 3) * 2
          const z = Math.sin(angle) * radius
          
          line.position.set(x, y, z)
          line.rotation.y = time * 0.3
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      <Points ref={particlesRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      <group ref={linesRef}>
        {lines.map((line, i) => (
          <group key={i}>
            <Line
              points={[
                [0, 0, 0],
                [line.radius, 0, 0]
              ]}
              color="#6366f1"
              opacity={0.3}
              lineWidth={0.5}
            />
          </group>
        ))}
      </group>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 0.02, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7, 0.01, 64]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        setIsComplete(true)
      }
      setProgress(Math.min(currentProgress, 100))
    }, 40)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isComplete) {
      const loadingScreen = document.getElementById('loading-screen')
      if (loadingScreen) {
        loadingScreen.style.opacity = '0'
        setTimeout(() => {
          loadingScreen.style.display = 'none'
        }, 300)
      }
    }
  }, [isComplete])

  if (!mounted) return null

  return (
    <div id="loading-screen" className="fixed inset-0 z-[9999] bg-[#0a0a1a] flex items-center justify-center transition-opacity duration-300">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 75 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          style={{ background: 'transparent' }}
        >
          <LoadingScene progress={progress} />
        </Canvas>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            INFOGRA
          </h1>
        </motion.div>
        
        <div className="w-80 mb-6">
          <div className="flex justify-between text-sm text-purple-300 mb-2">
            <span>Loading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-400 text-sm"
        >
          {progress < 40 ? 'Initializing...' : 
           progress < 70 ? 'Loading assets...' : 
           progress < 90 ? 'Preparing experience...' : 
           'Almost ready...'}
        </motion.p>
      </div>
    </div>
  )
}