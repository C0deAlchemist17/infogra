'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Global Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background-primary flex items-center justify-center px-8">
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 bg-accent-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-accent-primary" />
            </div>
            <h1 className="text-h2 font-bold text-text-primary mb-4">Something went wrong</h1>
            <p className="text-body text-text-secondary mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-small text-text-tertiary cursor-pointer hover:text-text-secondary mb-2">
                  Error details
                </summary>
                <pre className="text-caption text-text-tertiary bg-background-tertiary/50 p-4 rounded-lg overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => window.location.reload()}
                variant="premium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
