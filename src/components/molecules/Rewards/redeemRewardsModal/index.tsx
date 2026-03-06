'use client'

import Buttons from '@/components/atoms/Buttons'
import InputBox from '@/components/atoms/Input/InputBox'
import React from 'react'
import { useForm } from 'react-hook-form'
import infoIcon from '@/assets/rewards/info.svg'
import Image from 'next/image'
import { useModal } from '@/context/ModalContext'
import RedeemSuccessModal from '../redeemSuccessModal'
import { usePostUserRequestRewards } from '@/services/user'

type FormValues = {
  email: string
}

export default function RedeemRewardsModal({ amount, onClose }: { amount: number; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()
  const { mutate: postUserRequestRewards, isPending } = usePostUserRequestRewards()

  const { closeModal, openModal } = useModal()

  const onSubmit = (data: FormValues) => {
    postUserRequestRewards(
      { awsEmail: data.email },
      {
        onSuccess: () => {
          openModal(<RedeemSuccessModal onClose={() => closeModal()} />, 'h-auto w-[350px] sm:w-[490px] hideScrollbar')
        },
      }
    )
  }

  return (
    <div className=" flex flex-col gap-6">
      <h2 className="text-md font-poppins font-bold text-neutral-700 text-center ">Redeem Rewards</h2>

      <div className="flex gap-4 items-start px-4 py-3 bg-[#F3F2FF] border border-[#6744FF33] rounded-lg ">
        <div className="text-primary flex-shrink-0">
          <Image src={infoIcon} alt="info" width={20} height={20} />
        </div>
        <p className="text-sm text-neutral-700 ">
          Enter your Amazon account email to receive your <b className="whitespace-nowrap">₹{amount} gift card</b>. Processing may take up to several
          business days.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex gap-4 items-center justify-between">
          <div className="relative w-full flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-sm text-neutral-700">
              Amazon Account Email
            </label>

            <InputBox
              className="text-xs"
              placeholder="john.dowry@example.com"
              type="email"
              {...register('email', {
                required: true,
              })}
              err={!!errors.email}
            />

            {errors.email && <span className="text-red-500 text-2xs font-normal">This field is required</span>}
            <p className="text-xs text-neutral-500">Please ensure the email is correct to avoid payment issues.</p>
          </div>
        </div>

        <p className="text-xs text-neutral-500">
          Having issues receiving your rewards? <span className="text-[#6744FF] cursor-pointer">Contact us through our feedback form.</span>
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <Buttons variant="shade" size="large" className="w-max" onClick={onClose}>
            Close
          </Buttons>

          <Buttons variant="primary" size="large" className="w-max" disabled={isPending}>
            Submit Email
          </Buttons>
        </div>
      </form>
    </div>
  )
}
