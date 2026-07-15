'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'

interface RevealImageProps {
  src: string
  alt: string
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  width?: number
  height?: number
}

const RevealImage = ({ 
  src, 
  alt, 
  className = '', 
  direction = 'up',
  delay = 0,
  duration = 0.8,
  width,
  height
}: RevealImageProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hasError, setHasError] = useState(false)

  const getVariants = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 }
        }
      case 'down':
        return {
          hidden: { opacity: 0, y: -100 },
          visible: { opacity: 1, y: 0 }
        }
      case 'left':
        return {
          hidden: { opacity: 0, x: 100 },
          visible: { opacity: 1, x: 0 }
        }
      case 'right':
        return {
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 }
        }
      default:
        return {
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 }
        }
    }
  }

  return (
    <div ref={ref} className={`image-reveal ${className}`}>
      <motion.div
        variants={getVariants()}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{
          duration,
          delay,
          ease: [0.34, 1.56, 0.64, 1]
        }}
        className="w-full h-full"
      >
        {hasError ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-500 text-sm">
            <span>{alt}</span>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
            width={width || 800}
            height={height || 600}
          />
        )}
      </motion.div>
    </div>
  )
}

export default RevealImage
