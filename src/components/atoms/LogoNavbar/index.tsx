'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
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

const nonHeaderUrls = ['/login', '/register', '/forget-password']

const isLandingRoute = (pathname: string) => pathname === '/' || pathname.startsWith('/for-university') || pathname.startsWith('/book-demo')

export default function LogoNavbar({ showOnlyLogo = false }: Props) {
  const pathname = usePathname() ?? ''
  const isLogoLinkDisabled = pathname.includes('/book-demo') || pathname.includes('/for-university')
  const router = useRouter()
  const { userProfileData, userData } = useUniStore()
  const { handleLogout } = useLogout()
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined)
  const { reinitResetPasswordTimeout } = useUniStore((state) => state)
  const [showLeftNavbar, setShowLeftNavbar] = useState(false)
  const [showRightMenu, setShowRightMenu] = useState(false)

  const isUserLoggedIn = useCallback(() => {
    setIsLogin(!!userProfileData?.users_id)
  }, [userProfileData])

  useEffect(() => {
    isUserLoggedIn()
  }, [userProfileData, isUserLoggedIn])

  useEffect(() => {
    reinitResetPasswordTimeout()
  }, [reinitResetPasswordTimeout])

  const shouldHeaderRemove = nonHeaderUrls.some((path) => pathname.includes(path))
  const navbarContainerClass = 'max-width-allowed px-4'
  const showAudienceToggle = isLandingRoute(pathname)
  const activeAudience: 'faculty' | 'student' = pathname === '/' ? 'student' : 'faculty'

  const handleAudienceToggle = (audience: 'faculty' | 'student') => {
    const target = audience === 'faculty' ? '/for-university' : '/'
    if (pathname !== target) {
      router.push(target)
    }
  }

  const toggleRightMenu = () => {
    setShowRightMenu(!showRightMenu)
    closeLeftNavbar()
  }
  const closeRightMenu = () => {
    setShowRightMenu(false)
  }

  const isLandingCustomPage = pathname.includes('/for-university') || pathname.includes('/book-demo') || pathname.includes('/thank-you')

  const renderProfile = () => {
    const handleNavigate = (path: string) => {
      router.push(path)
    }

    switch (isLogin) {
      case true:
        return <ProfileMenu userProfileData={userProfileData} userData={userData} onLogout={handleLogout} onNavigate={handleNavigate} />
      case false:
        if (isLandingCustomPage) {
          return (
            <div className="pl-8 gap-4 flex">
              <Button onClick={() => router.push('/book-demo')} variant="primary" className="text-xs">
                Book a Free Demo
              </Button>
            </div>
          )
        }

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
          {isLogoLinkDisabled ? (
            <div className="flex gap-4 center-v">
              <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full w-[84px]" />
            </div>
          ) : (
            <Link className="flex gap-4 center-v" href="/">
              <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full cursor-pointer w-[84px]" />
            </Link>
          )}
        </div>
      </div>
    )

  return (
    <>
      <div className="w-full h-[50px] sm:h-[68px] ">
        <div className="fixed w-full top-0 left-0 z-50 h-[inherit] bg-white border-b-[1px] border-neutral-200 ">
          <div
            className={`${navbarContainerClass}
             relative h-[50px] sm:h-[68px]  mx-auto py-3 flex items-center justify-between bg-white top-0 border-b-[1px] border-neutral-200`}
          >
            <div className="flex gap-3 items-center">
              {(!isLandingCustomPage || isLogin) && (
                <div onClick={toggleLeftNavbar} className="block lg:hidden cursor-pointer">
                  {!showLeftNavbar ? (
                    <IoMenu size={32} className="text-primary w-[24px] sm:w-[32px]" />
                  ) : (
                    <RxCross2 size={32} className="text-primary w-[20px] sm:w-[32px]" />
                  )}
                </div>
              )}
              {isLogoLinkDisabled ? (
                <div className="flex gap-4 center-v">
                  <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full sm:w-[84px] w-[70px]" />
                </div>
              ) : (
                <Link className="flex gap-4 center-v" href="/">
                  <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full cursor-pointer sm:w-[84px] w-[70px]" />
                </Link>
              )}
              {showAudienceToggle && !isLandingCustomPage && (
                <div className="flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200">
                  <button
                    type="button"
                    className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all ${
                      activeAudience === 'faculty' ? 'bg-primary-500 text-white shadow-sm' : 'text-neutral-600'
                    }`}
                    onClick={() => handleAudienceToggle('faculty')}
                  >
                    Faculty
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all ${
                      activeAudience === 'student' ? 'bg-primary-500 text-white shadow-sm' : 'text-neutral-600'
                    }`}
                    onClick={() => handleAudienceToggle('student')}
                  >
                    Student
                  </button>
                </div>
              )}
            </div>
            {isLogin && <MobileViewNavbar closeLeftNavbar={closeLeftNavbar} toggleRightMenu={toggleRightMenu} showRightMenu={showRightMenu} />}
            {!showOnlyLogo && (
              <div className="items-center justify-between hidden lg:flex">
                {!isLandingCustomPage && <NavigationMenu menuList={MENU_LIST} currentPath={pathname} onNavigate={(path) => router.push(path)} />}
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
