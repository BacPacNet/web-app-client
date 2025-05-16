'use client'
import Card from '@/components/atoms/Card'
import PillTabs from '@/components/molecules/PillTabs'
import FindPeople from '@/components/molecules/Tabs/FindPeople'
import Followers from '@/components/molecules/Tabs/Followers'
import Following from '@/components/molecules/Tabs/Following'
import Mutuals from '@/components/molecules/Tabs/Mutuals'
import React from 'react'

export default function ConnectionPage() {
  const tabs = [
    {
      label: 'All',
      content: <FindPeople />,
    },
    {
      label: 'Mutuals',
      content: <Mutuals />,
    },
    {
      label: 'Following',
      content: <Following />,
    },
    {
      label: 'Follower',
      content: <Followers />,
    },
  ]

  return (
    <div className="h-[-webkit-fill-available] py-4">
      <Card className="rounded-2xl h-full overflow-hidden px-4">
        {/* <Tabs tabs={tabs} className={'h-full'} /> */}
        <h6 className="font-poppins font-bold text-[20px]  mb-4">Connections</h6>
        <PillTabs tabs={tabs} className={'h-full'} labelSize="medium" />
      </Card>
    </div>
  )
}
