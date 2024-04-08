import './Footer.css'

import Image from 'next/image'
import React from 'react'
import facebook from '../../../assets/Facebook.png'
import insta from '../../../assets/instagram.png'
import linkedin from '../../../assets/linkedin.png'
import x from '../../../assets/X.png'
import DiscordIcon from '../../../assets/discord.svg'

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
    <div className=" w-[90%] mx-auto relative flex flex-col center-v py-8 lg:py-16">
      <div className="w-full flex flex-col lg:flex-row relative items-center justify-between border-b-2 border-b-gray-light pb-8">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <p className=" text-[#6647FF] font-semibold text-xs lg:text-sm my-4">STILL HAVE QUESTIONS?</p>
          <h1 className="text-[#171717] font-extrabold text-3xl lg:text-4xl w-full">Get to know us better</h1>
          <p className="text-sm lg:text-md my-4 text-[#525252]">Familiarize yourself with Unibuzz&apos;s mission and purpose</p>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end gap-8 my-8">
          <div className="discord">
            <button className="btn btn-disc text-[#6647FF] text-base text-center font-medium py-3 px-4 flex justify-evenly items-center">
              <Image src={DiscordIcon} className="icon mr-2" alt="DiscordIcon" />
              Our Discord
            </button>
          </div>
          <div className="aboutus">
            <button className="btn-sec border border-[#E5E5E5] rounded-md bg-transparent text-[#404040] text-base font-medium">About us</button>
          </div>
        </div>
      </div>

      <div className="bottom w-full my-4">
        <div className="copyright">Copyright © 2024, Unibuzz Networks</div>
        <div className="flex bottom-part-2">
          <div className="policy flex">
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
