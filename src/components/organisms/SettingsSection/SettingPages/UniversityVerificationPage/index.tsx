'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import blueTick from '@/assets/blueBGTick.svg'
import Buttons from '@/components/atoms/Buttons'
import { openModal } from '@/components/molecules/Modal/ModalManager'
import UniversityVerificationModal from '../../SettingModals/UniversityVerificationModal'
import { useUniStore } from '@/store/store'
import { EmailType } from '@/models/auth'
import InputBox from '@/components/atoms/Input/InputBox'
import uniLogo from '@/assets/unibuzz-orange.png'
import { IoIosAddCircle } from 'react-icons/io'
import badge from '@assets/badge.svg'
const UniversityVerificationPage = () => {
  const router = useRouter()

  const userProfileData = useUniStore((state) => state.userProfileData) || { email: [] }

  const email: EmailType[] = userProfileData.email || []

  return (
    <div className="p-4  rounded-2xl">
      <div onClick={() => router.back()} className="flex items-center gap-2 pb-4 pt-0  border-b border-neutral-300 cursor-pointer">
        <FaChevronLeft className="text-neutral-500" />
        <span className="text-neutral-500 font-medium text-sm">Account</span>
      </div>
      <div className="py-4 border-b border-neutral-300">
        <div className="flex flex-col gap-2">
          <h6 className="font-poppins font-bold text-neutral-700 text-[20px]">University Verification</h6>
          <p className="text-neutral-500 text-sm">Verify your university email to unlock these exclusive benefits.</p>
        </div>
        <div>
          <UniversityBenefits />
        </div>
      </div>
      {email?.length ? (
        <div className="mt-12 border-b border-neutral-300 pb-6">
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-neutral-700 font-semibold text-sm ">You are currently verified for the following universities.</p>
          </div>
          <div className="flex flex-col gap-6">
            {email?.map((item: EmailType, idx) => (
              <div key={idx}>
                <div className="flex flex-col gap-6">
                  <div className="relative  flex flex-col gap-2">
                    <label htmlFor="Current Username" className="font-medium text-xs text-neutral-900">
                      University Email
                    </label>

                    <InputBox className="max-w-sm" placeholder="Email Address" type="email" value={item.UniversityEmail} disabled={true} />
                    <div className=" flex  items-center gap-3 ">
                      <Image
                        width={40}
                        height={40}
                        className="w-[40px] h-[40px] object-contain rounded-full shadow-logo p-1"
                        src={item?.logo || uniLogo}
                        alt="logo"
                      />

                      <p className=" text-xs text-neutral-500">{item?.UniversityName}</p>
                      <Image src={badge} width={24} height={24} alt="tick" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
      <Buttons onClick={() => openModal(<UniversityVerificationModal />)} size="small_profile" className=" mt-6 flex items-center gap-1">
        Verify Account <IoIosAddCircle className="w-5 h-5" />
      </Buttons>
    </div>
  )
}

export default UniversityVerificationPage

const UniversityBenefits = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full mt-4">
      <div className="flex gap-2">
        <Image src={blueTick} width={24} height={24} alt="tick" />

        <p className="text-xs text-neutral-500 text-left">Join multiple university communities.</p>
      </div>
      <div className="flex gap-2">
        <Image src={blueTick} width={24} height={24} alt="tick" />

        <p className="text-xs text-neutral-500 text-left">Create your own groups within your university network.</p>
      </div>
      <div className="flex gap-2">
        <Image src={blueTick} width={24} height={24} alt="tick" />

        <p className="text-xs text-neutral-500 text-left">Get full access to private groups and exclusive discussions.</p>
      </div>
    </div>
  )
}
