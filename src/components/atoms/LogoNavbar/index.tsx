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

import { Skeleton } from '@/components/ui/Skeleton'
import MobileViewNavbar from '@/components/organism/MobileViewNavbar'
import { IoMenu } from 'react-icons/io5'
import { RxCross2 } from 'react-icons/rx'
import MobileLeftNavbar from '@/components/molecules/MobileLeftNavbar'
import { useLogout } from '@/hooks/useLogOut'
import ProfileMenu from '../ProfileMenu'
import NavigationMenu from '../NavigationMenu'

interface Props {
  showOnlyLogo?: boolean
}

const nonPaddingUrls = ['/about', '/discover', '/privacy-policy', '/terms-and-condition', '/user-guidelines', '/contact']
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
    const handleNavigate = (path: string) => {
      router.push(path)
    }

    switch (isLogin) {
      case true:
        return <ProfileMenu userProfileData={userProfileData} userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} />
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
                <NavigationMenu menuList={MENU_LIST} currentPath={pathname} onNavigate={(path) => router.push(path)} />
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
