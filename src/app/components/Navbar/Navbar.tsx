'use client'

import './Navbar.css'
import 'aos/dist/aos.css'

import React, { useEffect, useState } from 'react'

import AOS from 'aos'
//import { FaRegBell } from 'react-icons/fa'
import Image from 'next/image'
//import { IoMdMail } from 'react-icons/io'
import Link from 'next/link'
import buttonIcon from '../../../assets/buttonIcon.png'
import close from '../../../assets/close.png'
//import demopic from '../../../assets/demopic.jpg'
import star from '../../../assets/star.png'
import unibuzzLogo from '../../../assets/logo.svg'
import { usePathname } from 'next/navigation'
import { menuContent } from './constant'

interface MenuItem {
  name: string
  path: string
  display: string
}
const Navbar: React.FC = () => {
  const [isMobile] = useState<boolean>(false)
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
    AOS.init({ duration: 300 })
  }, [open])

  const filteredMenuContent: MenuItem[] = isMobile ? menuContent : menuContent.filter((item) => item.display !== 'mobile')
  return (
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
        <div
          className={
            open ? 'nav-res gap-4 flex justify-around w-full p-6 md:p-0 md:center-v' : 'relative w-1/2 hidden md:flex gap-6 lg:gap-16 center-v'
          }
          data-aos={open && 'fade-down'}
          data-aos-duration="100"
          data-aos-easing="ease-in"
        >
          {' '}
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
                    <Link
                      href={item.path}
                      onClick={() => handleClick(item.name)}
                      className={activeItem === item.name ? 'active nav-link' : 'nav-link'}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              </div>
            )
          })}
          {open ? (
            <>
              <hr className="my-3" />
              <div className="flex justify-end">
                <button className="btn btn-primary text-sm font-medium text-[#6647FF] text-right ">Sign Up</button>
                <button className="btn btn-secondary ml-6 text-right text-sm font-medium">Login</button>
              </div>
            </>
          ) : null}
        </div>
        <div
          className={open ? 'hidden' : 'w-1/4 hidden md:flex justify-end center-v'}
          data-aos={open && 'fade-down'}
          data-aos-duration="100"
          data-aos-easing="ease-in"
        >
          <button className="btn btn-primary text-sm font-medium text-[#6647FF] text-right ">Sign Up</button>
          <button className="btn btn-secondary ml-6 text-right text-sm font-medium ">Login</button>
        </div>

        <div className="h-8 w-8 flex md:hidden" onClick={() => setIsLogin(!isLogin)}>
          {open ? (
            <Image src={close} alt="close" className="w-full h-full" onClick={() => setOpen(false)} />
          ) : (
            <Image src={buttonIcon} alt="hamburger-menu" className="w-full h-full" onClick={() => setOpen(true)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
