import Card from '@/components/atoms/Card'
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
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar2.png',
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8 bg-surface-primary-50 h-with-navbar overflow-auto px-4">
      <div className="w-1/5 hidden lg:block ">
        <div className="fixed min:w-[290px] w-1/5 left-0 z-10 ">
          <LeftNavbar />
        </div>
      </div>
      <div className="lg:w-3/5 w-full">{children}</div>
      <div className="w-1/5 hidden lg:block ">
        <div className="fixed w-1/5 right-0 z-10 overflow-y-auto ">
          <Card className="h-with-navbar overflow-y-auto px-4">
            {/*<UpcomingEvent />*/}
            <Recommendations people={recommendations} />
          </Card>
        </div>
      </div>
    </div>
  )
}
