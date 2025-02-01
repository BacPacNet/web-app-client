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

export default function LeftNavbar({ toggleLeftNavbar }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { userData, userProfileData } = useUniStore()
  const [cookie] = useCookie('uni_user_token')
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined)
  const [activeMenu, setActiveMenu] = useState(pathname)

  useEffect(() => {
    setIsLogin(!!userProfileData?.users_id)
  }, [userProfileData])

  const handleMenuClick = (path: string) => {
    if (!cookie) return router.push('/login')
    router.push(path)
    setActiveMenu(path)
    toggleLeftNavbar?.()
  }

  const handleProfileClick = () => {
    router.push(`/profile/${userData?.id}`)
    setActiveMenu('')
    toggleLeftNavbar?.()
  }

  const renderProfile = useMemo(() => {
    if (isLogin === undefined) {
      return (
        <div className="px-4 flex gap-4 cursor-pointer items-center">
          <div className="w-[60px] h-[60px] rounded-full bg-neutral-300 animate-pulse" />
          <div className="flex flex-col gap-2">
            <p className="bg-neutral-300 animate-pulse h-3 w-40" />
            <p className="bg-neutral-300 animate-pulse h-3 w-20" />
            <p className="bg-neutral-300 animate-pulse h-3 w-20" />
          </div>
        </div>
      )
    }

    return (
      <div onClick={handleProfileClick} className="px-4 flex gap-4 cursor-pointer">
        {isLogin ? (
          <>
            <ProfilePicture userProfileData={userProfileData} />
            <div>
              <p className="text-sm text-neutral-700">
                {userData?.firstName} {userData?.lastName}
              </p>
              <Tooltip text={userProfileData?.university_name || ''}>
                <SubText>{truncateString(userProfileData?.university_name || '')}</SubText>
              </Tooltip>
              <SubText>{truncateString(userProfileData?.major || '')}</SubText>
            </div>
          </>
        ) : (
          <>
            <Image width={60} height={60} className="w-[60px] h-[60px] rounded-full flex-none" src={avatar} alt="profile.png" />
            <div>
              <p className="text-sm text-neutral-700">Anonymous</p>
              <SubText>University Details</SubText>
              <SubText>Degree Details</SubText>
            </div>
          </>
        )}
      </div>
    )
  }, [isLogin, userData, userProfileData, handleProfileClick])

  return (
    <Card className="h-with-navbar overflow-y-auto">
      {renderProfile}
      <div className="px-4 pt-9">
        <p className="text-2xs text-neutral-500 font-bold">EXPLORE</p>
        {MENU_ITEMS.map(({ name, icon, path }) => (
          <div
            key={path}
            className={`flex gap-2 cursor-pointer text-sm pt-[10px] ${activeMenu === path ? 'text-primary-700 font-semibold' : 'text-neutral-500'}`}
            onClick={() => handleMenuClick(path)}
          >
            <span className="text-[20px]">{icon}</span>
            <span>{name}</span>
          </div>
        ))}
      </div>
      {userData?.email && (
        <>
          <p className="px-4 pb-4 pt-9 text-neutral-500 text-2xs font-bold">UNIVERSITIES</p>
          <NavbarUniversityItem setActiveMenu={setActiveMenu} toggleLeftNavbar={toggleLeftNavbar!} />
        </>
      )}
    </Card>
  )
}
