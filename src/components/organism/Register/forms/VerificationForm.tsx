'use client'
import { OTPInput } from 'input-otp'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import Title from '@/components/atoms/Title'
import { useHandleLoginEmailVerificationGenerateWithCountdown } from '@/services/auth'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Spinner } from '@/components/spinner/Spinner'
import { Slot } from '@/components/atoms/OTP-Input/OTP_SlotAndCarrot'
import { MdOutlineArrowBack } from 'react-icons/md'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

interface props {
  isVerificationSuccess: boolean
  isPending: boolean
  handlePrev: () => void
}

const VerificationForm = ({ isVerificationSuccess, isPending, handlePrev }: props) => {
  const {
    register,
    formState: { errors: VerificationFormErrors },
    control,
    getValues,
    setError,
    clearErrors,
  } = useFormContext()
  const { mutate: generateLoginEmailOTP, countdown, isCounting } = useHandleLoginEmailVerificationGenerateWithCountdown()

  const email = getValues('email')
  const handleLoginEmailSendCode = () => {
    if (!email) {
      setError('email', { type: 'manual', message: 'Please enter your email!' })
      return
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i
    if (!emailRegex.test(email)) {
      setError('email', { type: 'manual', message: 'Invalid email format' })
      return
    }

    clearErrors('email')
    const data = { email }

    generateLoginEmailOTP(data)
  }

  return (
    <div className="w-full  flex flex-col gap-8 items-center ">
      <div className="text-start flex flex-col gap-2 w-full">
        <Title>Verification</Title>
        <SupportingText>Verify your login credentials.</SupportingText>
      </div>
      <div className="w-full flex flex-col gap-8 ">
        <div className="relative w-full flex flex-col gap-4">
          <InputBox
            label="Login Email"
            placeholder="Email Address"
            type="email"
            value={email}
            disabled
            {...register('email', {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: 'Invalid email format',
              },
            })}
            err={!!VerificationFormErrors.email}
          />
          {VerificationFormErrors.verificationEmail && (
            <InputWarningText>
              {VerificationFormErrors.verificationEmail.message
                ? VerificationFormErrors.verificationEmail.message.toString()
                : 'please enter your email!'}
            </InputWarningText>
          )}
          <Button disabled={isCounting} onClick={() => handleLoginEmailSendCode()} type="button" variant="border_primary" className="h-10">
            Send Code
          </Button>
          {isCounting && <p className="text-xs text-neutral-500 text-center">Resend Available after {countdown}s</p>}
        </div>
        {/* otp  */}
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Email Address" className="font-medium text-neutral-900">
            Input Verification Code
          </label>

          <Controller
            name="verificationOtp"
            control={control}
            rules={{
              required: 'otp is required!',
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
          {VerificationFormErrors.verificationOtp && (
            <InputWarningText>{VerificationFormErrors.verificationOtp.message?.toString() || 'Please enter your otp!'}</InputWarningText>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Button disabled={isPending} variant="primary" size="large">
          {' '}
          {isPending ? <Spinner /> : 'Confirm'}
        </Button>
        <Button size="large" onClick={handlePrev} leftIcon={<MdOutlineArrowBack />} variant="shade">
          Review Account
        </Button>
        {isVerificationSuccess && <p className="text-xs text-green-500 text-center">Login credentials verified.</p>}
      </div>
    </div>
  )
}

export default VerificationForm
