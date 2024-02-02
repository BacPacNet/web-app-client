import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import bacpacLogo from '../../../assets/bacpacLogo.png'
import { usePathname } from 'next/navigation'
function Navbar() {
  const pathname = usePathname()
  const menuContent = [
    {
      name: 'Discover',
      path: '/discover',
    },
    {
      name: 'About us',
      path: '/aboutus',
    },
    {
      name: 'Site manual',
      path: '/sitemanual',
    },
    {
      name: 'Community',
      path: '/community',
    },
  ]
  return (
    <div className="navbar justify-around w-full h-20 center-v bg-white sticky top-0 left-0 z-50">
      <div className="left h-full center-v w-3/4 ">
        <div className="logo ml-24 mr-7 h-full mt-1/2">
          <Link href="/">
            <Image src={bacpacLogo} alt="BACPAC LOGO" className="h-full w-full cursor-pointer mb-4" />
          </Link>
        </div>
        <div className="nav center-v h-full w-3/6 justify-around relative">
          {menuContent.map((item, index) => {
            return (
              <li key={index} className="list-none">
                <Link href={item.path} className={pathname === item.path ? 'nav-link nav-link-ltr' : ''}>
                  {item.name}
                </Link>
              </li>
            )
          })}
        </div>
      </div>
      <div className=" w-1/4 center-v justify-start h-full">
        <button className="btn btn-primary w-1/3 h-10">Sign Up</button>
        <button className="btn btn-secondary ml-6 w-1/3 h-10">Login</button>
      </div>
    </div>
  )
}

export default Navbar
