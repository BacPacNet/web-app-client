'use client'
import Buttons from '@/components/atoms/Buttons'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import DeleteAccountModal from '@/components/molecules/SettingsDeleteAccountModal'
import GenericInfoModal from '@/components/molecules/VerifyUniversityToJoinModal/VerifyUniversityToJoinModal'
import { Spinner } from '@/components/spinner/Spinner'
import { useModal } from '@/context/ModalContext'
import { useLogout } from '@/hooks/useLogOut'
import { useDeleteUserAccount } from '@/services/user'
import { useUniStore } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CiLock } from 'react-icons/ci'
import { FaChevronLeft } from 'react-icons/fa'

type FormDataType = {
  password: string
  email: string
  sure: boolean
}

type PasswordVisibilityState = {
  showPassword: boolean
}
const DeleteAccountPage = () => {
  const router = useRouter()
  const { userData } = useUniStore()
  const { openModal, closeModal } = useModal()
  const { mutate, error, isPending: isPendingChangeApi } = useDeleteUserAccount()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    getValues,
  } = useForm<FormDataType>({})
  const { handleLogout } = useLogout()
  const onSubmit = async () => {
    const data = getValues()
    mutate(
      { ...data },
      {
        onSuccess: () => {
          reset()
          closeModal()
          showCustomSuccessToast('Account has been deleted')
          handleLogout()
        },
      }
    )
  }

  const handelOpenModal = () => {
    if (!getValues('sure')) {
      return showCustomDangerToast('Please accept to continue')
    }
    if (!getValues('password')) {
      return showCustomDangerToast('Please enter your password')
    }

    openModal(<DeleteAccountModal onConfirm={onSubmit} pending={isPendingChangeApi} />, 'w-[350px] sm:w-[490px] hideScrollbar h-max')
  }

  return (
    <div className="rounded-lg">
      <div onClick={() => router.back()} className="flex items-center gap-2 pb-4 pt-0  border-b border-neutral-300 cursor-pointer">
        <FaChevronLeft className="text-neutral-500" />
        <span className="text-neutral-500 font-medium text-sm">Account</span>
      </div>
      <div className="py-4 border-b border-neutral-300">
        <div className="flex flex-col gap-2">
          <h6 className="font-poppins font-bold text-neutral-700 text-[20px]">Account Deletion</h6>
          <p className="text-neutral-500 text-sm ">
            Deleting your Unibuzz account will remove all public and private information linked to your profile. Personal messages cannot be deleted.
            <br /> This action is permanent.
          </p>
        </div>
        <form className="w-full flex flex-col items-start gap-8 mt-12 pb-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col   gap-4 max-w-[343px]">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Email Address" className="font-medium text-neutral-900">
                Email
              </label>
              <div>
                <InputBox placeholder="Email Address" type="email" err={!!errors.email} value={userData?.email} disabled={true} readOnly={true} />
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
                    type={'password'}
                    {...register('password', { required: true })}
                    err={!!errors.password}
                  />
                </div>
                {errors.password && <InputWarningText>Please enter your password!</InputWarningText>}
              </div>
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
              <p className="text-neutral-700 text-xs">I am sure I want to delete my Unibuzz account.</p>
            </div>
            {errors.sure && <InputWarningText>{'Please accept to continue'}</InputWarningText>}
          </div>
        </form>
      </div>

      <Buttons
        size="large"
        variant="danger"
        className="h-[42px] mt-6 flex items-center gap-1"
        // onClick={handleSubmit(onSubmit)}
        onClick={handelOpenModal}
        disabled={isPendingChangeApi}
      >
        Delete Account
      </Buttons>
    </div>
  )
}

export default DeleteAccountPage
