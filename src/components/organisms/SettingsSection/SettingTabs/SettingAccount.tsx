'use client'
import SettingsText from '@/components/atoms/SettingsText'
import SubText from '@/components/atoms/SubText'
import SupportingText from '@/components/atoms/SupportingText'
import Image from 'next/image'
import React, { useState } from 'react'
import blueTick from '@/assets/blueBGTick.svg'
import { FaCirclePlus } from 'react-icons/fa6'
import uniLogo from '@/assets/unibuzz-orange.png'
import Button from '@/components/atoms/Buttons'
import InputBox from '@/components/atoms/Input/InputBox'

import { useUniStore } from '@/store/store'
import { EmailType } from '@/models/auth'
import { openModal } from '@/components/molecules/Modal/ModalManager'
import ChangeUserNameModal from '../SettingModals/ChangeUserNameModal'
import ChangePasswordModal from '../SettingModals/ChangePasswordModal'
import UniversityVerificationModal from '../SettingModals/UniversityVerificationModal'
import ChangeEmailModal from '../SettingModals/ChangeEmailModal'
import DeActivateModal from '../SettingModals/DeActivateModal'

const SettingAccount = () => {
  const userProfileData = useUniStore((state) => state.userProfileData) || { email: [] }

  const email: EmailType[] = userProfileData.email || []

  const userData = useUniStore((state) => state.userData) || {}
  const userName = userData.userName || ''
  const userEmail = userData.email || ''

  return (
    <div className="flex flex-col  py-4 px-0  max-md:px-4 gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <SettingsText className="text-md">University Verification</SettingsText>
          {email?.length ? (
            <SupportingText className="text-neutral-800">You are currently verified for the following universities:</SupportingText>
          ) : (
            <SupportingText className="text-neutral-800">Verify your account through your university email to unlock full features:</SupportingText>
          )}
        </div>
        {email?.length ? (
          email?.map((item: EmailType, idx) => (
            <div key={idx}>
              <div className="flex flex-col gap-6">
                <div className="relative w-full flex flex-col gap-2">
                  <label htmlFor="Current Username" className="font-medium text-neutral-900">
                    University Email
                  </label>

                  <InputBox className="w-80" placeholder="Email Address" type="email" value={item.UniversityEmail} disabled={true} />
                  <div className=" flex  items-center ">
                    <Image className="w-12 h-12" src={uniLogo} width={30} height={10} alt="logo" />
                    <p className="h-10">{item?.UniversityName}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="">
            <div className="flex gap-2 items-center">
              <Image src={blueTick} width={24} height={24} alt="tick" />
              <SubText>Can join more than 1 university community</SubText>
            </div>
            <div className="flex gap-2 items-center">
              <Image src={blueTick} width={24} height={24} alt="tick" />
              <SubText>Can join private groups in university community</SubText>
            </div>
            <div className="flex gap-2 items-center">
              <Image src={blueTick} width={24} height={24} alt="tick" />
              <SubText>Can create groups within university community </SubText>
            </div>
          </div>
        )}
        <Button onClick={() => openModal(<UniversityVerificationModal />)} className="w-max flex gap-2 items-center" size="extra_small_paddind_2">
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
        <Button onClick={() => openModal(<ChangeUserNameModal />)} className="w-max" size="extra_small_paddind_2">
          Change Username
        </Button>
      </div>
      {/* //Password  */}
      <div className="flex flex-col gap-6">
        <SettingsText className="text-md">Change Password</SettingsText>
        {/* <div className="relative w-full flex flex-col gap-2"> */}
        {/* <label htmlFor="Current Password" className="font-medium text-neutral-900">
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
        <Button onClick={() => openModal(<ChangePasswordModal />)} className="w-max" size="extra_small_paddind_2">
          Change Password
        </Button>
      </div>
      {/* //Change Email  */}
      <div className="flex flex-col gap-6">
        <SettingsText className="text-md">Change Email</SettingsText>
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Current Username" className="font-medium text-neutral-900">
            Current Email
          </label>

          <InputBox className="w-80" placeholder="Email Address" type="email" value={userEmail} disabled />
        </div>
        <Button onClick={() => openModal(<ChangeEmailModal />)} className="w-max" size="extra_small_paddind_2">
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
        <Button onClick={() => openModal(<DeActivateModal />)} className="w-max" size="extra_small_paddind_2" variant="danger">
          Deactivate Account
        </Button>
      </div>
    </div>
  )
}

export default SettingAccount
