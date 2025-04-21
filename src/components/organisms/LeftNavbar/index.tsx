'use client'

import Card from '@/components/atoms/Card'
import React, { useEffect, useState, useMemo } from 'react'
import SubText from '@/components/atoms/SubText'
import { HiHome } from 'react-icons/hi'
import { IoMdPeople } from 'react-icons/io'
import { BiSolidMessageDots } from 'react-icons/bi'
import { FaBell } from 'react-icons/fa6'
import { PiFinnTheHumanFill } from 'react-icons/pi'
import NavbarUniversityItem from '@/components/molecules/NavbarUniversityItem'
import { usePathname, useRouter } from 'next/navigation'
import { useUniStore } from '@/store/store'
import { truncateString } from '@/lib/utils'
import Tooltip from '@/components/atoms/Tooltip'
import ProfilePicture from '@/components/atoms/RenderProfileDP'
import useCookie from '@/hooks/useCookie'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { useGetUserUnreadMessagesTotalCount } from '@/services/notification'

interface Props {
  toggleLeftNavbar?: () => void
}

const MENU_ITEMS = [
  { name: 'Home', icon: <HiHome />, path: '/timeline' },
  { name: 'Connections', icon: <IoMdPeople />, path: '/connections' },
  { name: 'Message', icon: <BiSolidMessageDots />, path: '/messages' },
  { name: 'Notification', icon: <FaBell />, path: '/notifications' },
  { name: 'AI Assistant', icon: <PiFinnTheHumanFill />, path: '/ai-assistant' },
]
const PAGE_ITEMS = [
  { name: 'Discover', path: '/discover' },
  { name: 'Community', path: '/timeline' },
  { name: 'About', path: '/about' },
]

export default function LeftNavbar({ toggleLeftNavbar }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { userData, userProfileData } = useUniStore()
  const [cookie] = useCookie('uni_user_token')
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined)
  const [activeMenu, setActiveMenu] = useState(pathname)
  const { data: userUnreadMessagesCount } = useGetUserUnreadMessagesTotalCount()

  useEffect(() => {
    setIsLogin(!!userProfileData?.users_id)
  }, [userProfileData])

  const handleMenuClick = (path: string) => {
    router.push(path)
    setActiveMenu(path)
    toggleLeftNavbar?.()
  }

  const handleProfileClick = () => {
    router.push(`/profile/${userData?.id}`)
    setActiveMenu('')
    toggleLeftNavbar?.()
  }

  return (
    <div className="h-with-navbar custom-scrollbar  lg:p-6 overflow-y-auto">
      <div className=" block lg:hidden border-b-2 border-neutral-200 pb-4">
        <p className="text-xs text-neutral-500 font-bold py-2">Pages</p>
        {PAGE_ITEMS.map(({ name, path }) => (
          <div
            key={path}
            className={`flex gap-2 cursor-pointer text-xs p-2 my-1 hover:bg-neutral-100 rounded-md  ${
              activeMenu === path ? 'text-primary-700 font-bold bg-surface-primary-50 rounded-md' : 'text-neutral-500 font-semibold'
            }`}
            onClick={() => handleMenuClick(path)}
          >
            <span className="">{name}</span>
          </div>
        ))}
      </div>

      <div className="border-b-2 border-neutral-200 pb-4">
        <p className="text-xs text-neutral-500 font-bold py-2">COMMUNITY</p>
        {MENU_ITEMS.map(({ name, icon, path }) => (
          <div
            key={path}
            className={`flex items-center gap-2 cursor-pointer text-xs p-2 my-1 hover:bg-neutral-100 rounded-md  ${
              activeMenu === path ? 'text-primary-700 font-bold bg-surface-primary-50 rounded-md' : 'text-neutral-500 font-semibold'
            }`}
            onClick={() => handleMenuClick(path)}
          >
            <span className="text-[20px]">{icon}</span>
            <span className="">{name}</span>
            {name == 'Message' && Number(userUnreadMessagesCount?.messageTotalCount) > 0 ? (
              <span className="bg-destructive-600 w-4 h-4 rounded-full text-white flex items-center justify-center  text-2xs font-semibold ">
                {userUnreadMessagesCount?.messageTotalCount}
              </span>
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
      {userData?.email && (
        <>
          <p className="text-xs text-neutral-500 font-bold mt-4 py-2 ">UNIVERSITIES</p>
          <NavbarUniversityItem setActiveMenu={setActiveMenu} toggleLeftNavbar={toggleLeftNavbar!} />
        </>
      )}
    </div>
  )
}
