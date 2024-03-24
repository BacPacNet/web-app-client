import './Footer.css'

import { FaDiscord } from 'react-icons/fa'
import Image from 'next/image'
import React from 'react'
import facebook from '../../../assets/Facebook.png'
import insta from '../../../assets/instagram.png'
import linkedin from '../../../assets/linkedin.png'
import x from '../../../assets/X.png'

const Footer: React.FC = () => {
  const handleRedirect = (platform: number) => {
    let url
    const SocialNetwork = {
      DISCORD: 1,
      FACEBOOK: 2,
      TWITTER: 3,
      INSTAGRAM: 4,
    }
    switch (platform) {
      case SocialNetwork.DISCORD:
        url = '#'
        break
      case SocialNetwork.FACEBOOK:
        url = '#'
        break
      case SocialNetwork.TWITTER:
        url = '#'
        break
      case SocialNetwork.INSTAGRAM:
        url = '#'
        break
      default:
        return
    }
    window.open(url, '_blank')
  }
  return (
    <div className="footer center-v bg-[#ffffff] relative bottom-0 left-0 right-0 flex flex-col">
      <div className="top w-full flex relative top-11 h-full justify-around">
        <div className="left-part">
          <p className="p1 text-[#6647FF] font-semibold text-xs h-5">STILL HAVE QUESTIONS?</p>
          <h1 className="h1 text-[#171717] font-extrabold text-4xl h-11">Get to know us better</h1>
          <p className="p2 text-lg font-normal h-7 text-[#525252]">Familiarize yourself with Unibuzz&apos;s mission and purpose</p>
        </div>
        <div className="right-part">
          <div className="discord mr-6">
            <button className="btn btn-disc text-[#6647FF] text-base text-center w-40 h-12 font-medium p-2 flex justify-evenly items-center">
              <FaDiscord className="discord-icon" />
              Our Discord
            </button>
          </div>
          <div className="aboutus">
            <button className="btn-sec border border-[#E5E5E5] rounded-md bg-transparent text-[#404040] w-40 h-12 text-base font-medium">
              About us
            </button>
          </div>
        </div>
      </div>
      <hr className="horizontal-line top-56 " />
      <div className="bottom w-full ">
        <div className="copyright">Copyright © 2024, Unibuzz Networks</div>
        <div className="flex bottom-part-2">
          <div className="policy flex w-80">
            <p>Privacy Policy</p>
            <p>Terms and Conditions</p>
            <p>Contact Us</p>
          </div>
          <div className="logos ">
            <div className="icons instagram center" onClick={() => handleRedirect(4)}>
              <Image src={facebook} className="icon" alt="facebook" />
            </div>
            <div className="icons facebook center" onClick={() => handleRedirect(2)}>
              <Image src={x} className="icon" alt="x" />
            </div>
            <div className="icons twitter center" onClick={() => handleRedirect(3)}>
              <Image src={linkedin} className="icon" alt="linkedin" />
            </div>
            <div className="icons discord center" onClick={() => handleRedirect(1)}>
              <Image src={insta} className="icon" alt="instagram" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
