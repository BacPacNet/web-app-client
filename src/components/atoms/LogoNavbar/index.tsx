'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import unibuzzLogo from '@assets/unibuzz_logo.svg'
import { MENU_LIST } from './constant'
import LoginButton from '../LoginButton'
import Button from '../Buttons'
import { usePathname, useRouter } from 'next/navigation'
import { useUniStore } from '@/store/store'
import avatar from '@assets/avatar.svg'
import { Skeleton } from '@/components/ui/Skeleton'
import { FaAngleDown, FaBell, FaRegUser } from 'react-icons/fa'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'

import { MdInfoOutline, MdOutlineLock, MdOutlineSettings } from 'react-icons/md'
import { PiChatTextBold, PiPaintBrushDuotone } from 'react-icons/pi'
import { TbLogout } from 'react-icons/tb'
import MobileViewNavbar from '@/components/organism/MobileViewNavbar'
import { useGetMessageNotification, useGetNotification } from '@/services/notification'
import { IoMenu } from 'react-icons/io5'
import { RxCross2 } from 'react-icons/rx'
import MobileLeftNavbar from '@/components/molecules/MobileLeftNavbar'
import { useLogout } from '@/hooks/useLogOut'

interface Props {
  showOnlyLogo?: boolean
}

const nonPaddingUrls = ['/university', '/about', '/discover', '/privacy-policy', '/terms-and-condition', '/user-guidelines', '/contact']
const nonHeaderUrls = ['/login', '/register', '/forget-password']

export default function LogoNavbar({ showOnlyLogo = false }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const shouldPadding = nonPaddingUrls.some((path) => pathname.includes(path)) || pathname === '/'
  const shouldHeaderRemove = nonHeaderUrls.some((path) => pathname.includes(path))

  const { userProfileData, userData } = useUniStore()

  const { handleLogout } = useLogout()
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined)

  const { reinitResetPasswordTimeout } = useUniStore((state) => state)

  const isUserLoggedIn = useCallback(() => {
    setIsLogin(!!userProfileData?.users_id)
  }, [userProfileData])
  const [showLeftNavbar, setShowLeftNavbar] = useState(false)
  const [showRightMenu, setShowRightMenu] = useState(false)

  useEffect(() => {
    isUserLoggedIn()
  }, [userProfileData, isUserLoggedIn])

  const toggleRightMenu = () => {
    setShowRightMenu(!showRightMenu)
    closeLeftNavbar()
  }
  const closeRightMenu = () => {
    setShowRightMenu(false)
  }

  useEffect(() => {
    reinitResetPasswordTimeout()
  }, [])

  const renderProfile = () => {
    switch (isLogin) {
      case true:
        return (
          <div className="flex gap-4 items-center pl-4">
            {/*<Popover>
              <PopoverTrigger>
                <div className="relative">
                  <FaBell className="text-primary-700 w-[20px] h-[20px]" />
                  {notifications.length > 0 && <p className="w-2 h-2 rounded-full bg-red-500 absolute top-0 right-0"></p>}
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 relative right-32 top-6 w-96 bg-white shadow-card border-none">
                <NotificationBox notifications={notifications} />
              </PopoverContent>
            </Popover>*/}
            {/* // message notification  */}
            {/*<Popover>
              <PopoverTrigger>
                <div className="relative">
                  <PiChatsBold className="text-primary-700 w-[20px] h-[20px]" />
                  {messageNotifications.length > 0 && <p className="w-2 h-2 rounded-full bg-red-500 absolute top-0 right-0"></p>}
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 relative right-28 top-6 w-96 bg-white shadow-card border-none">
                <MessageNotification message={messageNotifications} />
              </PopoverContent>
            </Popover>*/}
            <Popover>
              <PopoverTrigger>
                <div className="flex gap-2 items-center">
                  <Image
                    width={40}
                    height={40}
                    objectFit="cover"
                    className="w-[40px] object-cover h-[40px] rounded-full"
                    src={userProfileData?.profile_dp?.imageUrl || avatar}
                    alt="profile.png"
                  />
                  <FaAngleDown className="text-neutral-600" size={16} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 relative right-4 top-6 w-[168px] bg-white shadow-card border-none">
                <div>
                  <ul className="border-b-[1px] border-neutral-200 ">
                    <li
                      onClick={() => router.push(`/profile/${userData?.id}`)}
                      className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                    >
                      <FaRegUser />
                      <p>Profile</p>
                    </li>
                    <li
                      onClick={() => router.push('/setting')}
                      className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                    >
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
                  <ul onClick={handleLogout} className="">
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
          <div className="pl-8 gap-4 flex">
            <Button onClick={() => router.push('/register')} variant="border" className="text-xs">
              Sign Up
            </Button>
            <LoginButton onClick={() => router.push('/login')} className="text-xs">
              Login
            </LoginButton>
          </div>
        )
      default:
        return <Skeleton className="bg-slate-400 p-2 h-10 w-10 rounded-full ml-4" />
    }
  }
  const toggleLeftNavbar = () => {
    setShowLeftNavbar(!showLeftNavbar)
    closeRightMenu()
  }
  const closeLeftNavbar = () => {
    setShowLeftNavbar(false)
  }

  //   if (shouldHeaderRemove && (pathname.includes('/login') || pathname.includes('/forget-password'))) {
  //
  //     return null
  //   }

  if (shouldHeaderRemove)
    return (
      <div className="w-full flex items-center justify-center bg-neutral-100">
        <div className="max-width-allowed w-[1058px] h-[40px] sm:h-[68px] flex items-center px-8">
          <Link className="flex gap-4 center-v" href="/">
            <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full cursor-pointer w-[84px]" />
          </Link>
        </div>
      </div>
    )

  return (
    <>
      <div className="w-full h-[50px] sm:h-[68px] ">
        <div className="fixed w-full top-0 left-0 z-50 h-[inherit] bg-white border-b-[1px] border-neutral-200 ">
          <div
            className={`${shouldPadding ? 'max-width-allowed px-4' : 'max-w-[1280px] px-6'}
             relative h-[50px] sm:h-[68px]  mx-auto py-3 flex items-center justify-between bg-white top-0 border-b-[1px] border-neutral-200`}
          >
            <div className="flex gap-3 items-center">
              <div onClick={toggleLeftNavbar} className="block lg:hidden cursor-pointer">
                {!showLeftNavbar ? (
                  <IoMenu size={32} className="text-primary w-[24px] sm:w-[32px]" />
                ) : (
                  <RxCross2 size={32} className="text-primary w-[20px] sm:w-[32px]" />
                )}
              </div>
              <Link className="flex gap-4 center-v" href="/">
                <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full cursor-pointer sm:w-[84px] w-[70px]" />
              </Link>
            </div>
            {isLogin && <MobileViewNavbar closeLeftNavbar={closeLeftNavbar} toggleRightMenu={toggleRightMenu} showRightMenu={showRightMenu} />}
            {!showOnlyLogo && (
              <div className="items-center justify-between hidden lg:flex">
                <div className="flex gap-6 px-4">
                  {MENU_LIST.map((menu, index) => (
                    <p
                      onClick={() => router.push(menu.path)}
                      key={index}
                      className={`text-neutral-800 text-xs cursor-pointer ${pathname === menu.path ? 'font-extrabold' : ''}`}
                    >
                      {menu.name}
                    </p>
                  ))}
                </div>
                <div className=" flex border-l-[1px] border-neutral-200">{renderProfile()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileLeftNavbar toggleLeftNavbar={toggleLeftNavbar} isOpen={showLeftNavbar} />
    </>
  )
}
