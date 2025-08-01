'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { FaAngleDown, FaRegUser } from 'react-icons/fa'
import { MdOutlineSettings } from 'react-icons/md'
import { PiChatTextBold } from 'react-icons/pi'
import { TbLogout } from 'react-icons/tb'
import { IoBugOutline } from 'react-icons/io5'
import avatar from '@assets/avatar.svg'

interface ProfileMenuProps {
  userProfileData: any
  userData: any
  onLogout: () => void
  onNavigate: (path: string) => void
}

const ProfileMenu = ({ userProfileData, userData, onLogout, onNavigate }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: FaRegUser, label: 'Profile', action: () => onNavigate(`/profile/${userData?.id}`) },
    { icon: MdOutlineSettings, label: 'Settings', action: () => onNavigate('/setting') },
    { icon: IoBugOutline, label: 'Report bug', action: () => onNavigate('/report-bug') },
    { icon: PiChatTextBold, label: 'Feedback', action: () => onNavigate('/contact') },
    { icon: TbLogout, label: 'Logout', action: onLogout },
  ]

  const handleItemClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="flex gap-4 items-center pl-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger onClick={() => setIsOpen(false)}>
          <motion.div
            className="flex gap-2 items-center"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2, ease: 'easeInOut' },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
          >
            <Image
              width={40}
              height={40}
              objectFit="cover"
              className="w-[40px] object-cover h-[40px] rounded-full"
              src={userProfileData?.profile_dp?.imageUrl || avatar}
              alt="profile.png"
            />
            <FaAngleDown className="text-neutral-600" size={16} />
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="p-0 relative right-4 top-6 w-[168px] bg-white shadow-card border-none">
          <div>
            <ul className="border-b-[1px] border-neutral-200">
              {menuItems.slice(0, 2).map((item, index) => (
                <motion.li
                  key={index}
                  onClick={() => handleItemClick(item.action)}
                  className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2, ease: 'easeInOut' },
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 },
                  }}
                >
                  <item.icon />
                  <p>{item.label}</p>
                </motion.li>
              ))}
            </ul>
            <ul className="border-b-[1px] border-neutral-200">
              {menuItems.slice(2, 4).map((item, index) => (
                <motion.li
                  key={index + 2}
                  onClick={() => handleItemClick(item.action)}
                  className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2, ease: 'easeInOut' },
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 },
                  }}
                >
                  <item.icon />
                  <p>{item.label}</p>
                </motion.li>
              ))}
            </ul>
            <ul>
              <motion.li
                onClick={() => handleItemClick(onLogout)}
                className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2, ease: 'easeInOut' },
                }}
                whileTap={{
                  scale: 0.98,
                  transition: { duration: 0.1 },
                }}
              >
                <TbLogout />
                <p>Logout</p>
              </motion.li>
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ProfileMenu
