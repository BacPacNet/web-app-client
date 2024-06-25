import FindPeople from '@/components/Connections/FindPeople'
import Navbar from '@/components/Timeline/Navbar'
import Recommendations from '@/components/Timeline/Recommendations'
import React from 'react'

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
]

const Connections = () => {
  return (
    <div>
      <Navbar />
      <div className="flex mt-12 gap-8 justify-center">
        <FindPeople contentDivStyle="max-h-[500px]" />
        <Recommendations
          people={recommendations}
          userItemButtonStyle="lg:block"
          containerStyle="border border-border h-fit shadow-none"
          itemStyle="gap-9"
        />
      </div>
    </div>
  )
}

export default Connections
