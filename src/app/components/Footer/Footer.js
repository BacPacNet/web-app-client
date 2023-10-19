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
    <div className="footer flex w-full h-20 items-center bg-[#ECECEC] sticky bottom-0 left-0">
      <div className="images flex ml-24 items-center w-1/4 h-full cursor-pointer">
        <div className="logo">
          <Image src={bacpacLogo} alt="" className="w-16 h-full" />
        </div>
        <div className="title">
          <Image src={bacpacTitle} alt="" className="w-16 h-6 ml-4" />
        </div>
      </div>
      <div className="text w-3/4  h-full flex items-center justify-center text-large">
        Copyright <AiOutlineCopyrightCircle className="ml-1 mr-1" /> 2023 Bacpac
        Networks
      </div>
      <div className="social-media flex items-center justify-center h-full w-2/6 cursor-pointer">
        <div
          className="icons instagram w-8 h-10 flex items-center justify-center"
          onClick={() => handleRedirect(4)}
        >
          <AiFillInstagram className="icon w-8 h-6" />
        </div>
        <div
          className="icons facebook w-8 h-10 flex items-center justify-center"
          onClick={() => handleRedirect(2)}
        >
          <AiFillFacebook className="icon  w-8 h-6" />
        </div>
        <div
          className="icons twitter w-8 h-10 flex items-center justify-center"
          onClick={() => handleRedirect(3)}
        >
          <AiOutlineTwitter className="icon  w-8 h-6" />
        </div>
        <div
          className="icons discord w-8 h-10 flex items-center justify-center"
          onClick={() => handleRedirect(1)}
        >
          <BsDiscord className="icon  w-8 h-6" />
        </div>
      </div>
    </div>
  )
}

export default Footer
