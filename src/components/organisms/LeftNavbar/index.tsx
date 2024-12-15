'use client'
import Card from '@/components/atoms/Card'
import React, { useState } from 'react'
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

interface Props {
  toggleLeftNavbar?: () => void | null
}

export default function LeftNavbar({ toggleLeftNavbar }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { userData, userProfileData } = useUniStore()

  const menuItems = [
    { name: 'Home', icon: <HiHome />, path: '/timeline' },
    { name: 'Connections', icon: <IoMdPeople />, path: '/connections' },
    { name: 'Message', icon: <BiSolidMessageDots />, path: '/messages' },
    { name: 'Notification', icon: <FaBell />, path: '/notifications' },
    { name: 'AI Assistant', icon: <PiFinnTheHumanFill />, path: '/ai-assistant' },
  ]

  const [activeMenu, setActiveMenu] = useState(pathname)

  const handleMenuClick = (item: { name: string; icon?: React.JSX.Element; path: string }) => {
    setActiveMenu(item.path)
    router.push(item.path)
    toggleLeftNavbar && toggleLeftNavbar()
  }

  const handleProfileClicked = () => {
    router.push(`/profile/${userData?.id}`)
    setActiveMenu('')
    toggleLeftNavbar && toggleLeftNavbar()
  }

  return (
    <Card className="h-with-navbar overflow-y-auto">
      <div onClick={handleProfileClicked} className="px-4 flex gap-4 cursor-pointer">
        <ProfilePicture userProfileData={userProfileData} />
        <div>
          <p className="text-sm text-neutral-700">
            {userData?.firstName} {userData?.lastName}
          </p>
          <Tooltip text={userProfileData?.university_name || ''}>
            <SubText>{truncateString(userProfileData?.university_name || '')}</SubText>
          </Tooltip>

          <SubText>{userProfileData?.major}</SubText>
        </div>
      </div>
      <div className="px-4 pt-9">
        <p className="text-2xs text-neutral-500 font-bold">EXPLORE</p>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex gap-2 cursor-pointer text-sm pt-[10px] ${
              activeMenu === item.path ? 'text-primary-700 font-semibold' : 'text-neutral-500'
            }`}
            onClick={() => handleMenuClick(item)}
          >
            <span className="text-[20px]">{item.icon}</span>
            <span className="">{item.name}</span>
          </div>
        ))}
      </div>
      <p className=" px-4 pb-4 pt-9 text-neutral-500 text-2xs font-bold">UNIVERSITIES</p>
      <NavbarUniversityItem setActiveMenu={setActiveMenu} toggleLeftNavbar={toggleLeftNavbar!} />
    </Card>
  )
}
