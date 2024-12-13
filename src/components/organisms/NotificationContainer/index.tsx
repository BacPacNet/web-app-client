'use client'
import Tabs from '@/components/molecules/Tabs'
import React from 'react'
import NotificationTab from '../NotificationTabs/NotificationTab'

const NotificationContainer = () => {
  const tabs = [
    {
      label: 'Notifications',
      content: <NotificationTab />,
    },
    {
      label: `Settings`,
      content: <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Settings</div>,
    },
  ]

  return (
    <div className="bg-white mt-4 rounded-2xl drop-shadow-lg h-with-navbar-space">
      <Tabs tabs={tabs} className={'  py-2 ps-10'} />
    </div>
  )
}

export default NotificationContainer
