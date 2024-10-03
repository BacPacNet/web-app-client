import Image from 'next/image'
import React from 'react'
import eventImage from '@assets/event-image.jpg'
import format from 'date-fns/format'
import LoginButtons from '@/components/atoms/LoginButtons'

export default function UpcomingEvent({ eventDate = '29/07/2024' }) {
  return (
    <div>
      <p className="text-neutral-700 text-xs font-semibold">Upcoming Event</p>
      <div className="pt-6 pb-4">
        <Image src={eventImage} alt="eventImage" />
      </div>
      <div className="flex gap-3 items-center pb-4">
        <div className="shadow-medium w-[50px] h-[50px] rounded-lg border-[1px] border-neutral-200 flex flex-col justify-center items-center">
          <p className="text-neutral-400 text-xs font-extrabold">{format(new Date(2024, 1, 11), 'MMM')}</p>
          <p className="text-primary-500 text-sm font-extrabold">{format(new Date(2024, 8, 29), 'dd')}</p>
        </div>
        <div>
          <p className="text-xs font-normal text-neutral-700">TECHNO FEST 2024 Live </p>
          <p className="text-[10px] font-normal text-neutral-700">Lorem University</p>
        </div>
      </div>
      <div className="text-right">
        <LoginButtons variant="primary" size="extra_small">
          Check Post
        </LoginButtons>
      </div>
    </div>
  )
}
