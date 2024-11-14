'use client'
import React, { useState } from 'react'
import SettingModalWrapper from '../SettingModalWrapper'
import SettingsText from '@/components/atoms/SettingsText'
import SubText from '@/components/atoms/SubText'
import InputBox from '@/components/atoms/Input/InputBox'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import Button from '@/components/atoms/Buttons'
import { useForm } from 'react-hook-form'
import InputWarningText from '@/components/atoms/InputWarningText'
import { CiLock } from 'react-icons/ci'
import { useDeActivateUserAccount } from '@/services/user'

type Props = {
  setModal: (value: string | null) => void
}

type FormDataType = {
  Password: string
  confirmPassword: string
  email: string
  userName: string
  sure: boolean
}

type PasswordVisibilityState = {
  showPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
}

const DeActivateModal = ({ setModal }: Props) => {
  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibilityState>({
    showPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  })
  const { mutate, error } = useDeActivateUserAccount()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<FormDataType>({})
  const password = watch('Password')
  const onSubmit = async (data: FormDataType) => {
    mutate(data)
  }

  const togglePasswordVisibility = (field: keyof PasswordVisibilityState) => {
    setPasswordVisibility((prevState: any) => ({
      ...prevState,
      [field]: !prevState[field],
    }))
  }

  return (
    <SettingModalWrapper setModal={setModal}>
      <div className="flex flex-col items-center gap-8">
        <div>
          <SettingsText className="text-md text-center">Account Deactivation</SettingsText>
          <SubText className="">Are you sure about this? Think it through first.</SubText>
        </div>
        <div className="flex flex-col  w-11/12 gap-4">
          <SubText className="text-neutral-700">
            Deactivating your Unibuzz account will permanently remove all public and private information associated with your profile. You must cancel
            any Upgrade subscriptions you have before deactivating your account.{' '}
          </SubText>
        </div>
        <form className="w-full flex flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  w-11/12 gap-4">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                Username
              </label>
              <InputBox
                className="w-full"
                placeholder="UserName"
                type="text"
                {...register('userName', {
                  required: true,
                })}
                err={!!errors.userName}
              />
              {errors.userName && <InputWarningText>{'Please enter your userName!'}</InputWarningText>}
            </div>

            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Email Address" className="font-medium text-neutral-900">
                Email
              </label>

              <InputBox
                placeholder="Email Address"
                type="email"
                {...register('email', {
                  required: true,
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                    message: 'Invalid email format',
                  },
                })}
                err={!!errors.email}
              />
              <SubText>In case you change your mind, we will send a reactivation link valid for 30 days.</SubText>
              {errors.email && (
                <InputWarningText>{errors.email.message ? errors.email.message.toString() : 'Please enter your email!'}</InputWarningText>
              )}
            </div>
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Password" className="font-medium text-neutral-900">
                Password
              </label>
              <div className="relative w-full">
                <span className="absolute z-10 top-2 left-2 text-neutral-400">
                  <CiLock size={20} />
                </span>
                <InputBox
                  className="w-full ps-8"
                  placeholder="************"
                  type={passwordVisibility.showNewPassword ? 'text' : 'password'}
                  {...register('Password', { required: true })}
                  err={!!errors.Password}
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
            {errors.Password && <InputWarningText>Please enter your password!</InputWarningText>}
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
            {errors.confirmPassword && (
              <InputWarningText>{errors.confirmPassword?.message?.toString() || 'Please enter your password!'}</InputWarningText>
            )}
          </div>

          <div className="flex flex-col  w-11/12">
            <div className="flex gap-2 items-center relative">
              <input
                className="w-4 h-4"
                type="checkbox"
                {...register('sure', {
                  required: true,
                })}
              />
              <SubText className="text-xs">I am sure I want to deactivate my Unibuzz account.</SubText>
            </div>
            {errors.sure && <InputWarningText>{'Please accept to continue'}</InputWarningText>}
          </div>
          <Button type="submit" className=" w-11/12" size="small" variant="danger">
            Deactivate Account
          </Button>
        </form>
        {error?.response?.data?.message ? <InputWarningText>{error?.response?.data?.message}</InputWarningText> : ''}
      </div>
    </SettingModalWrapper>
  )
}

export default DeActivateModal
