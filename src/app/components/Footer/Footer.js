import './Footer.css'

import {
  AiFillFacebook,
  AiFillInstagram,
  AiOutlineCopyrightCircle,
  AiOutlineTwitter,
} from 'react-icons/ai'

import { BsDiscord } from 'react-icons/bs'
import Image from 'next/image'
import React from 'react'
import bacpacLogo from '../../../assets/bacpacLogo.png'
import bacpacTitle from '../../../assets/bacpacTitle.png'

function Footer() {
  const handleRedirect = (platform) => {
    let url

    switch (platform) {
      case 1:
        // Discord
        url = '#'
        break
      case 2:
        // Facebook
        url = '#'
        break
      case 3:
        // Twitter
        url = '#'
        break
      case 4:
        // Instagram
        url = '#'
        break
      default:
        // Default action if platform parameter is not recognized
        return
    }

    window.open(url, '_blank') // Open the URL in a new tab
  }
  return (
    <div className="footer center-v w-full  bg-[#ECECEC] relative bottom-0 left-0">
      <div className="images center-v ml-24  w-1/4 h-full cursor-pointer ">
        <div className="logo w-12 pb-1 mr-4 h-13">
          <Image src={bacpacLogo} alt="" className="w-full h-full" />
        </div>
        <div className="title w-1/2">
          <Image src={bacpacTitle} alt="" className=" w-4/6" />
        </div>
      </div>
      <div className="text w-3/4  h-full center text-large">
        Copyright <AiOutlineCopyrightCircle className="ml-1 mr-1" /> 2023 Bacpac
        Networks
      </div>
      <div className="center h-full w-2/6">
        <div
          className="icons instagram center"
          onClick={() => handleRedirect(4)}
        >
          <AiFillInstagram className="icon" />
        </div>
        <div
          className="icons facebook center"
          onClick={() => handleRedirect(2)}
        >
          <AiFillFacebook className="icon" />
        </div>
        <div className="icons twitter center" onClick={() => handleRedirect(3)}>
          <AiOutlineTwitter className="icon" />
        </div>
        <div className="icons discord center" onClick={() => handleRedirect(1)}>
          <BsDiscord className="icon" />
        </div>
      </div>
    </div>
  )
}

export default Footer
