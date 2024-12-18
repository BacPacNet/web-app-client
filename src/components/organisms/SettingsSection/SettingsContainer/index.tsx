'use client'
import React from 'react'
import SettingAccount from '../SettingTabs/SettingAccount'
import Tabs from '@/components/molecules/Tabs'

const SettingContainer = () => {
  const tabs = [
    {
      label: 'Accounts',
      content: <SettingAccount />,
    },
    {
      label: `Privacy`,
      content: <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Privacy</div>,
    },
    {
      label: `Security`,
      content: <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Security</div>,
    },
    {
      label: `Preferences`,
      content: <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Preferences</div>,
    },
  ]
  return (
    <div className="bg-white mt-4 rounded-2xl drop-shadow-lg h-with-navbar-space">
      <Tabs tabs={tabs} className={'h-full overflow-y-scroll custom-scrollbar py-2 ps-10'} />
    </div>
  )
}

export default SettingContainer
