import React from 'react'
import { FaUser, FaLock } from 'react-icons/fa'
import { BsShieldFillExclamation } from 'react-icons/bs'
import { HiPaintBrush } from 'react-icons/hi2'
type Props = {
  setCurrTab: (value: string) => void
  currTab: string
}
const tabsWithIcons = [
  { name: 'Accounts', icon: FaUser },
  { name: 'Privacy', icon: FaLock },
  { name: 'Security', icon: BsShieldFillExclamation },
  { name: 'Preferences', icon: HiPaintBrush },
]
const SettingsTopBar = ({ currTab, setCurrTab }: Props) => {
  return (
    <div className=" px-12 max-sm:px-2 max-md:px-4  py-4 font-medium text-[20px] flex flex-col gap-9 relative   font-poppins max-sm:gap-4 max-md:text-xs">
      <div className=" flex justify-between items-center text-sm max-md:text-xs max-sm:text-2xs me-36 max-md:me-10 max-xl:me-16 max-sm:me-0">
        {tabsWithIcons.map((tab, idx) => (
          <p
            key={idx}
            onClick={() => setCurrTab(tab.name)}
            className={`${currTab === tab.name ? 'text-primary-500' : 'text-neutral-500'} cursor-pointer flex items-center gap-2 max-sm:gap-1`}
          >
            {tab.name}
            <tab.icon />
          </p>
        ))}
      </div>
    </div>
  )
}

export default SettingsTopBar
