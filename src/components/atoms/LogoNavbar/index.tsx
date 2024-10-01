'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import unibuzzLogo from '@assets/unibuzz_logo.svg'
import sparkles from '@assets/sparkles.svg'
import { MENU_LIST } from './constant'
import LoginButton from '../LoginButton'
import LoginButtons from '../LoginButtons'
import { usePathname } from 'next/navigation'
import { useUniStore } from '@/store/store'
import avatar from '@assets/avatar.svg'
import { Skeleton } from '@/components/ui/Skeleton'
import { FaAngleDown, FaBell, FaRegUser } from 'react-icons/fa'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { TiMessages } from 'react-icons/ti'
import { BiSolidMessageSquareDetail } from 'react-icons/bi'
import { MdInfoOutline, MdOutlineLock, MdOutlineSettings } from 'react-icons/md'
import { PiChatsBold, PiChatTextBold, PiPaintBrushDuotone } from 'react-icons/pi'
import { HiCubeTransparent } from 'react-icons/hi'
import { TbLogout } from 'react-icons/tb'

interface Props {
  showOnlyLogo?: boolean
}

const nonPaddingUrls = ['/', '/login', '/register']

export default function LogoNavbar({ showOnlyLogo = false }: Props) {
  const pathname = usePathname()
  const shouldPadding = nonPaddingUrls.includes(pathname)
  //  const [cookieValue] = useCookie('uni_user_token')
  const { userProfileData } = useUniStore()
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined)

  const isUserLoggedIn = useCallback(() => {
    setIsLogin(!!userProfileData.users_id)
  }, [userProfileData])
  useEffect(() => {
    isUserLoggedIn()
  }, [userProfileData])

  const renderProfile = () => {
    switch (isLogin) {
      case true:
        return (
          <div className="flex gap-4 items-center pl-4">
            <FaBell className="text-primary-700 w-[20px] h-[20px]" />
            <PiChatsBold className="text-primary-700 w-[20px] h-[20px]" />
            <Popover>
              <PopoverTrigger>
                <div className="flex gap-2 items-center">
                  <Image
                    width={40}
                    height={40}
                    objectFit="cover"
                    className="w-[40px] h-[40px] rounded-full"
                    src={userProfileData.cover_dp?.imageUrl || avatar}
                    alt="profile.png"
                  />
                  <FaAngleDown />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 relative right-4 top-6 w-[168px] bg-white shadow-card border-none">
                <div>
                  <ul className="border-b-[1px] border-neutral-200 ">
                    <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                      <FaRegUser />
                      <p>Profile</p>
                    </li>
                    <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                      <MdOutlineSettings />
                      <p>Settings</p>
                    </li>
                    <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                      <MdOutlineLock />
                      <p>Privacy</p>
                    </li>

                    <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                      <PiPaintBrushDuotone />
                      <p>Preferences</p>
                    </li>
                    <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                      <HiCubeTransparent />
                      <p>Upgrades</p>
                    </li>
                  </ul>
                  <ul className="border-b-[1px] border-neutral-200 ">
                    <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                      <MdInfoOutline />
                      <p>Help Center</p>
                    </li>
                    <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                      <PiChatTextBold />
                      <p>Feedback</p>
                    </li>
                  </ul>
                  <ul className="">
                    <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                      <TbLogout />
                      <p>Logout</p>
                    </li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )
      case false:
        return (
          <div className="pl-8 gap-4">
            <LoginButtons variant="border" className="text-xs">
              Sign Up
            </LoginButtons>
            <LoginButton className="text-xs">Login</LoginButton>
          </div>
        )
      default:
        return <Skeleton className="bg-slate-400 p-2 h-10 w-10 rounded-full ml-4" />
    }
  }

  return (
    <div className="w-full h-[68px]">
      <div
        className={`${shouldPadding ? 'px-28' : 'px-4'} w-ful w-full h-[68px]  mx-auto py-3 flex items-center justify-between bg-white fixed top-0`}
      >
        <div>
          <Link className="flex gap-4 center-v" href="/">
            <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full cursor-pointer" />
          </Link>
        </div>
        {!showOnlyLogo && (
          <div className="flex items-center justify-between">
            <div className="flex gap-16 px-8">
              {MENU_LIST.map((menu, index) => {
                if (menu.name === 'UPGRADE') {
                  return (
                    <div key={index} className="flex">
                      <Link className="text-primary-500 text-xs" href={menu.path}>
                        {menu.name}
                      </Link>
                      <Image className="ml-1" src={sparkles} alt="upgrade_icon" width={20} height={20} />
                    </div>
                  )
                }
                return (
                  <Link key={index} className="text-neutral-800 text-xs" href={menu.path}>
                    {menu.name}
                  </Link>
                )
              })}
            </div>
            <div className=" flex border-l-[1px] border-neutral-200">{renderProfile()}</div>
          </div>
        )}
      </div>
    </div>
  )
}
