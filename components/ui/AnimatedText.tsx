'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  type?: 'words' | 'chars' | 'lines'
  animation?: 'fadeIn' | 'slideUp' | 'slideIn' | 'glitch'
}

const AnimatedText = ({ 
  text, 
  className = '', 
  delay = 0, 
  stagger = 0.05,
  type = 'words',
  animation = 'fadeIn'
}: AnimatedTextProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [displayText, setDisplayText] = useState<string[]>([])

  useEffect(() => {
    if (type === 'words') {
      setDisplayText(text.split(' '))
    } else if (type === 'chars') {
      setDisplayText(text.split(''))
    } else if (type === 'lines') {
      setDisplayText(text.split('\n'))
    }
  }, [text, type])

  const getAnimationVariants = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }
      case 'slideIn':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        }
      case 'glitch':
        return {
          hidden: { opacity: 0, scale: 0.8, rotate: 0 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            rotate: [0, -1, 1, -1, 0],
            transition: {
              rotate: {
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 0.3
              }
            }
          }
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
    }
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {displayText.map((item, index) => (
          <motion.span
            key={index}
            variants={getAnimationVariants()}
            className="inline-block"
          >
            {type === 'words' && index < displayText.length - 1 ? `${item} ` : item}
            {type !== 'words' && item}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export default AnimatedText
