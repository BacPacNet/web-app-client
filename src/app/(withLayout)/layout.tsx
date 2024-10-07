import UpcomingEvent from '@/components/molecules/UpcomingEvent'
import LeftNavbar from '@/components/organisms/LeftNavbar'
import Recommendations from '@/components/Timeline/Recommendations'
import React, { useState } from 'react'

const recommendations = [
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar.png',
  },
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar2.png',
  },
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar.png',
  },
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar2.png',
  },
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar.png',
  },
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar2.png',
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8 bg-surface-primary-50">
      <div className="w-1/5 hidden md:block ">
        <div className="fixed w-[288px] left-0 z-10 ">
          <LeftNavbar />
        </div>
      </div>
      <div className="lg:w-3/5 md:w-4/5 w-full ">{children}</div>
      <div className="w-1/5 py-9 px-4 shadow-2xl bg-white hidden lg:block mt-1 h-auto">
        <UpcomingEvent />
        <Recommendations people={recommendations} />
      </div>
    </div>
  )
}
