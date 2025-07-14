'use client'
import Buttons from '@/components/atoms/Buttons'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import { Spinner } from '@/components/spinner/Spinner'
import { useChangeUserName } from '@/services/user'
import { useUniStore } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { CiLock } from 'react-icons/ci'
import { FaChevronLeft } from 'react-icons/fa'

export interface UserForm {
  userName: string
  newUserName: string
  password: string
}
const ChangeUserNamePage = () => {
  const router = useRouter()
  const { userData } = useUniStore()
  const [showPassword, setShowPassword] = useState(false)

  const { mutate, error, isPending: isPendingChangeApi, isSuccess } = useChangeUserName()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserForm>({})

  const onSubmit = async (data: UserForm) => {
    mutate(
      {
        userName: userData?.userName || '',
        newUserName: data.newUserName,
        password: data.password,
      },
      {
        onSuccess: () => {
          showCustomSuccessToast('Username changed successfully')
          reset()
        },
      }
    )
  }

  return (
    <div className="rounded-lg">
      <div onClick={() => router.back()} className="flex items-center gap-2 pb-4 pt-0  border-b border-neutral-300 cursor-pointer">
        <FaChevronLeft className="text-neutral-500" />
        <span className="text-neutral-500 font-medium text-sm">Account</span>
      </div>
      <div className="py-4 border-b border-neutral-300">
        <div className="flex flex-col gap-2">
          <h6 className="font-poppins font-bold text-neutral-700 text-[20px]">Change Username</h6>
          <p className="text-neutral-500 text-sm">Your username can be used to login and be identified by others.</p>
        </div>
        <form className="w-full flex flex-col items-start gap-8 mt-12 pb-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  min-w-[343px]">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                Current Username
              </label>
              <InputBox
                className="w-full"
                placeholder="UserName"
                type="text"
                value={userData?.userName}
                disabled={true}
                readOnly={true}
                {...register('userName', {
                  //   required: true,
                })}
                err={!!errors.userName}
              />
              {errors.userName && <InputWarningText>{'Please enter your user name!'}</InputWarningText>}
            </div>
          </div>
          <div className="flex flex-col  min-w-[343px]">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                New Username
              </label>
              <InputBox
                className="w-full"
                placeholder="UserName"
                type="text"
                {...register('newUserName', {
                  required: true,
                })}
                err={!!errors.newUserName}
              />
            </div>
            {errors.newUserName && <InputWarningText>{'Please enter your user name!'}</InputWarningText>}
          </div>
          <div className="flex flex-col  min-w-[343px]">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                Enter Password
              </label>
              <div className="relative w-full">
                <span className="absolute z-10 top-2 left-2 text-neutral-400">
                  <CiLock size={20} />
                </span>
                <InputBox
                  className="w-full ps-8"
                  placeholder="************"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: true })}
                  err={!!errors.password}
                />
              </div>
            </div>
            {errors.password && <InputWarningText>Please enter your password!</InputWarningText>}
          </div>
        </form>
      </div>

      <Buttons size="large" className="h-[42px] mt-6 flex items-center gap-1" onClick={handleSubmit(onSubmit)} disabled={isPendingChangeApi}>
        {isPendingChangeApi ? <Spinner /> : 'Change Username'}
      </Buttons>
    </div>
  )
}

export default ChangeUserNamePage
