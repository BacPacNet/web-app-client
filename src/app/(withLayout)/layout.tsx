import LeftNavbar from '@/components/organisms/LeftNavbar'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8 py-8 ">
      <div className="w-1/5 h-full hidden md:block   sticky top-0 left-0  ">
        <LeftNavbar />
      </div>
      <div className="w-3/5">{children}</div>
      <div className="w-1/5 rounded-2xl shadow-2xl bg-white hidden lg:block"></div>
    </div>
  )
}
