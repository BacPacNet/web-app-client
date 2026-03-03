'use client'

import React, { useEffect, useState } from 'react'
import { HiHome } from 'react-icons/hi'
import { IoMdPeople } from 'react-icons/io'
import { BiSolidMessageDots } from 'react-icons/bi'
import { FaBell } from 'react-icons/fa6'
import NavbarUniversityItem from '@/components/molecules/NavbarUniversityItem'
import { usePathname, useRouter } from 'next/navigation'
import { useUniStore } from '@/store/store'
import { useGetUserNotificationTotalCount, useGetUserUnreadMessagesTotalCount } from '@/services/notification'
import NotificationBadge from '@/components/atoms/NotificationBadge'
import { useGetUserEligibleForRewards } from '@/services/user'

const RewardsIcon = ({ className }: { className?: string }) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 13.3333C9.54167 13.3333 9.14944 13.1703 8.82333 12.8442C8.49722 12.5181 8.33389 12.1256 8.33333 11.6667C8.33278 11.2078 8.49611 10.8156 8.82333 10.49C9.15056 10.1644 9.54278 10.0011 10 10C10.4572 9.99889 10.8497 10.1622 11.1775 10.49C11.5053 10.8178 11.6683 11.21 11.6667 11.6667C11.665 12.1233 11.5019 12.5158 11.1775 12.8442C10.8531 13.1725 10.4606 13.3356 10 13.3333ZM6.14583 5.83333H13.8542L15.5208 2.5H4.47917L6.14583 5.83333ZM7 17.5H13C14.25 17.5 15.3125 17.0661 16.1875 16.1983C17.0625 15.3306 17.5 14.2644 17.5 13C17.5 12.4722 17.4097 11.9583 17.2292 11.4583C17.0486 10.9583 16.7917 10.5069 16.4583 10.1042L14.2917 7.5H5.70833L3.54167 10.1042C3.20833 10.5069 2.95139 10.9583 2.77083 11.4583C2.59028 11.9583 2.5 12.4722 2.5 13C2.5 14.2639 2.93417 15.33 3.8025 16.1983C4.67083 17.0667 5.73667 17.5006 7 17.5Z"
      fill="currentColor"
    />
  </svg>
)
interface Props {
  toggleLeftNavbar?: () => void
}

const MENU_ITEMS = [
  { name: 'Home', icon: <HiHome />, path: '/timeline' },
  { name: 'Connections', icon: <IoMdPeople />, path: '/connections' },
  { name: 'Message', icon: <BiSolidMessageDots />, path: '/messages' },
  { name: 'Notification', icon: <FaBell />, path: '/notifications' },
  { name: 'Rewards', icon: <RewardsIcon />, path: '/rewards' },
  // { name: 'AI Assistant', icon: <Image width={20} height={20} alt="" src={botIcon} />, path: '/ai-assistant' },
]
const PAGE_ITEMS = [
  { name: 'Community', path: '/timeline' },
  { name: 'Discover', path: '/discover' },
  { name: 'About', path: '/about' },
]

export default function LeftNavbar({ toggleLeftNavbar }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { userData, userEligibleForRewards, setUserEligibleForRewards } = useUniStore()
  const [activeMenu, setActiveMenu] = useState(pathname)
  const { data: userUnreadMessagesCount } = useGetUserUnreadMessagesTotalCount()
  const { data: unreadNotificationCount } = useGetUserNotificationTotalCount()
  const { data: userEligibleForRewardsData } = useGetUserEligibleForRewards()

  useEffect(() => {
    setUserEligibleForRewards(userEligibleForRewardsData ?? null)
  }, [userEligibleForRewardsData, setUserEligibleForRewards])

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
        {MENU_ITEMS.filter((item) => item.name != 'Rewards' || (item.name == 'Rewards' && (userEligibleForRewards?.eligible ?? false))).map(
          ({ name, icon, path }) => (
            <div
              key={path}
              className={`flex items-center gap-2 cursor-pointer text-xs p-2 my-1 hover:bg-neutral-100 rounded-md  ${
                activeMenu === path ? 'text-primary font-bold bg-surface-primary-50 rounded-md' : 'text-neutral-500 font-medium'
              }`}
              onClick={() => handleMenuClick(path)}
            >
              <span className="text-[20px]">{icon}</span>
              <span className="">{name}</span>
              {name == 'Message' && Number(userUnreadMessagesCount?.messageTotalCount) > 0 && (
                <NotificationBadge count={Number(userUnreadMessagesCount?.messageTotalCount)} maxCount={9} />
              )}
              {name == 'Notification' && Number(unreadNotificationCount) > 0 && (
                <NotificationBadge count={Number(unreadNotificationCount)} maxCount={99} />
              )}
            </div>
          )
        )}
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
