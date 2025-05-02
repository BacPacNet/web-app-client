'use client'

import './Navbar.css'
import 'aos/dist/aos.css'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import star from '@assets/star.png'
import unibuzzLogo from '@assets/unibuzz_logo.svg'
import { TbMailFilled } from 'react-icons/tb'
import { FaBell } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { menuContent, notificationRoleAccess } from './constant'
import { motion } from 'framer-motion'
import useWindowSize from '@/hooks/useWindowSize'
import useCookie from '@/hooks/useCookie'
import { useUniStore } from '@/store/store'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover'
import { MdLogout } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { useGetNotification } from '@/services/notification'
import { Skeleton } from '@/components/ui/Skeleton'
import { ButtonPrimary } from '../Buttons/PrimaryButton'
import InviteNotification from '../Notification/InviteNotification'
import CommentNotification from '../Notification/CommentNotification'
import AssignNotification from '../Notification/AssignNotification'
import UserFollowNotification from '../Notification/UserFollowNotification'
import { notificationInterface } from '@/types/constants'

interface MenuItem {
  name: string
  path: string
  display: string
}

const Navbar: React.FC = () => {
  const [isMobile] = useState<boolean>(false)
  const [width] = useWindowSize()
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)
  const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined)
  const [hover, setHover] = useState<boolean>(false)
  const [activeItem, setActiveItem] = useState('')
  const [, , deleteCookie] = useCookie('uni_user_token')
  const { userProfileData, userData, resetUserData } = useUniStore()
  const router = useRouter()
  const { refetch: refetchNotification } = useGetNotification(3, false)
  const { data: notificationData } = useGetNotification(3, false)

  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notifications = notificationData?.pages.flatMap((page) => page.notifications) || []
  useEffect(() => {
    setIsLogin(!!userData?.id)
  }, [userData, userData?.id])

  useEffect(() => {
    if (isLogin) {
      refetchNotification()
    }
  }, [isLogin])

  const handleClick = (item: string) => {
    setActiveItem(item)
  }

  const handleLogout = () => {
    deleteCookie()
    resetUserData()
    setIsLogin(false)
    router.push('/login')
  }

  useEffect(() => {
    if (width.toString() > '769') {
      setOpen(false)
    }
  }, [width])

  const LoggedInMenu = () => {
    return (
      <div className="flex gap-[18px] items-center ">
        <TbMailFilled className="text-primary" size={32} />
        <Popover open={isNotificationOpen} onOpenChange={() => setIsNotificationOpen(!isNotificationOpen)}>
          <PopoverTrigger>
            <div className="relative">
              <FaBell className="text-primary" size={26} />
              {notifications?.length ? (
                <p className="absolute bg-red-500 rounded-full w-4 h-4 top-0 right-0 text-center text-white text-xs">
                  {notifications?.length > 9 ? '9+' : notifications?.length}
                </p>
              ) : (
                ''
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="relative right-8 w-72 p-5 border-none shadow-lg bg-white shadow-gray-light z-20 h-96 overflow-y-scroll">
            {notifications?.length ? (
              notifications?.map((item: any) =>
                item.type == notificationRoleAccess.GROUP_INVITE ? (
                  <InviteNotification
                    key={item?._id}
                    id={item?._id}
                    groupId={item?.communityGroupId?._id}
                    groupName={item?.communityGroupId?.title}
                    senderName={item?.sender_id?.firstName}
                    message={item?.message}
                    createdAt={item?.createdAt}
                  />
                ) : item.type == notificationRoleAccess.COMMENT ? (
                  <CommentNotification
                    key={item?._id}
                    id={item?._id}
                    communityPostId={item?.communityPostId?._id}
                    senderName={item?.sender_id?.firstName}
                    message={item?.message}
                    createdAt={item?.createdAt}
                  />
                ) : item.type == notificationRoleAccess.ASSIGN ? (
                  <AssignNotification
                    key={item?._id}
                    id={item?._id}
                    communityGroupId={item?.communityPostId?._id}
                    senderName={item?.sender_id?.firstName}
                    message={item?.message}
                    createdAt={item?.createdAt}
                  />
                ) : item.type == notificationRoleAccess.FOLLOW ? (
                  <UserFollowNotification
                    key={item?._id}
                    id={item?._id}
                    senderName={item?.sender_id?.firstName}
                    message={item?.message}
                    createdAt={item?.createdAt}
                  />
                ) : (
                  ''
                )
              )
            ) : (
              <p className="text-black text-center">No Notification</p>
            )}
          </PopoverContent>
        </Popover>
        {/* notificaton End  */}
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center gap-3">
              <img src={userProfileData ? userProfileData?.cover_dp?.imageUrl : '/icons/avatar.svg'} className="w-10 h-10 rounded-full bg-border" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="relative right-8 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light z-20">
            <div className="flex flex-col gap-5">
              <p className="font-medium text-sm">
                {userData?.firstName} {userData?.lastName}
              </p>
              <div className="flex gap-1 items-center cursor-pointer" onClick={handleLogout}>
                <MdLogout className="text-primary" size={20} />
                <p className="font-medium text-sm">Logout</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  const AuthButtons: React.FC = () => {
    switch (isLogin) {
      case true:
        return <LoggedInMenu />

      case false:
        return (
          <>
            <Link href={'/register'}>
              {' '}
              <button className="btn btn-primary text-sm font-medium text-[#6647FF] text-right ">Sign Up </button>
            </Link>

            <Link href={'/login'}>
              <ButtonPrimary className="text-sm font-medium">Login</ButtonPrimary>
            </Link>
          </>
        )
      default:
        return <Skeleton className=" w-[40%] h-10 rounded-2xl bg-primary-50" />
    }
  }

  const FilteredMenuComponent = () => {
    return (
      <>
        {filteredMenuContent.map((item, index) => {
          return (
            <div className="" key={index}>
              <li key={index} className="list-none">
                {item.path === '/upgrade' ? (
                  <div className="flex" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    <Link href={item.path} className={pathname === item.path ? 'nav-link  nav-link-ltr' : 'link special '}>
                      {item.name}
                    </Link>
                    <Image src={star} alt="" className={hover ? 'active-upgrade' : 'upgrade'} />
                  </div>
                ) : item.display === 'mobile' ? (
                  <Link href={item.path} className={pathname === item.path ? 'mobile nav-link nav-link-ltr' : 'mobile link'}>
                    {item.name}
                  </Link>
                ) : (
                  <Link href={item.path} onClick={() => handleClick(item.name)} className={activeItem === item.name ? 'active nav-link' : 'nav-link'}>
                    {item.name}
                  </Link>
                )}
              </li>
            </div>
          )
        })}
      </>
    )
  }

  const filteredMenuContent: MenuItem[] = isMobile ? menuContent : menuContent.filter((item) => item.display !== 'mobile')

  return (
    <>
      <div className="navbar justify-around w-full center-v h-16 sticky top-0 px-6 xl:px-28 bg-white">
        <div className="flex w-full center-v justify-between">
          <div className="w-1/6">
            <div className="flex max-w-[150px] min-w-[100px]">
              <Link className="flex gap-4 center-v" href="/">
                <Image src={unibuzzLogo} alt="BACPAC LOGO" className="h-full w-full cursor-pointer" />
              </Link>
            </div>
          </div>
          <div className="relative w-1/2 hidden md:flex gap-6 lg:gap-16 center-v">
            <>
              <FilteredMenuComponent />
              {/* Open modal on md,sm devices */}
              {open ? (
                <>
                  <hr className="my-3" />
                  <div className="flex justify-end">
                    <AuthButtons />
                  </div>
                </>
              ) : null}
            </>
          </div>
          <div className={open ? 'hidden' : 'w-1/4 hidden md:flex gap-6 justify-end center-v'}>
            <AuthButtons />
          </div>
          <div
            className={`hamburger ${open ? 'is-active' : ''} h-8  md:hidden`}
            id="hamburger"
            onClick={() => {
              setIsLogin(!isLogin)
              setOpen(!open)
            }}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0, transition: { ease: 'easeIn' } }}
          className="nav-res gap-4 flex justify-around w-full p-6 md:p-0 md:center-v md:hidden"
        >
          <FilteredMenuComponent />
          <>
            <hr className="my-3" />
            <div className="flex justify-end">
              <AuthButtons />
            </div>
          </>
        </motion.div>
      )}
    </>
  )
}

export default Navbar
