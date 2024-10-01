import LeftNavbar from '@/components/organisms/LeftNavbar'
import React, { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8 bg-surface-primary-50">
      <div className="w-1/5 hidden md:block ">
        <div className="fixed w-[288px] left-0 z-10 h-with-navbar  overflow-y-auto">
          <LeftNavbar />
        </div>
      </div>
      <div className="w-3/5">{children}</div>
      <div className="w-1/5  shadow-2xl bg-white hidden lg:block mt-1"></div>
    </div>
  )
}
