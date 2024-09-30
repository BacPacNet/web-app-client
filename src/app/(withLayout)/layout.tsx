import LeftNavbar from '@/components/organisms/LeftNavbar'
import React, { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen gap-8 py-8">
      <div className="w-1/5 hidden md:block">
        <LeftNavbar />
      </div>
      <div className="w-3/5">{children}</div>
      <div className="w-1/5 rounded-2xl shadow-2xl bg-white hidden lg:block"></div>
    </div>
  )
}
