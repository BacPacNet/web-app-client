'use client'
import React from 'react'
import { CommunityNavbarLinks } from '@/types/constants'
import { useRouter, usePathname } from 'next/navigation'
import { useUniStore } from '@/store/store'

const Navbar: React.FC = () => {
  // const tabs = ['Timeline', 'Profile', 'Notifications', 'Messages', 'Connections', 'University Community', 'Chatbot']
  const router = useRouter()
  const { userData } = useUniStore()
  const id = userData?.id
  const path = usePathname()
  const activeTab = path.split('/').pop()

  return (
    <nav className="bg-primary text-white items-center justify-between px-4 py-2 hidden lg:flex">
      <div className="flex items-center">
        {CommunityNavbarLinks.map((tab) => (
          <button
            key={tab.href}
            className={`px-3 mx-6 py-2 rounded-md ${
              activeTab === tab.label.toLocaleLowerCase() ? 'bg-[#501EE3]' : 'hover:bg-[#4f1ee3b3]'
            } transition-colors duration-300 text-xs`}
            onClick={() => {
              const targetHref = tab.href.replace(':id', `${id}`)
              router.push(targetHref)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div></div>
    </nav>
  )
}

export default Navbar
