'use client'

import React, { Component, ReactNode, useEffect, useState } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  webglAvailable: boolean
}

function WebGLChecker({ onWebGLStatus }: { onWebGLStatus: (available: boolean) => void }) {
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            console.log('WebGL Renderer:', renderer)
          }
          onWebGLStatus(true)
        } else {
          onWebGLStatus(false)
        }
      } catch (e) {
        console.error('WebGL check failed:', e)
        onWebGLStatus(false)
      }
    }

    checkWebGL()
  }, [onWebGLStatus])

  return null
}

export default class ThreeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, webglAvailable: true }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, webglAvailable: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js component failed to render:', error.message)
    console.error('Error info:', errorInfo.componentStack)
  }

  setWebGLStatus = (available: boolean) => {
    this.setState({ webglAvailable: available })
  }

  render() {
    if (!this.state.webglAvailable || this.state.hasError) {
      return this.props.fallback || (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background-primary to-background-secondary">
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-primary/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
              </svg>
            </div>
            <h3 className="text-h4 font-semibold text-text-primary mb-2">3D Scene Unavailable</h3>
            <p className="text-body text-text-secondary">
              {!this.state.webglAvailable 
                ? 'WebGL is not supported on your device. The website will continue to function without 3D effects.'
                : 'The 3D scene failed to load. The website will continue to function normally.'}
            </p>
          </div>
        </div>
      )
    }

    return (
      <>
        <WebGLChecker onWebGLStatus={this.setWebGLStatus} />
        {this.props.children}
      </>
    )
  }
}
