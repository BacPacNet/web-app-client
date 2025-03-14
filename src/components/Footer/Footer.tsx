'use client'
import './Footer.css'

import Image from 'next/image'
import React from 'react'
//import facebook from '@assets/facebook.svg'
//import insta from '@assets/instagram.svg'
//import linkedin from '@assets/linkedin.svg'
//import x from '@assets/X.svg'
import unibuzzLogo from '@assets/unibuzz_logo.svg'

const Footer: React.FC = () => {
  const handleRedirect = (platform: number) => {
    let url
    const SocialNetwork = {
      FACEBOOK: 1,
      TWITTER: 2,
      LINKEDIN: 3,
      INSTAGRAM: 4,
    }
    switch (platform) {
      case SocialNetwork.FACEBOOK:
        url = 'https://www.facebook.com/profile.php?id=61555598325563'
        break
      case SocialNetwork.TWITTER:
        url = '#'
        break
      case SocialNetwork.LINKEDIN:
        url = 'https://www.linkedin.com/company/unibuzznetworks/'
        break
      case SocialNetwork.INSTAGRAM:
        url = 'https://www.instagram.com/uni.buzz'
        break
      default:
        return
    }
    window.open(url, '_blank')
  }
  return (
    <div className="w-full mx-auto relative flex flex-col center-v py-2 lg:py-8 mt-20 bg-surface-primary-50">
      <div className="w-custom-width text-gray-dark text-sm lg:text-lg">
        <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-center md:justify-between my-4 gap-4 text-sm">
          <div className="flex gap-4 items-start">
            <p className="text-neutral-500 text-xs font-normal">Copyright © 2024, Unibuzz Networks</p>
          </div>
          <div className="flex lg:flex-row flex-col items-center justify-center gap-4 text-neutral-500 text-xs font-normal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms and Conditions</a>
            <a href="#">Contact Us</a>
            {/*<a href="#">Business Service</a>*/}
            {/*<div className="icons instagram center" onClick={() => handleRedirect(1)}>
              <Image src={facebook} className="icon" alt="facebook" />
            </div>
            <div className="icons facebook center" onClick={() => handleRedirect(2)}>
              <Image src={x} className="icon" alt="x" />
            </div>
            <div className="icons twitter center" onClick={() => handleRedirect(3)}>
              <Image src={linkedin} className="icon" alt="linkedin" />
            </div>
            <div className="icons discord center" onClick={() => handleRedirect(4)}>
              <Image src={insta} className="icon" alt="instagram" />
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
