'use client'
import Buttons from '@/components/atoms/Buttons'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import { Spinner } from '@/components/spinner/Spinner'
import { useChangeUserPassword } from '@/services/user'
import { useUniStore } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CiLock } from 'react-icons/ci'
import { FaChevronLeft } from 'react-icons/fa'

export interface passwordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type PasswordVisibilityState = {
  showPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
}
const ChangeUserPasswordPage = () => {
  const router = useRouter()
  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibilityState>({
    showPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  })

  const { mutate, error, isPending: isPendingChangeApi, isSuccess } = useChangeUserPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<passwordForm>({})
  const password = watch('newPassword')

  const onSubmit = async (data: passwordForm) => {
    mutate(
      { ...data },
      {
        onSuccess: () => {
          reset()
          showCustomSuccessToast('Password changed successfully')
        },
      }
    )
  }
  return (
    <div className="rounded-2xl">
      <div onClick={() => router.back()} className="flex items-center gap-2 pb-4 pt-0  border-b border-neutral-300 cursor-pointer">
        <FaChevronLeft className="text-neutral-500" />
        <span className="text-neutral-500 font-medium text-sm">Account</span>
      </div>
      <div className="py-4 border-b border-neutral-300">
        <div className="flex flex-col gap-2">
          <h6 className="font-poppins font-bold text-neutral-700 text-[20px]">Change Password</h6>
          <p className="text-neutral-500 text-sm">A strong password prevents your account from attacks.</p>
        </div>
        <form className="w-full flex flex-col items-start gap-8 mt-12 pb-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  min-w-[343px]">
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
              </div>
            </div>
            {errors.currentPassword && <InputWarningText>Please enter your password!</InputWarningText>}
          </div>
          <div className="flex flex-col  min-w-[343px]">
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
              </div>
            </div>
            {errors.newPassword && <InputWarningText>Please enter your password!</InputWarningText>}
          </div>
          <div className="flex flex-col  min-w-[343px]">
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
            {errors.confirmPassword && <InputWarningText>{errors.confirmPassword?.message || 'Please enter your password!'}</InputWarningText>}
          </div>
        </form>
      </div>

      <Buttons size="large" className="h-[42px] mt-6 flex items-center gap-1" onClick={handleSubmit(onSubmit)} disabled={isPendingChangeApi}>
        {isPendingChangeApi ? <Spinner /> : 'Change Password'}
      </Buttons>
    </div>
  )
}

export default ChangeUserPasswordPage
