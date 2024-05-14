import './Footer.css'

import Image from 'next/image'
import React from 'react'
import facebook from '@assets/Facebook.png'
import insta from '@assets/instagram.png'
import linkedin from '@assets/linkedin.png'
import x from '@assets/X.png'

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
    <div className=" w-[90%] mx-auto relative flex flex-col center-v py-8 lg:pt-8">
      <div className="w-full text-gray-dark text-sm lg:text-lg">
        <div className="flex justify-between md:justify-start gap-2 md:gap-16 ">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms and Conditions</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between my-4 gap-4">
          <div>
            <p>Copyright © 2024, Unibuzz Networks</p>
          </div>
          <div className="flex gap-4">
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
