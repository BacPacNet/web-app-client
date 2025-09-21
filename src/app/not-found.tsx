'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="error-404-container flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold error-gradient-text error-pulse">404</h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-neutral-800 mb-4">Oops! This page doesn&apos;t exist</h2>
          <p className="text-2sm text-neutral-600 mb-6">The page you&apos;re looking for seems to have vanished into the digital void.</p>
          <p className="text-sm text-neutral-500">Don&apos;t worry, even the best explorers sometimes take a wrong turn!</p>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="error-icon-container">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center error-bounce">
              <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="px-8 py-3 error-button-primary text-white font-semibold rounded-lg transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>

          <Link
            href="/"
            className="px-8 py-3 error-button-secondary text-purple-600 font-semibold rounded-lg transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4">Maybe you were looking for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/timeline" className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200">
              Timeline
            </Link>

            <Link href="/messages" className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200">
              Messages
            </Link>
            <Link href="/connections" className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200">
              Connections
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="my-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-purple-600">Fun fact:</span> The term &quot;404 error&quot; comes from room 404 at CERN, where the
            original web servers were located. The room was temporarily unavailable, giving birth to the most famous error message on the internet!
          </p>
        </div>
      </div>
    </div>
  )
}
