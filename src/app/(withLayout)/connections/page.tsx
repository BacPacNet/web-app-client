'use client'
import Card from '@/components/atoms/Card'
import Tabs from '@/components/molecules/Tabs'
import FindPeople from '@/components/molecules/Tabs/FindPeople'
import Followers from '@/components/molecules/Tabs/Followers'
import Following from '@/components/molecules/Tabs/Following'
import Mutuals from '@/components/molecules/Tabs/Mutuals'
import React from 'react'

export default function ConnectionPage() {
  const tabs = [
    {
      label: 'Find People',
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
    <div className="py-4 h-with-navbar">
      <Card className="rounded-2xl h-full overflow-hidden px-4">
        <Tabs tabs={tabs} className={'h-full'} />
      </Card>
    </div>
  )
}
