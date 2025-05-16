'use client'
import Card from '@/components/atoms/Card'
import LeftNavbar from '@/components/organisms/LeftNavbar'
import Recommendations from '@/components/Timeline/Recommendations'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import dummy from '@/assets/avatar.svg'

const recommendations = [
  {
    name: 'Roberta Green',
    university: 'Computer Science and Engineering',
    study_year: '2nd Yr, Psychology',
    avatar: dummy,
  },
  {
    name: 'Roberta Green',
    university: 'Computer Science and Engineering',
    study_year: '2nd Yr, Psychology',
    avatar: dummy,
  },
  {
    name: 'Roberta Green',
    university: 'Computer Science and Engineering',
    study_year: '2nd Yr, Psychology',
    avatar: dummy,
  },
  {
    name: 'Roberta Green',
    university: 'Computer Science and Engineering',
    study_year: '2nd Yr, Psychology',
    avatar: dummy,
  },
  {
    name: 'Roberta Green',
    university: 'Computer Science and Engineering',
    study_year: '2nd Yr, Psychology',
    avatar: dummy,
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 400) // adjust duration if needed

    return () => clearTimeout(timer)
  }, [pathname])
  return (
    <div className="bg-surface-primary-50">
      {isLoading && <div className="fixed top-0 left-0 w-full h-1 bg-primary-500 animate-pulse z-50"></div>}
      <div className="max-w-[1280px] mx-auto flex h-with-navbar">
        {/* Left Sidebar - Fixed */}
        <aside className="hidden lg:block  bg-white w-[284px] sticky top-0">
          <LeftNavbar />
        </aside>

        {/* Main Content - Scrollable */}
        <main className="md:px-12 px-4 overflow-y-auto h-with-navbar flex-1  outline-none ">{children}</main>

        {/* Right Sidebar - Fixed */}
        <aside className="hidden lg:block  bg-white w-[284px] sticky top-0">
          <Card className="h-with-navbar custom-scrollbar overflow-y-auto px-4">
            <Recommendations people={recommendations} />
          </Card>
        </aside>
      </div>
    </div>
  )
}
