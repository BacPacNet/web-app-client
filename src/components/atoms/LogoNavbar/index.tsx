import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import unibuzzLogo from '@assets/unibuzz_logo.svg'
import sparkles from '@assets/sparkles.svg'
import { MENU_LIST } from './constant'

interface Props {
  showOnlyLogo?: boolean
}

export default function LogoNavbar({ showOnlyLogo = false }: Props) {
  return (
    <div className="w-full h-[68px] px-28 mx-auto py-3 flex items-center justify-between">
      <div>
        <Link className="flex gap-4 center-v" href="/">
          <Image src={unibuzzLogo} alt="BACPAC LOGO" width={84} height={21} className="h-full cursor-pointer" />
        </Link>
      </div>
      {!showOnlyLogo && (
        <div className="flex items-center justify-between">
          <div className="flex gap-16">
            {MENU_LIST.map((menu, index) => {
              if (menu.name === 'UPGRADE') {
                return (
                  <div key={index} className="flex">
                    <Link className="text-primary-500 text-xs" href={menu.path}>
                      {menu.name}
                    </Link>
                    <Image className="ml-1" src={sparkles} alt="upgrade_icon" width={20} height={20} />
                  </div>
                )
              }
              return (
                <Link key={index} className="text-neutral-800 text-xs" href={menu.path}>
                  {menu.name}
                </Link>
              )
            })}
          </div>
          {/*<LoginButton>Login</LoginButton>*/}
        </div>
      )}
    </div>
  )
}
