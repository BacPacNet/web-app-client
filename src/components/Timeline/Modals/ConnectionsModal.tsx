/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import UserListItem from '../UserListItem'

const followingData = [
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    role: '2nd Yr. Undergraduate, Psychology',
    tags: [
      { label: '2nd Yr', color: 'bg-purple-500' },
      { label: 'Undergraduate', color: 'bg-green' },
      { label: 'Law', color: 'bg-red-500' },
    ],
  },
  {
    name: 'Jonathan Park',
    university: 'Nagoya University',
    role: '2nd Yr. Undergraduate, Law',
    tags: [
      { label: '2nd Yr', color: 'bg-purple-500' },
      { label: 'Undergraduate', color: 'bg-green' },
      { label: 'Law', color: 'bg-red-500' },
    ],
  },
  {
    name: 'Pathova Siena',
    university: 'Nagoya University',
    role: '4th Year PhD Lab of Semiconductors',
    tags: [
      { label: '4th Yr', color: 'bg-purple-500' },
      { label: 'PhD', color: 'bg-green' },
      { label: 'Physics', color: 'bg-cyan-500' },
    ],
  },
  {
    name: 'Danny Tela',
    university: 'Nagoya University',
    role: 'Assistant Professor of Molecular Neuroscience',
    tags: [
      { label: 'Assistant Professor', color: 'bg-purple-700' },
      { label: 'Molecular Neuroscience', color: 'bg-red-500' },
    ],
  },
  {
    name: 'Gretha Bassuk',
    university: 'Nagoya University',
    role: 'Professor',
    tags: [
      { label: 'Professor', color: 'bg-blue-500' },
      { label: 'Philosopy', color: 'bg-red-500' },
    ],
  },
]

const ConnectionsModal = () => {
  const [content, setContent] = useState<'Following' | 'Followers'>('Following')

  return (
    <div>
      <div className="flex items-center justify-start cursor-pointer">
        <p
          className={`px-4 py-2 hover:text-primary text-sm ${content === 'Following' ? 'font-semibold' : 'font-medium'}`}
          onClickCapture={() => setContent('Following')}
        >
          Following
        </p>
        <p
          className={`px-4 py-2 hover:text-primary text-sm ${content === 'Followers' ? 'font-semibold' : 'font-medium'}`}
          onClickCapture={() => setContent('Followers')}
        >
          Followers
        </p>
      </div>
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden overflow-y-auto ">
        {content === 'Following' && followingData.map((item, index) => <UserListItem key={index} {...item} />)}
      </div>
    </div>
  )
}

export default ConnectionsModal
