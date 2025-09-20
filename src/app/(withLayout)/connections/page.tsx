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
    <div className="h-[inherit] py-4">
      <Card className="rounded-lg h-with-navbar-space overflow-hidden flex flex-col">
        <h6 className="font-poppins font-bold text-[20px] px-6 mb-4 flex-shrink-0">Connections</h6>
        <PillTabs tabs={tabs} className="flex-1 min-h-0" labelSize="medium" />
      </Card>
    </div>
  )
}
