'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center px-8">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-accent-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-10 h-10 text-accent-primary" />
        </div>
        <h1 className="text-h2 font-bold text-text-primary mb-4">Something went wrong</h1>
        <p className="text-body text-text-secondary mb-8">
          We encountered an unexpected error. Please try again or contact our support team.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={reset} variant="premium">
            Try Again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
