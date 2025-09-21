'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const [mounted, setMounted] = useState(false)
  const [errorDetails, setErrorDetails] = useState<{
    message: string
    stack?: string
  }>({
    message: 'Something went wrong!',
  })

  useEffect(() => {
    setMounted(true)

    // Capture error details for debugging
    if (error) {
      setErrorDetails({
        message: error.message || 'An unexpected error occurred',
        stack: error.stack,
      })
    }
  }, [error])

  if (!mounted) {
    return null
  }

  const handleRetry = () => {
    reset()
  }

  const handleReportBug = () => {
    // You can integrate with your bug reporting system here
    const bugReport = {
      error: errorDetails.message,
      stack: errorDetails.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // For now, we'll just copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(bugReport, null, 2))
    alert('Error details copied to clipboard. Please report this to our support team.')
  }

  return (
    <div className="error-page-container flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="error-icon-container">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto error-pulse">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold error-gradient-text-red mb-4">Oops! Something went wrong</h1>
          <p className="text-2sm text-neutral-600 mb-6">We encountered an unexpected error. Our team has been notified and is working to fix it.</p>
          <p className="text-sm text-neutral-500">Don&apos;t worry, this happens to the best of us!</p>
        </div>

        {/* Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-neutral-100 rounded-lg text-left">
            <h3 className="font-semibold text-neutral-800 mb-2">Error Details (Development):</h3>
            <p className="text-sm text-neutral-600 font-mono break-all">{errorDetails.message}</p>
            {errorDetails.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-neutral-600 hover:text-neutral-800">View Stack Trace</summary>
                <pre className="mt-2 text-xs text-neutral-500 font-mono whitespace-pre-wrap break-all">{errorDetails.stack}</pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleRetry}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-600 hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
        </div>

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleReportBug}
            className="px-6 py-2 bg-neutral-100 text-neutral-700 font-medium rounded-lg hover:bg-neutral-200 transition-all duration-300"
          >
            Report Bug
          </button>

          <Link
            href="/contact"
            className="px-6 py-2 bg-neutral-100 text-neutral-700 font-medium rounded-lg hover:bg-neutral-200 transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-neutral-200">
          <p className="text-neutral-500 mb-4">While we fix this, you can:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/timeline" className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200">
              Check Timeline
            </Link>
            <Link href="/community" className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200">
              Browse Community
            </Link>
            <Link href="/messages" className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200">
              View Messages
            </Link>
            <Link href="/settings" className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200">
              Settings
            </Link>
          </div>
        </div>

        {/* Status Update */}
        <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
          <p className="text-sm text-neutral-600">
            <span className="font-semibold text-red-600">Status:</span> Our technical team is investigating this issue. If the problem persists,
            please contact our support team with the error details.
          </p>
        </div>
      </div>
    </div>
  )
}
