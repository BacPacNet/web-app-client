'use client'

import './Navbar.css'
import 'aos/dist/aos.css'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { menuContent } from './constant'
import { motion } from 'framer-motion'
import star from '@assets/star.png'
import unibuzzLogo from '@assets/logo.svg'
import { usePathname } from 'next/navigation'
import useWindowSize from '@/hooks/useWindowSize'

//import { FaRegBell } from 'react-icons/fa'

//import { IoMdMail } from 'react-icons/io'

//import demopic from '@assets/demopic.jpg'

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
  // isLogin is just for demo purpose.
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [hover, setHover] = useState<boolean>(false)
  const [activeItem, setActiveItem] = useState('')

  const handleClick = (item: string) => {
    setActiveItem(item)
  }

  useEffect(() => {
    if (width.toString() > '769') {
      console.log('object')
      setOpen(false)
    }
  }, [width])

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
            <div className="flex">
              <Link className="flex gap-4 center-v" href="/">
                <Image src={unibuzzLogo} alt="BACPAC LOGO" className="h-full w-full cursor-pointer" />
                <span>Unibuzz</span>
              </Link>
            </div>
          </div>
          <div className="relative w-1/2 hidden md:flex gap-6 lg:gap-16 center-v">
            <>
              <FilteredMenuComponent />
              {open ? (
                <>
                  <hr className="my-3" />
                  <div className="flex justify-end">
                    <button className="btn btn-primary text-sm font-medium text-[#6647FF] text-right ">Sign Up</button>
                    <button className="btn btn-secondary ml-6 text-right text-sm font-medium">Login</button>
                  </div>
                </>
              ) : null}
            </>
          </div>
          <div className={open ? 'hidden' : 'w-1/4 hidden md:flex justify-end center-v'}>
            <button className="btn btn-primary text-sm font-medium text-[#6647FF] text-right ">Sign Up</button>
            <button className="btn btn-secondary ml-6 text-right text-sm font-medium ">Login</button>
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
              <button className="btn btn-primary text-sm font-medium text-[#6647FF] text-right ">Sign Up</button>
              <button className="btn btn-secondary ml-6 text-right text-sm font-medium">Login</button>
            </div>
          </>
        </motion.div>
      )}
    </>
  )
}

export default Navbar
