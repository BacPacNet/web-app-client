'use client'
import SettingsText from '@/components/atoms/SettingsText'
import SubText from '@/components/atoms/SubText'
import SupportingText from '@/components/atoms/SupportingText'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaCirclePlus } from 'react-icons/fa6'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import Button from '@/components/atoms/Buttons'
import InputBox from '@/components/atoms/Input/InputBox'
import badge from '@/assets/badge.svg'

import { useUniStore } from '@/store/store'
import { EmailType } from '@/models/auth'
import ChangeUserNameModal from '../SettingModals/ChangeUserNameModal'
import ChangePasswordModal from '../SettingModals/ChangePasswordModal'
import UniversityVerificationModal from '../SettingModals/UniversityVerificationModal'
import ChangeEmailModal from '../SettingModals/ChangeEmailModal'
import DeActivateModal from '../SettingModals/DeActivateModal'
import UniversityVerificationPerks from '@/components/atoms/UniversityVerificationPerks'
import { useModal } from '@/context/ModalContext'

const SettingAccount = () => {
  const userProfileData = useUniStore((state) => state.userProfileData) || { email: [] }
  const { openModal } = useModal()
  const email: EmailType[] = userProfileData.email || []

  const userData = useUniStore((state) => state.userData) || {}
  const userName = userData.userName || ''
  const userEmail = userData.email || ''

  return (
    <div className="flex flex-col py-4 px-2  max-md:px-4 gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <SettingsText className="text-[20px] font-bold font-poppins text-neutral-700">University Verification</SettingsText>
          <UniversityVerificationPerks />
          {email?.length > 0 && (
            <SupportingText className="text-neutral-800 text-xs">You are currently verified for the following universities:</SupportingText>
          )}
        </div>
        {email?.map((item: EmailType, idx) => (
          <div key={idx}>
            <div className="flex flex-col gap-6">
              <div className="relative w-full flex flex-col gap-2">
                <label htmlFor="Current Username" className="font-medium text-neutral-700 text-xs">
                  University Email
                </label>

                <InputBox className="w-80" placeholder="Email Address" type="email" value={item.UniversityEmail} disabled={true} />
                <div className=" flex items-center gap-2">
                  <div className="rounded-full w-7 h-7 flex justify-center items-center border border-neutral-200 shadow-card">
                    <Image
                      className="w-6 h-6 object-contain rounded-full"
                      src={item.logo || universityLogoPlaceholder}
                      width={10}
                      height={10}
                      alt="logo"
                    />
                  </div>
                  <p className="text-neutral-700 font-semibold">{item?.UniversityName}</p>
                  <Image src={badge} width={18} height={18} alt="badge" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <Button onClick={() => openModal(<UniversityVerificationModal />)} className="w-max flex gap-2 items-center" size="medium">
          Verify Account {email?.length ? <FaCirclePlus /> : ''}
        </Button>
      </div>
      {/* //userName  */}
      <div className="flex flex-col gap-6">
        <SettingsText className="text-md">Change Username</SettingsText>
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Current Username" className="font-medium text-neutral-900">
            Current Username
          </label>

          <InputBox className="w-80" placeholder="Email Address" type="email" value={userName} disabled />
        </div>
        <Button onClick={() => openModal(<ChangeUserNameModal />)} className="w-max" size="large">
          Change Username
        </Button>
      </div>
      {/* //Password  */}
      <div className="flex flex-col gap-6">
        <SettingsText className="text-md">Change Password</SettingsText>
        {/* <div className="relative w-full flex flex-col gap-2"> */}
        {/* <label htmlFor="Current Password" className="font-large text-neutral-900">
            Current Password
          </label> */}
        {/* <div className="relative w-80">
            <InputBox className="w-80" placeholder="************" type={showPassword ? 'text' : 'password'} />
            <div className={`absolute  right-0 pr-3 flex items-center text-sm top-3 `}>
              {!showPassword ? (
                <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
              )}
            </div>
          </div> */}
        {/* </div> */}
        <Button onClick={() => openModal(<ChangePasswordModal />)} className="w-max" size="large">
          Change Password
        </Button>
      </div>
      {/* //Change Email  */}
      <div className="flex flex-col gap-6">
        <SettingsText className="text-md">Change Email</SettingsText>
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Current Username" className="font-large text-neutral-900">
            Current Email
          </label>

          <InputBox className="w-80" placeholder="Email Address" type="email" value={userEmail} disabled />
        </div>
        <Button onClick={() => openModal(<ChangeEmailModal />)} className="w-max" size="large">
          Change Email
        </Button>
      </div>

      {/* deactivate  */}
      <div className="flex flex-col gap-6">
        <div>
          <SettingsText className="text-md">Account Deactivation</SettingsText>
          <SubText className="text-neutral-800">
            You’re about to start the process of deactivating your Unibuzz account. Your information will no longer be viewable on Unibuzz. You can
            restore your Unibuzz account if it was accidentally or wrongfully deactivated for up to 30 days after deactivation.{' '}
          </SubText>
        </div>
        <Button onClick={() => openModal(<DeActivateModal />)} className="w-max" size="medium" variant="danger">
          Deactivate Account
        </Button>
      </div>
    </div>
  )
}

export default SettingAccount
