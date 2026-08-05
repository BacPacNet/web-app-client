'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import unibuzzLogo from '@assets/unibuzz_logo.svg'
import Button from '../Buttons'
import { usePathname, useRouter } from 'next/navigation'

export default function LogoNavbar() {
  const pathname = usePathname() ?? ''
  const router = useRouter()

  if (pathname.includes('/thank-you')) {
    return null
  }

  const navbarContainerClass = 'max-width-allowed px-4'

  return (
    <>
      <div className="w-full h-[50px] sm:h-[68px] ">
        <div className="fixed w-full top-0 left-0 z-50 h-[inherit] bg-white border-b-[1px] border-neutral-200 ">
          <div
            className={`${navbarContainerClass}
             relative h-[50px] sm:h-[68px]  mx-auto py-3 flex items-center justify-between bg-white top-0 border-b-[1px] border-neutral-200`}
          >
            <div className="flex gap-6 items-center lg:justify-start justify-between w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Link className="flex gap-4 center-v" href="/">
                  <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full cursor-pointer sm:w-[84px] w-[70px]" />
                </Link>
              </div>
            </div>
            <div className="flex pl-8 gap-4">
              <Button onClick={() => router.push('/book-demo')} variant="primary" className="text-xs">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
