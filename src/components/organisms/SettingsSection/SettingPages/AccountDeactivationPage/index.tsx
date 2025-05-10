'use client'
import Buttons from '@/components/atoms/Buttons'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import { Spinner } from '@/components/spinner/Spinner'
import { useDeActivateUserAccount } from '@/services/user'
import { useUniStore } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CiLock } from 'react-icons/ci'
import { FaChevronLeft } from 'react-icons/fa'

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
const AccountDeactivationPage = () => {
  const router = useRouter()
  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibilityState>({
    showPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  })
  const { mutate, error, isPending: isPendingChangeApi, isSuccess } = useDeActivateUserAccount()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormDataType>({})
  const password = watch('Password')

  const onSubmit = async (data: FormDataType) => {
    mutate(
      { ...data },
      {
        onSuccess: () => {
          reset()
          showCustomSuccessToast('Account has been Deactivated')
        },
      }
    )
  }

  return (
    <div className="p-4   rounded-2xl">
      <div onClick={() => router.back()} className="flex items-center gap-2 pb-4 pt-0  border-b border-neutral-300 cursor-pointer">
        <FaChevronLeft className="text-neutral-500" />
        <span className="text-neutral-500 font-medium text-sm">Account</span>
      </div>
      <div className="py-4 border-b border-neutral-300">
        <div className="flex flex-col gap-2">
          <h6 className="font-poppins font-bold text-neutral-700 text-[20px]">Account Deactivation</h6>
          <p className="text-neutral-500 text-sm">
            Deactivating your Unibuzz account will permanently remove all public and private information associated with your profile.
          </p>
        </div>
        <form className="w-full flex flex-col items-start gap-8 mt-12 pb-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col   gap-4 max-w-[343px]">
            <div className="relative  flex flex-col gap-2 ">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                Username
              </label>
              <div>
                <InputBox
                  className="w-full"
                  placeholder="UserName"
                  type="text"
                  {...register('userName', {
                    required: true,
                  })}
                  err={!!errors.userName}
                />
                {errors.userName && <InputWarningText>{'Please enter your user name!'}</InputWarningText>}
              </div>
            </div>

            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Email Address" className="font-medium text-neutral-900">
                Email
              </label>
              <div>
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

                <p className="text-xs text-neutral-500">In case you change your mind, we will send a reactivation link valid for 30 days.</p>
                {errors.email && (
                  <InputWarningText>{errors.email.message ? errors.email.message.toString() : 'Please enter your email!'}</InputWarningText>
                )}
              </div>
            </div>
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Password" className="font-medium text-neutral-900">
                Password
              </label>
              <div className="relative w-full">
                <span className="absolute z-10 top-2 left-2 text-neutral-400">
                  <CiLock size={20} />
                </span>
                <div>
                  <InputBox
                    className="w-full ps-8"
                    placeholder="************"
                    type={passwordVisibility.showNewPassword ? 'text' : 'password'}
                    {...register('Password', { required: true })}
                    err={!!errors.Password}
                  />
                </div>
                {errors.Password && <InputWarningText>Please enter your password!</InputWarningText>}
              </div>
            </div>
            <div className="flex flex-col  ">
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
                </div>
              </div>
              {errors.confirmPassword && (
                <InputWarningText>{errors.confirmPassword?.message?.toString() || 'Please enter your password!'}</InputWarningText>
              )}
            </div>
          </div>

          <div className="flex flex-col  ">
            <div className="flex gap-2 items-center relative">
              <input
                className="w-4 h-4"
                type="checkbox"
                {...register('sure', {
                  required: true,
                })}
              />
              <p className="text-neutral-700 text-xs">I am sure I want to deactivate my Unibuzz account.</p>
            </div>
            {errors.sure && <InputWarningText>{'Please accept to continue'}</InputWarningText>}
          </div>
        </form>
      </div>

      <Buttons
        size="small_profile"
        variant="danger"
        className="h-[42px] mt-6 flex items-center gap-1"
        onClick={handleSubmit(onSubmit)}
        disabled={isPendingChangeApi}
      >
        {isPendingChangeApi ? <Spinner /> : '  Deactivate Account'}
      </Buttons>
    </div>
  )
}

export default AccountDeactivationPage
