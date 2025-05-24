'use client'
import React, { useEffect, useState } from 'react'
import SettingsText from '@/components/atoms/SettingsText'
import SubText from '@/components/atoms/SubText'
import InputBox from '@/components/atoms/Input/InputBox'
import Button from '@/components/atoms/Buttons'
import { Controller, useForm } from 'react-hook-form'
import InputWarningText from '@/components/atoms/InputWarningText'
import { OTPInput } from 'input-otp'
import { Slot } from '@/components/atoms/OTP-Input/OTP_SlotAndCarrot'
import { useHandleLoginEmailVerificationGenerate } from '@/services/auth'
import { useChangeUserEmail } from '@/services/user'
import { Spinner } from '@/components/spinner/Spinner'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

type FormDataType = {
  currentEmail: string
  emailOtp: string
  newMail: string
}

const ChangeEmailModal = () => {
  const [countdown, setCountdown] = useState(30)
  const [isCounting, setIsCounting] = useState(false)
  const { mutate: generateEmailOTP, data: otpData, isPending } = useHandleLoginEmailVerificationGenerate()
  const { mutate, error, isPending: isPendingChangeApi, isSuccess } = useChangeUserEmail()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    clearErrors,
    setError,
    getValues,
  } = useForm<FormDataType>({})

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
    handleLoginEmailSendCodeCount()
    generateEmailOTP(data)
  }

  const onSubmit = async (data: FormDataType) => {
    mutate(data)
  }

  const handleLoginEmailSendCodeCount = () => {
    setIsCounting(true)
    setCountdown(30)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setIsCounting(false)
    }
    return () => clearTimeout(timer)
  }, [countdown, isCounting])

  useEffect(() => {
    if (isSuccess) {
      showCustomSuccessToast('Email Changed Successfully!')
    }
  }, [isSuccess])

  return (
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
              <InputWarningText>{errors.currentEmail.message ? errors.currentEmail.message.toString() : 'Please enter your email!'}</InputWarningText>
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
            <Button disabled={isCounting} onClick={() => handleEmailSendCode()} type="button" variant="border_primary">
              Send Code
            </Button>
            {isCounting && <p className="text-xs text-neutral-500 text-center">Resend available after {countdown}s</p>}
          </div>

          {/* otp  */}
          {isPending && (
            <div className="w-full flex justify-center">
              <Spinner />
            </div>
          )}
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
                render={({ field }) => (
                  <OTPInput
                    {...field}
                    maxLength={6}
                    containerClassName="group flex items-center has-[:disabled]:opacity-30  "
                    value={field.value}
                    placeholder="000000"
                    inputMode="numeric"
                    render={({ slots }) => (
                      <div className={`flex gap-2 ${field.value ? 'text-neutral-700' : 'text-neutral-300'} `}>
                        {slots.map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </div>
                    )}
                  />
                )}
              />
              {errors.emailOtp && <InputWarningText>{errors.emailOtp.message?.toString() || 'Please enter your otp!'}</InputWarningText>}
            </div>
          ) : (
            ''
          )}
        </div>
        {otpData?.isAvailable ? (
          <Button disabled={isPendingChangeApi} type="submit" className=" w-11/12" size="large">
            {isPendingChangeApi ? <Spinner /> : 'Push Change'}
          </Button>
        ) : (
          ''
        )}
      </form>
      {error?.response?.data?.message ? <InputWarningText>{error?.response?.data?.message}</InputWarningText> : ''}
    </div>
  )
}

export default ChangeEmailModal
