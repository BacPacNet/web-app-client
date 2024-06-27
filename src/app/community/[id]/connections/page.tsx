import FindPeople from '@/components/Connections/FindPeople'
import Footer from '@/components/Footer/Footer'
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

const Connections = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row my-12 gap-8 justify-center mx-4 md:mx-20 lg:mx-0">
        <FindPeople contentDivStyle="max-h-[500px]" />
        <Recommendations
          people={recommendations}
          userItemButtonStyle="lg:block"
          containerStyle="border border-border h-fit shadow-none"
          itemStyle="gap-9"
        />
      </div>
      <Footer />
    </div>
  )
}

export default Connections
