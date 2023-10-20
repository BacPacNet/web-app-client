'use client'

import './Navbar.css'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import bacpacLogo from '../../../assets/bacpacLogo.png'
import { usePathname } from 'next/navigation'

function Navbar() {
  const pathname = usePathname()
  const menuContent = [
    {
      name: 'About us',
      path: '/aboutus',
    },
    {
      name: 'Community',
      path: '/community',
    },
    {
      name: 'Discover',
      path: '/discover',
    },
    {
      name: 'Site manual',
      path: '/sitemanual',
    },
  ]
  //   border-2 border-gray-800
  // console.log('url', window.location)
  return (
    <div className="navbar flex justify-around w-full h-20 items-center bg-[#ECECEC] sticky top-0 left-0 z-50">
      <div className="left h-full flex  w-3/4 items-center">
        <div className="logo ml-24 mr-7 h-full mt-1/2">
          <Link href="/">
            <Image
              src={bacpacLogo}
              alt="BACPAC LOGO"
              className="h-full w-full cursor-pointer mb-4"
            />
          </Link>
        </div>
        <div className="nav flex h-full w-3/6 items-center justify-around relative">
          {menuContent.map((item, index) => {
            return (
              <li key={index} className="list-none">
                <Link
                  href={item.path}
                  className={
                    pathname === item.path ? 'nav-link nav-link-ltr' : ''
                  }
                >
                  {item.name}
                </Link>
              </li>
            )
          })}
        </div>
      </div>
      <div className="right flex w-1/4 items-center justify-start h-full">
        <button className="btn-primary p-3 bg-[#BC9CFF] btn w-1/3 h-10 flex items-center justify-center rounded-lg text-[#ffffff]">
          Sign Up
        </button>
        <button className="btn-secondary p-3 bg-[#6744FF] w-1/3 h-10 rounded-lg btn flex text-[#ffffff] items-center justify-center ml-6">
          Login
        </button>
      </div>
    </div>
  )
}

export default Navbar
