'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleMorphBackgroundProps {
  scrollProgress: number
}

// Temporarily disabled for build - will re-enable after performance testing
export default function ParticleMorphBackground({ scrollProgress }: ParticleMorphBackgroundProps) {
  return null
}
