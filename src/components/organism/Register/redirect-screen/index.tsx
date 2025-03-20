'use client'

import React from 'react'
import users from '@/assets/usersRegisterLogo.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import ProgressBar from 'react-customizable-progressbar'
import { useRouter } from 'next/navigation'
import useCookie from '@/hooks/useCookie'
import { useHandleLogin } from '@/services/auth'

const RedirectFromRegister = () => {
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [cookieLoginValue, setCookieLoginValue, deleteCookie] = useCookie('login_data')
  const { mutate: login, error, isPending } = useHandleLogin()
  const [isTimeComplete, setIsTimeComplete] = useState(false)
  useEffect(() => {
    setProgress(100)

    const timeout = setTimeout(() => {
      //   router.push('/timeline')

      setIsTimeComplete(true)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (cookieLoginValue) {
      login(JSON.parse(cookieLoginValue))
    }
  }, [isTimeComplete])

  return (
    <div className="h-with-navbar flex   bg-neutral-100 flex-col items-center justify-center px-8 pt-16">
      <div className=" flex  flex-col gap-8 items-center  max-width-allowed w-[392px] h-full">
        <Image src={users.src} alt="logo" width={392} height={226} className="" />
        <div className=" flex  flex-col gap-1 items-center">
          <ProgressBar
            radius={32}
            progress={progress}
            strokeWidth={8}
            strokeColor="#6744FF"
            trackStrokeColor="#F3F2FF"
            strokeLinecap="square"
            trackStrokeWidth={8}
            steps={100}
            transition="3s ease"
          />
          <p className="text-sm text-neutral-700 ">Login you in...</p>
        </div>
      </div>
    </div>
  )
}

export default RedirectFromRegister
