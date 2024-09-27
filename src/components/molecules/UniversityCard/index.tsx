'use client'
import Image from 'next/image'
import React from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { FaUniversity } from 'react-icons/fa'

interface Props {
  universityLogo: string
  universityName: string
  isAiPowered: boolean
  joinedSince: string
  description: string
  memberCount: number
  currSelectedGroup?: any
}

export default function UniversityCard({
  universityLogo,
  universityName = 'Lorem University',
  isAiPowered = true,
  joinedSince = '7/23/2024',
  description = 'Official community page for Lorem University. For inquiries contact the Human Resources Department in B-Wing of Northern Campus.',
  memberCount = 242,
  currSelectedGroup,
}: Props) {
  console.log('unisdasd', currSelectedGroup)

  return (
    <div className="rounded-2xl bg-white shadow-card">
      <div className=" relative h-[164px] w-full overflow-hidden rounded-t-2xl">
        <Image
          src={currSelectedGroup?.communityGroupLogoCoverUrl?.imageUrl || universityPlaceholder}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt={'university'}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="p-4">
        <div className="card-title flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="flex items-center justify-center bg-white rounded-full w-[40px] h-[40px]"
            >
              <FaUniversity className="text-warning-500 text-[20px]" />
            </div>
            <p className="text-sm font-bold">{currSelectedGroup?.title}</p>
            {isAiPowered && <p className="ai-power text-xs font-extrabold">AI POWERED </p>}
          </div>
          <p className="text-sm text-primary-500">
            Joined since <span>{joinedSince}</span>{' '}
          </p>
        </div>
        <div>
          <p className="text-2xs text-neutral-500 py-4">{description}</p>
          <p className="text-2xs text-neutral-500">
            <span>{currSelectedGroup?.memberCount}</span> members
          </p>
        </div>
      </div>
    </div>
  )
}
