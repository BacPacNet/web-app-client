'use client'
import Card from '@/components/atoms/Card'
import Image from 'next/image'
import React, { useState } from 'react'
import avatar from '@assets/avatar.svg'
import Text from '@/components/atoms/Text'
import SubText from '@/components/atoms/SubText'
import { HiHome } from 'react-icons/hi'
import { IoMdPeople } from 'react-icons/io'
import { BiSolidMessageDots } from 'react-icons/bi'
import { FaBell } from 'react-icons/fa6'
import { PiFilesFill, PiFinnTheHumanFill } from 'react-icons/pi'
import GroupSearchBox from '@/components/atoms/GroupSearchBox'
import NavbarUniversityItem from '@/components/molecules/NavbarUniversityItem'
import { FiFilter } from 'react-icons/fi'
import Tabs from '@/components/molecules/Tabs'

export default function LeftNavbar() {
  const menuItems = [
    { name: 'Home', icon: <HiHome /> },
    { name: 'Connections', icon: <IoMdPeople /> },
    { name: 'Message', icon: <BiSolidMessageDots /> },
    { name: 'Notification', icon: <FaBell /> },
    { name: 'AI Assistant', icon: <PiFinnTheHumanFill /> },
  ]

  const [activeMenu, setActiveMenu] = useState(menuItems[0].name)

  const handleMenuClick = (name: React.SetStateAction<string>) => {
    console.log('name', name)

    setActiveMenu(name)
  }

  const tabData = [
    {
      label: 'All',
      content: <div>This is the content of Tab 1.</div>,
    },
    {
      label: 'Joined',
      content: <div>This is the content of Tab 2.</div>,
    },
    {
      label: 'Your Group',
      content: <div>This is the content of Tab 3.</div>,
    },
  ]
  return (
    <div>
      <Card className="rounded-2xl">
        <div className="px-4 flex gap-4">
          <div>
            <Image width={60} height={60} src={avatar} alt="avatar.png" />
          </div>
          <div>
            <p className="text-sm text-neutral-700">Anonymous</p>
            <SubText>University Details</SubText>
            <SubText>Degree Details</SubText>
          </div>
        </div>
        <div className="px-4 pt-9">
          <p className="text-2xs text-neutral-500 font-bold">EXPLORE</p>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex gap-2 cursor-pointer text-sm pt-[10px] ${
                activeMenu === item.name ? 'text-[#3A169C] font-semibold' : 'text-neutral-500'
              }`}
              onClick={() => handleMenuClick(item.name)}
            >
              <span className="text-[20px]">{item.icon}</span>
              <span className="">{item.name}</span>
            </div>
          ))}
        </div>
        <p className=" px-4 pb-4 pt-9 text-neutral-500 text-2xs font-bold">UNIVERSITIES</p>
        <NavbarUniversityItem />

        {/*<div className="bg-[#F3F2FF] flex items-center gap-3 py-2 px-4">
        <div className="flex items-center justify-center bg-white rounded-full w-[40px] h-[40px]">
          <PiFilesFill className="text-[#3A169C] text-[20px]" />
        </div>
        <p className="text-sm font-bold">Lorem University</p>
      </div>*/}
        <p className="px-4 pb-4 pt-9 text-neutral-500 text-2xs font-bold">UNIVERSITY GROUPS</p>
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex items-center justify-center bg-white rounded-full gap-3 ">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="flex items-center justify-center bg-white rounded-full w-[40px] h-[40px]"
            >
              <PiFilesFill className="text-[#3A169C] text-[20px]" />
            </div>
            <GroupSearchBox placeholder="Search Groups" type="text" />
          </div>
        </div>
        <div className="flex gap-2 justify-evenly cursor-pointer mt-4">
          <div
            style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04)' }}
            className="border-2 border-solid border-neutral-200 rounded-lg "
          >
            <div className="flex gap-6 justify-center items-center h-8 px-4 ">
              <p className="text-xs text-neutral-700">Filter</p>
              <FiFilter width={16} height={16} className="text-primary-500 font-bold" />
            </div>
          </div>
          <div
            style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04)' }}
            className="border-2 border-solid border-neutral-200 rounded-lg "
          >
            <div className="flex gap-6 justify-center items-center h-8 px-4">
              <p className="text-xs text-neutral-700">Filter</p>
              <FiFilter width={16} height={16} className="text-primary-500 font-bold" />
            </div>
          </div>
        </div>
        <Tabs tabs={tabData} />
      </Card>
    </div>
  )
}
