'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface ParallaxContainerProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  offset?: number
}

const ParallaxContainer = ({ 
  children, 
  className = '', 
  speed = 0.5,
  direction = 'up',
  offset = 0
}: ParallaxContainerProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const transform = useTransform(scrollYProgress, [0, 1], [offset, -speed * 100])
  const transformDown = useTransform(scrollYProgress, [0, 1], [offset, speed * 100])
  const transformLeft = useTransform(scrollYProgress, [0, 1], [0, -speed * 100])
  const transformRight = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return transform
      case 'down':
        return transformDown
      case 'left':
        return transformLeft
      case 'right':
        return transformRight
      default:
        return transform
    }
  }

  const finalTransform = getTransform()

  return (
    <div ref={ref} className={`parallax-container ${className}`}>
      <motion.div
        style={{
          transform: finalTransform
        }}
        className="parallax-element"
      >
        {children}
      </motion.div>
    </div>
  )
}

export default ParallaxContainer
