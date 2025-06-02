// components/atoms/FullPageLoader.tsx
import Spinner from '@/components/atoms/spinner'
import React from 'react'

export default function FullPageLoader() {
  return (
    <div className="h-with-navbar flex justify-center items-center bg-white z-50">
      <Spinner />
    </div>
  )
}
