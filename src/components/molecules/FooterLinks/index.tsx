'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import linkedin from '@assets/linkedin.svg'
import insta from '@assets/insta.svg'

interface Props {
  isOnLeft?: boolean
}

const FooterLinks: React.FC<Props> = ({ isOnLeft = false }) => {
  const handleRedirect = (platform: number) => {
    const SocialNetwork = {
      FACEBOOK: 1,
      TWITTER: 2,
      LINKEDIN: 3,
      INSTAGRAM: 4,
    }

    let url = ''
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
    <div className={`${isOnLeft ? 'my-4' : 'lg:flex-row'} flex  flex-col items-center justify-center gap-4 text-neutral-500 text-xs font-normal`}>
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/terms-and-condition">Terms and Conditions</Link>
      <Link href="/user-guidelines"> Usability Guidelines</Link>
      <Link href="/contact">Contact Us</Link>
      <div className="flex">
        <div className="icons twitter center" onClick={() => handleRedirect(3)}>
          <Image src={linkedin} className="icon" alt="linkedin" />
        </div>
        <div className="icons discord center grayscale" onClick={() => handleRedirect(4)}>
          <Image src={insta} className="icon" alt="instagram" />
        </div>
      </div>
    </div>
  )
}

export default FooterLinks
