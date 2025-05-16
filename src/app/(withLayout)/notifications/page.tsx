import NotificationContainer from '@/components/organisms/NotificationContainer'
import React from 'react'

export default function NotificationsPage() {
  return (
    <div className="py-4 h-[-webkit-fill-available]">
      <div className="rounded-2xl h-full overflow-hidden relative z-10 shadow-card bg-white ">
        <NotificationContainer />
      </div>
    </div>
  )
}
