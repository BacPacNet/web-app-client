'use client'
import React, { useEffect, useState } from 'react'
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
import { useChangeUserName } from '@/services/user'
import { Spinner } from '@/components/spinner/Spinner'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

type props = {
  setModal: (value: string | null) => void
}

export interface UserForm {
  userName: string
  newUserName: string
  password: string
}
const ChangeUserNameModal = ({ setModal }: props) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({})

  const { mutate, error, isPending: isPendingChangeApi, isSuccess } = useChangeUserName()

  const onSubmit = async (data: UserForm) => {
    mutate(data)
  }

  useEffect(() => {
    if (isSuccess) {
      showCustomSuccessToast('User Name Changed Successfully!')
      setModal(null)
    }
  }, [isSuccess])

  return (
    <SettingModalWrapper setModal={setModal}>
      <div className="flex flex-col items-center gap-8">
        <div>
          <SettingsText className="text-md text-center"> Change Username</SettingsText>
          <SubText className="">Every username is unique. Be creative!</SubText>
        </div>
        <form className="w-full flex flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  w-11/12">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Current Username" className="font-medium text-neutral-900">
                Current Username
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
          </div>
          <div className="flex flex-col  w-11/12">
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
            {errors.newUserName && <InputWarningText>{'Please enter your userName!'}</InputWarningText>}
          </div>
          <div className="flex flex-col  w-11/12">
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
                <div className={`absolute  right-0 pr-3 flex items-center text-sm top-3 `}>
                  {!showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                  ) : (
                    <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                  )}
                </div>
              </div>
            </div>
            {errors.password && <InputWarningText>Please enter your password!</InputWarningText>}
          </div>
          <Button disabled={isPendingChangeApi} type="submit" className=" w-11/12" size="small">
            {isPendingChangeApi ? <Spinner /> : 'Push Change'}
          </Button>
        </form>
        {error?.response?.data?.message ? <InputWarningText>{error?.response?.data?.message}</InputWarningText> : ''}
      </div>
    </SettingModalWrapper>
  )
}

export default ChangeUserNameModal
