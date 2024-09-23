import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import LoginButtons from '@/components/atoms/LoginButtons'
import OTPInput from '@/components/atoms/OTP-Input/OTP_Input'
import SupportingText from '@/components/atoms/SupportingText'
import Title from '@/components/atoms/Title'
import { useHandleLoginEmailVerificationGenerate } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface props {
  isVerificationSuccess: boolean
}

const VerificationForm = ({ isVerificationSuccess }: props) => {
  const {
    register,
    formState: { errors: VerificationFormErrors },
    control,
    getValues,
  } = useFormContext()
  const { mutate: generateLoginEmailOTP } = useHandleLoginEmailVerificationGenerate()

  const [countdown, setCountdown] = useState(30)
  const [isCounting, setIsCounting] = useState(false)

  const handleLoginEmailSendCode = () => {
    const email = getValues('email')
    const data = { email }

    generateLoginEmailOTP(data)

    handleLoginEmailSendCodeCount()
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

  return (
    <div className="w-1/2 flex flex-col gap-8 items-center">
      <div className="text-center px-3">
        <Title>Verification</Title>
        <SupportingText>Verify your login credentials.</SupportingText>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2 ">
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Email Address" className="font-medium text-neutral-900">
            Login Email
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
            err={!!VerificationFormErrors.email}
          />
          {VerificationFormErrors.verificationEmail && (
            <InputWarningText>
              {VerificationFormErrors.verificationEmail.message
                ? VerificationFormErrors.verificationEmail.message.toString()
                : 'Please enter your email!'}
            </InputWarningText>
          )}
          <LoginButtons disabled={isCounting} onClick={() => handleLoginEmailSendCode()} type="button" variant="border_primary">
            Send Code
          </LoginButtons>
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
              required: 'OTP is required!',
              validate: (value) => value.length === 6 || 'OTP must be 6 digits long!',
            }}
            render={({ field }) => <OTPInput length={6} value={field.value} onChange={(otp) => field.onChange(otp)} />}
          />
          {VerificationFormErrors.verificationOtp && (
            <InputWarningText>{VerificationFormErrors.verificationOtp.message?.toString() || 'Please enter your OTP!'}</InputWarningText>
          )}
          <LoginButtons variant="border_primary">Confirm Code</LoginButtons>
          {isVerificationSuccess && <p className="text-xs text-green-500 text-center">Login credentials verified.</p>}
        </div>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2">
        <LoginButtons variant="primary">Next Step</LoginButtons>
      </div>
    </div>
  )
}

export default VerificationForm
