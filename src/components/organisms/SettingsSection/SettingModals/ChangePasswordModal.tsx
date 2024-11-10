'use client'
import React, { useState } from 'react'
import SettingModalWrapper from '../SettingModalWrapper'
import SettingsText from '@/components/atoms/SettingsText'
import SubText from '@/components/atoms/SubText'
import InputBox from '@/components/atoms/Input/InputBox'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import LoginButtons from '@/components/atoms/LoginButtons'
import { useForm } from 'react-hook-form'
import InputWarningText from '@/components/atoms/InputWarningText'
import { CiLock } from 'react-icons/ci'
import { useChangeUserPassword } from '@/services/user'

type Props = {
  setModal: (value: string | null) => void
}

export interface passwordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePasswordModal = ({ setModal }: Props) => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    showPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<passwordForm>({})
  const password = watch('newPassword')

  const { mutate, data, error } = useChangeUserPassword()

  const onSubmit = async (data: passwordForm) => {
    mutate(data)
  }

  const togglePasswordVisibility = (field: any) => {
    setPasswordVisibility((prevState: any) => ({
      ...prevState,
      [field]: !prevState[field],
    }))
  }
  return (
    <SettingModalWrapper setModal={setModal}>
      <div className="flex flex-col items-center gap-8">
        <div>
          <SettingsText className="text-md text-center">Change Password</SettingsText>
          <SubText className="">A strong password prevents your account from attacks</SubText>
        </div>
        <form className="w-full flex flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  w-11/12">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                Current Password
              </label>
              <div className="relative w-full">
                <span className="absolute z-10 top-2 left-2 text-neutral-400">
                  <CiLock size={20} />
                </span>
                <InputBox
                  className="w-full ps-8"
                  placeholder="************"
                  type={passwordVisibility.showPassword ? 'text' : 'password'}
                  {...register('currentPassword', { required: true })}
                  err={!!errors.currentPassword}
                />
                <div className={`absolute  right-0 pr-3 flex items-center text-sm top-3 `}>
                  {!passwordVisibility.showPassword ? (
                    <AiOutlineEyeInvisible
                      className="h-5 w-5 text-gray-700 cursor-pointer"
                      onClick={() => togglePasswordVisibility('showPassword')}
                    />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => togglePasswordVisibility('showPassword')} />
                  )}
                </div>
              </div>
            </div>
            {errors.currentPassword && <InputWarningText>Please enter your password!</InputWarningText>}
          </div>
          <div className="flex flex-col  w-11/12">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                New Password
              </label>
              <div className="relative w-full">
                <span className="absolute z-10 top-2 left-2 text-neutral-400">
                  <CiLock size={20} />
                </span>
                <InputBox
                  className="w-full ps-8"
                  placeholder="************"
                  type={passwordVisibility.showNewPassword ? 'text' : 'password'}
                  {...register('newPassword', { required: true })}
                  err={!!errors.newPassword}
                />
                <div className={`absolute  right-0 pr-3 flex items-center text-sm top-3 `}>
                  {!passwordVisibility.showNewPassword ? (
                    <AiOutlineEyeInvisible
                      className="h-5 w-5 text-gray-700 cursor-pointer"
                      onClick={() => togglePasswordVisibility('showNewPassword')}
                    />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => togglePasswordVisibility('showNewPassword')} />
                  )}
                </div>
              </div>
            </div>
            {errors.newPassword && <InputWarningText>Please enter your password!</InputWarningText>}
          </div>
          <div className="flex flex-col  w-11/12">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                Confirm Password
              </label>
              <div className="relative w-full">
                <span className="absolute z-10 top-2 left-2 text-neutral-400">
                  <CiLock size={20} />
                </span>
                <InputBox
                  className="w-full ps-8"
                  placeholder="************"
                  type={passwordVisibility.showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', { required: true, validate: (value) => value === password || 'Passwords do not match' })}
                  err={!!errors.confirmPassword}
                />
                <div className={`absolute  right-0 pr-3 flex items-center text-sm top-3 `}>
                  {!passwordVisibility.showConfirmPassword ? (
                    <AiOutlineEyeInvisible
                      className="h-5 w-5 text-gray-700 cursor-pointer"
                      onClick={() => togglePasswordVisibility('showConfirmPassword')}
                    />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => togglePasswordVisibility('showConfirmPassword')} />
                  )}
                </div>
              </div>
            </div>
            {errors.confirmPassword && <InputWarningText>{errors.confirmPassword?.message || 'Please enter your password!'}</InputWarningText>}
          </div>
          <LoginButtons type="submit" className=" w-11/12" size="small">
            Push Change
          </LoginButtons>
        </form>
        {error?.response?.data?.message ? <InputWarningText>{error?.response?.data?.message}</InputWarningText> : ''}
      </div>
    </SettingModalWrapper>
  )
}

export default ChangePasswordModal
