'use client'

import Card from '@/components/atoms/Card'
import LeftNavbar from '@/components/organisms/LeftNavbar'
import Recommendations from '@/components/Timeline/Recommendations'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FooterLinks from '@/components/molecules/FooterLinks'
import DownloadApp from '@/components/Timeline/rightSidebar/downloadApp'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // adjust delay as needed

    return () => clearTimeout(timer)
  }, [pathname])

  //  if (isLoading) {
  //    return <Spinner />
  //  }

  return (
    <div className="bg-surface-primary-50">
      {isLoading && <div className="fixed top-0 left-0 w-full h-1 bg-primary-500 animate-pulse z-50"></div>}
      <div className="max-w-[1280px] mx-auto flex h-with-navbar">
        {/* Left Sidebar - Fixed */}
        <aside className="hidden lg:block bg-white w-[284px] sticky top-0">
          <LeftNavbar />
        </aside>

        {/* Main Content - Scrollable */}
        <main className="md:px-12 px-4 overflow-y-auto h-with-navbar flex-1 !outline-none hideScrollbar">{children}</main>

        {/* Right Sidebar - Fixed */}
        <aside className="hidden lg:block bg-white w-[284px] sticky top-0">
          <Card className="h-with-navbar custom-scrollbar overflow-y-auto px-4">
            <DownloadApp />
            <Recommendations />
            <FooterLinks isOnLeft={true} />
            <p className="text-neutral-500 text-xs font-normal text-center">Unibuzz Networks © 2024 </p>
          </Card>
        </aside>
      </div>
    </div>
  )
}
