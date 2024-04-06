'use client'

import './Navbar.css'
import 'aos/dist/aos.css'

import React, { useEffect, useState } from 'react'

import AOS from 'aos'
import { FaRegBell } from 'react-icons/fa'
import Image from 'next/image'
import { IoMdMail } from 'react-icons/io'
import Link from 'next/link'
import buttonIcon from '../../../assets/buttonIcon.png'
import close from '../../../assets/close.png'
import demopic from '../../../assets/demopic.jpg'
import star from '../../../assets/star.png'
import unibuzzLogo from '../../../assets/unibuzzLogo.png'
import { usePathname } from 'next/navigation'

interface MenuItem {
  name: string
  path: string
  display: string
}
const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)
  // isLogin is just for demo purpose.
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [hover, setHover] = useState<boolean>(false)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 375)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    AOS.init({ duration: 300 })
  }, [open])

  const menuContent: MenuItem[] = [
    {
      name: 'Discover',
      path: '/discover',
      display: 'lap',
    },
    {
      name: 'Community',
      path: '/community',
      display: 'lap',
    },
    {
      name: 'Timeline',
      path: '/',
      display: 'mobile',
    },
    {
      name: 'Profile',
      path: '/',
      display: 'mobile',
    },
    {
      name: 'Notifications',
      path: '/',
      display: 'mobile',
    },
    {
      name: 'Messages',
      path: '/',
      display: 'mobile',
    },
    {
      name: 'Connections',
      path: '/',
      display: 'mobile',
    },
    {
      name: 'University Community',
      path: '/',
      display: 'mobile',
    },
    {
      name: 'Chatbot',
      path: '/',
      display: 'mobile',
    },
    {
      name: 'About us',
      path: '/aboutus',
      display: 'lap',
    },
    {
      name: 'UPGRADE',
      path: '/upgrade',
      display: 'lap',
    },
  ]
  const filteredMenuContent: MenuItem[] = isMobile ? menuContent : menuContent.filter((item) => item.display !== 'mobile')
  return (
    <div className="navbar justify-around w-full center-v h-16 bg-white sticky top-0 left-0">
      <div className="left-nav h-8 center-v">
        <div className="logo center-v mr-16 h-full">
          <Link href="/">
            <Image src={unibuzzLogo} alt="BACPAC LOGO" className="h-full w-full cursor-pointer" />
          </Link>
        </div>
        <div
          className={open ? 'nav-res gap-7 h-full flex items-center justify-around w-full relative' : 'nav center-v gap-16 h-full w-full relative'}
          data-aos={open ? 'fade-down' : ''}
          data-aos-duration="300"
          data-aos-easing="ease-in"
        >
          {isLogin && isMobile && (
            <div className="profile">
              <div className="profile-info">
                <Image src={demopic} alt="demo" height={40} width={40} className="mr-2" />
                <div className="name">Kate perry</div>
              </div>
              <div className="notifications">
                <IoMdMail className="notifi-icons" />
                <FaRegBell className="notifi-icons" />
              </div>
            </div>
          )}
          <div className="nav-details flex">
            {filteredMenuContent.map((item, index) => {
              return (
                <div className="nav-item" key={index}>
                  <li key={index} className="list-none">
                    {item.path === '/upgrade' ? (
                      <div className="flex" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                        {item.display === 'mobile' ? (
                          <Link href={item.path} className={pathname === item.path ? 'mobile nav-link active' : 'mobile nav-link special w-16'}>
                            {item.name}
                          </Link>
                        ) : (
                          <Link href={item.path} className={pathname === item.path ? 'nav-link active' : 'nav-link special w-16'}>
                            {item.name}
                          </Link>
                        )}
                        {open ? (
                          <Image src={star} alt="" className="active-upgrade" />
                        ) : (
                          <Image src={star} alt="" className={hover ? 'active-upgrade' : 'upgrade'} />
                        )}
                      </div>
                    ) : item.display === 'mobile' ? (
                      <Link href={item.path} className={pathname === item.path ? 'mobile nav-link' : 'mobile nav-link'}>
                        {item.name}
                      </Link>
                    ) : (
                      <Link href={item.path} className={pathname === item.path ? ' nav-link active' : 'nav-link'}>
                        {item.name}
                      </Link>
                    )}
                  </li>
                </div>
              )
            })}
          </div>
          {!isMobile && (
            <div className={open ? 'btn-res' : 'right-nav w-48 center-v justify-start h-9 '}>
              <div>
                <button className="btn btn-primary text-sm font-medium text-[#6647FF] text-right h-full">Sign Up</button>
              </div>
              <div>
                <button className="btn btn-secondary ml-6 text-right text-sm font-medium h-full">Login</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hamberger-menu" onClick={() => setIsLogin(!isLogin)}>
        {open ? (
          <Image src={close} alt="close" className="w-full h-full" onClick={() => setOpen(false)} />
        ) : (
          <Image src={buttonIcon} alt="hamburger-menu" className="w-full h-full" onClick={() => setOpen(true)} />
        )}
      </div>
    </div>
  )
}

export default Navbar
