'use client'

import React, { useEffect, useState } from 'react'
import { HiHome } from 'react-icons/hi'
import { IoMdPeople } from 'react-icons/io'
import { BiSolidMessageDots } from 'react-icons/bi'
import { FaBell } from 'react-icons/fa6'
import { PiFinnTheHumanFill } from 'react-icons/pi'
import NavbarUniversityItem from '@/components/molecules/NavbarUniversityItem'
import { usePathname, useRouter } from 'next/navigation'
import { useUniStore } from '@/store/store'
import botIcon from '@/assets/botIcon.svg'
import { useGetUserNotificationTotalCount, useGetUserUnreadMessagesTotalCount } from '@/services/notification'
import Image from 'next/image'

interface Props {
  toggleLeftNavbar?: () => void
}

const MENU_ITEMS = [
  { name: 'Home', icon: <HiHome />, path: '/timeline' },
  { name: 'Connections', icon: <IoMdPeople />, path: '/connections' },
  { name: 'Message', icon: <BiSolidMessageDots />, path: '/messages' },
  { name: 'Notification', icon: <FaBell />, path: '/notifications' },
  { name: 'AI Assistant', icon: <Image width={20} height={20} alt="" src={botIcon} />, path: '/ai-assistant' },
]
const PAGE_ITEMS = [
  { name: 'Community', path: '/timeline' },
  { name: 'Discover', path: '/discover' },
  { name: 'About', path: '/about' },
]

export default function LeftNavbar({ toggleLeftNavbar }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { userData } = useUniStore()
  const [activeMenu, setActiveMenu] = useState(pathname)
  const { data: userUnreadMessagesCount } = useGetUserUnreadMessagesTotalCount()
  const { data: unreadNotificationCount } = useGetUserNotificationTotalCount()

  //  useEffect(() => {
  //    setIsLogin(!!userProfileData?.users_id)
  //  }, [userProfileData])

  const handleMenuClick = (path: string) => {
    router.push(path)
    setActiveMenu(path)
    toggleLeftNavbar?.()
  }

  useEffect(() => {
    setActiveMenu(pathname)
  }, [pathname])

  return (
    <div className="h-with-navbar hideScrollbar  lg:p-6 overflow-y-auto">
      <div className=" block lg:hidden border-b-2 border-neutral-200 pb-4">
        <p className="text-xs text-neutral-500 font-bold py-2">PAGES</p>
        {PAGE_ITEMS.map(({ name, path }) => (
          <div
            key={path}
            className={`flex gap-2 cursor-pointer text-xs p-2 my-1 hover:bg-neutral-100 rounded-md  ${
              activeMenu === path ? 'font-bold' : 'text-neutral-500 font-semibold'
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
              activeMenu === path ? 'text-primary font-bold bg-surface-primary-50 rounded-md' : 'text-neutral-500 font-medium'
            }`}
            onClick={() => handleMenuClick(path)}
          >
            <span className="text-[20px]">{icon}</span>
            <span className="">{name}</span>
            {name == 'Message' && Number(userUnreadMessagesCount?.messageTotalCount) > 0 ? (
              <span
                className={` bg-destructive-600 ${
                  Number(userUnreadMessagesCount?.messageTotalCount) > 9 ? 'px-1  min-w-4' : ' w-4'
                } h-4 rounded-full text-white flex items-center justify-center  text-2xs font-semibold `}
              >
                {userUnreadMessagesCount?.messageTotalCount}
              </span>
            ) : (
              ''
            )}
            {name == 'Notification' && Number(unreadNotificationCount) > 0 ? (
              <span
                className={` bg-destructive-600 ${
                  Number(unreadNotificationCount) > 9 ? 'px-1  min-w-4' : ' w-4'
                } h-4 rounded-full text-white flex items-start justify-center  text-2xs font-semibold `}
              >
                {Number(unreadNotificationCount)}
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
