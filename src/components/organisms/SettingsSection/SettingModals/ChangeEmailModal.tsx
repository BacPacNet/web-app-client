'use client'
import React, { useState } from 'react'
import SettingModalWrapper from '../SettingModalWrapper'
import SettingsText from '@/components/atoms/SettingsText'
import SubText from '@/components/atoms/SubText'
import InputBox from '@/components/atoms/Input/InputBox'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import LoginButtons from '@/components/atoms/LoginButtons'
import { Controller, useForm } from 'react-hook-form'
import InputWarningText from '@/components/atoms/InputWarningText'
import { CiLock } from 'react-icons/ci'
import OTPInput from '@/components/atoms/OTP-Input/OTP_Input'
import { useHandleLoginEmailVerificationGenerate } from '@/services/auth'
import { useChangeUserEmail } from '@/services/user'

type Props = {
  setModal: (value: string | null) => void
}

const ChangeEmailModal = ({ setModal }: Props) => {
  const { mutate: generateEmailOTP, data: otpData } = useHandleLoginEmailVerificationGenerate()
  const { mutate, error } = useChangeUserEmail()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    clearErrors,
    setError,
    getValues,
  } = useForm({})

  const handleEmailSendCode = () => {
    const email = getValues('newMail')
    if (!email) {
      setError('newMail', { type: 'manual', message: 'Please enter your email!' })
      return
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i
    if (!emailRegex.test(email)) {
      setError('newMail', { type: 'manual', message: 'Invalid email format' })
      return
    }

    clearErrors('newMail')
    const data = { email }
    generateEmailOTP(data)
  }

  const onSubmit = async (data: any) => {
    mutate(data)
  }

  return (
    <SettingModalWrapper setModal={setModal}>
      <div className="flex flex-col items-center gap-8">
        <div>
          <SettingsText className="text-md text-center">Change Email</SettingsText>
          <SubText className="">This is your recovery email you use for authentication.</SubText>
        </div>
        <form className="w-full flex flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  w-11/12 gap-4">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Email Address" className="font-medium text-neutral-900">
                Current Email
              </label>

              <InputBox
                placeholder="Email Address"
                type="email"
                {...register('currentEmail', {
                  required: true,
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                    message: 'Invalid email format',
                  },
                })}
                err={!!errors.currentEmail}
              />
              {errors.currentEmail && (
                <InputWarningText>
                  {errors.currentEmail.message ? errors.currentEmail.message.toString() : 'Please enter your email!'}
                </InputWarningText>
              )}
            </div>

            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="Email Address" className="font-medium text-neutral-900">
                New Email
              </label>

              <InputBox
                placeholder="Email Address"
                type="email"
                {...register('newMail', {
                  required: true,
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                    message: 'Invalid email format',
                  },
                })}
                err={!!errors.newMail}
              />
              {errors.newMail && (
                <InputWarningText>{errors.newMail.message ? errors.newMail.message.toString() : 'Please enter your email!'}</InputWarningText>
              )}
              <LoginButtons onClick={() => handleEmailSendCode()} type="button" variant="border_primary">
                Send Code
              </LoginButtons>
            </div>

            {/* otp  */}
            {otpData?.isAvailable ? (
              <div className="relative w-full flex flex-col gap-2">
                <label htmlFor="Email Address" className="font-medium text-neutral-900">
                  Input Verification Code
                </label>

                <Controller
                  name="emailOtp"
                  control={control}
                  rules={{
                    required: 'OTP is required!',
                    validate: (value) => value.length === 6 || 'OTP must be 6 digits long!',
                  }}
                  render={({ field }) => <OTPInput length={6} value={field.value || '000000'} onChange={(otp) => field.onChange(otp)} />}
                />
                {errors.emailOtp && <InputWarningText>{errors.emailOtp.message?.toString() || 'Please enter your OTP!'}</InputWarningText>}
                {/* <LoginButtons variant="border_primary">Confirm Code</LoginButtons> */}
              </div>
            ) : (
              ''
            )}
          </div>
          {otpData?.isAvailable ? (
            <LoginButtons type="submit" className=" w-11/12" size="small">
              Push Change
            </LoginButtons>
          ) : (
            ''
          )}
        </form>
        {error?.response?.data?.message ? <InputWarningText>{error?.response?.data?.message}</InputWarningText> : ''}
      </div>
    </SettingModalWrapper>
  )
}

export default ChangeEmailModal
