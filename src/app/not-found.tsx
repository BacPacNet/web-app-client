'use client'

import Buttons from '@/components/atoms/Buttons'
import Footer from '@/components/Footer/Footer'
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
    <div className="h-with-navbar  flex flex-col justify-between">
      <div className=" flex items-center justify-center bg-white px-4 flex-1">
        <div className="text-center">
          <h1 className="text-[100px] font-extrabold font-poppins text-[#6A3FFB] ">404</h1>

          <div className="w-16 h-0.5 bg-[#6A3FFB] mx-auto mb-6"></div>

          <h2 className="text-xl font-bold font-poppins text-[#18191A] mb-4">Page Not Found</h2>

          <p className="text-sm text-[#6B7280] mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to a different domain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Buttons onClick={() => router.replace('/')} variant="primary" size="large">
              Go Home
            </Buttons>
            <Buttons onClick={() => router.back()} variant="border" size="large">
              Go Back
            </Buttons>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
