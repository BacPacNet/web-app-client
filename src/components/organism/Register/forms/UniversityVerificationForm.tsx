import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import LoginButtons from '@/components/atoms/LoginButtons'
import OTPInput from '@/components/atoms/OTP-Input/OTP_Input'
import SupportingText from '@/components/atoms/SupportingText'
import { useHandleUniversityEmailVerificationGenerate } from '@/services/auth'

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface props {
  setStep: (value: number) => void

  setSubStep: (value: number) => void
  isVerificationSuccess: boolean
}

const UniversityVerificationForm = ({ setStep, setSubStep, isVerificationSuccess }: props) => {
  const {
    register,
    formState: { errors: UniversityVerificationFormErrors },
    control,
    getValues,
  } = useFormContext()
  const { mutate: generateUniversityEmailOTP } = useHandleUniversityEmailVerificationGenerate()
  const all = getValues()
  const handleUniversityEmailSendCode = () => {
    const email = getValues('universityEmail')
    const data = { email }
    generateUniversityEmailOTP(data)
  }

  const handleNext = () => {
    setStep(3)
    setSubStep(0)
    localStorage.setItem('registerData', JSON.stringify({ ...all, step: 3, subStep: 0 }))
  }

  return (
    <div className="w-1/2 flex flex-col gap-8 items-center">
      <div className="text-center px-3">
        <h1 className={` text-[28px] font-bold text-neutral-900 font-poppins`}>University Verification</h1>
        <SupportingText>Do you have a email provided by your university?</SupportingText>
      </div>
      <div>
        <div className="flex gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.9996 20.4001C16.6388 20.4001 20.3996 16.6393 20.3996 12.0001C20.3996 7.36091 16.6388 3.6001 11.9996 3.6001C7.36042 3.6001 3.59961 7.36091 3.59961 12.0001C3.59961 16.6393 7.36042 20.4001 11.9996 20.4001ZM15.8921 10.6426C16.3021 10.2325 16.3021 9.56769 15.8921 9.15764C15.482 8.74758 14.8172 8.74758 14.4071 9.15764L10.9496 12.6152L9.59207 11.2576C9.18202 10.8476 8.5172 10.8476 8.10715 11.2576C7.6971 11.6677 7.6971 12.3325 8.10715 12.7426L10.2071 14.8426C10.6172 15.2526 11.282 15.2526 11.6921 14.8426L15.8921 10.6426Z"
              fill="#6744FF"
            />
          </svg>
          <p className="text-sm text-neutral-600 text-center">Can join private groups in university community</p>
        </div>
        <div className="flex gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.9996 20.4001C16.6388 20.4001 20.3996 16.6393 20.3996 12.0001C20.3996 7.36091 16.6388 3.6001 11.9996 3.6001C7.36042 3.6001 3.59961 7.36091 3.59961 12.0001C3.59961 16.6393 7.36042 20.4001 11.9996 20.4001ZM15.8921 10.6426C16.3021 10.2325 16.3021 9.56769 15.8921 9.15764C15.482 8.74758 14.8172 8.74758 14.4071 9.15764L10.9496 12.6152L9.59207 11.2576C9.18202 10.8476 8.5172 10.8476 8.10715 11.2576C7.6971 11.6677 7.6971 12.3325 8.10715 12.7426L10.2071 14.8426C10.6172 15.2526 11.282 15.2526 11.6921 14.8426L15.8921 10.6426Z"
              fill="#6744FF"
            />
          </svg>
          <p className="text-sm text-neutral-600 text-center">Can join more than 1 university community</p>
        </div>
        <div className="flex gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.9996 20.4001C16.6388 20.4001 20.3996 16.6393 20.3996 12.0001C20.3996 7.36091 16.6388 3.6001 11.9996 3.6001C7.36042 3.6001 3.59961 7.36091 3.59961 12.0001C3.59961 16.6393 7.36042 20.4001 11.9996 20.4001ZM15.8921 10.6426C16.3021 10.2325 16.3021 9.56769 15.8921 9.15764C15.482 8.74758 14.8172 8.74758 14.4071 9.15764L10.9496 12.6152L9.59207 11.2576C9.18202 10.8476 8.5172 10.8476 8.10715 11.2576C7.6971 11.6677 7.6971 12.3325 8.10715 12.7426L10.2071 14.8426C10.6172 15.2526 11.282 15.2526 11.6921 14.8426L15.8921 10.6426Z"
              fill="#6744FF"
            />
          </svg>
          <p className="text-sm text-neutral-600 text-center">Can create groups in university community </p>
        </div>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-10 ">
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Email Address" className="font-medium text-neutral-900">
            University Email
          </label>

          <InputBox
            placeholder="Email Address"
            type="email"
            {...register('universityEmail', {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: 'Invalid email format',
              },
            })}
            err={!!UniversityVerificationFormErrors.universityEmail}
          />
          {UniversityVerificationFormErrors.universityEmail && (
            <InputWarningText>
              {UniversityVerificationFormErrors.universityEmail.message
                ? UniversityVerificationFormErrors.universityEmail.message.toString()
                : 'Please enter your email!'}
            </InputWarningText>
          )}
          <LoginButtons onClick={() => handleUniversityEmailSendCode()} type="button" variant="border_primary">
            Send Code
          </LoginButtons>
        </div>
        {/* otp  */}
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Email Address" className="font-medium text-neutral-900">
            Input Verification Code
          </label>

          <Controller
            name="UniversityOtp"
            control={control}
            rules={{
              required: 'OTP is required!',
              validate: (value) => value.length === 6 || 'OTP must be 6 digits long!',
            }}
            render={({ field }) => <OTPInput length={6} value={field.value} onChange={(otp) => field.onChange(otp)} />}
          />
          {UniversityVerificationFormErrors.UniversityOtp && (
            <InputWarningText>{UniversityVerificationFormErrors.UniversityOtp.message?.toString() || 'Please enter your OTP!'}</InputWarningText>
          )}
          <LoginButtons variant="border_primary">Confirm Code</LoginButtons>
          {isVerificationSuccess && <p className="text-xs text-green-500 text-center">University Email verified.</p>}
        </div>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2">
        <LoginButtons variant="shade" onClick={() => handleNext()} type="button">
          Skip University Verification
        </LoginButtons>
        <LoginButtons variant="primary">Complete Verification</LoginButtons>
      </div>
    </div>
  )
}

export default UniversityVerificationForm
