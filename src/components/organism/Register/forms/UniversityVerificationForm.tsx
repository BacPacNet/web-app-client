import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import { OTPInput } from 'input-otp'
import SupportingText from '@/components/atoms/SupportingText'
import { useHandleUniversityEmailVerificationGenerate } from '@/services/auth'
import blueTick from '@/assets/blueBGTick.svg'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Image from 'next/image'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import Spinner from '@/components/atoms/spinner'
import { Slot } from '@/components/atoms/OTP-Input/OTP_SlotAndCarrot'

interface props {
  setStep: (value: number) => void

  setSubStep: (value: number) => void
  isVerificationSuccess: boolean
  isPending: boolean
}

const UniversityVerificationForm = ({ setStep, setSubStep, isVerificationSuccess, isPending }: props) => {
  const [countdown, setCountdown] = useState(30)
  const [isCounting, setIsCounting] = useState(false)
  const {
    register,
    formState: { errors: UniversityVerificationFormErrors },
    control,
    getValues,
    setError,
    clearErrors,
  } = useFormContext()
  const { mutate: generateUniversityEmailOTP } = useHandleUniversityEmailVerificationGenerate()
  const all = getValues()

  const handleUniversityEmailSendCode = () => {
    const email = getValues('universityEmail')
    if (!email) {
      setError('universityEmail', { type: 'manual', message: 'please enter your email!' })
      return
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i
    if (!emailRegex.test(email)) {
      setError('universityEmail', { type: 'manual', message: 'invalid email format' })
      return
    }

    clearErrors('universityEmail')
    const data = { email }
    handleLoginEmailSendCodeCount()
    generateUniversityEmailOTP(data)
  }

  const handleNext = () => {
    setStep(3)
    setSubStep(0)
    localStorage.setItem('registerData', JSON.stringify({ ...all, step: 3, subStep: 0 }))
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
    <div className="w-full sm:w-96 lg:w-1/2 flex flex-col gap-6 items-center ">
      <div className="text-center px-3">
        <h1 className={` text-[28px] font-bold text-neutral-900 font-poppins`}>University Verification</h1>
        <SupportingText>Do you have a email provided by your university?</SupportingText>
      </div>
      <div>
        <div className="flex gap-2">
          <Image src={blueTick} width={24} height={24} alt="tick" />

          <p className="text-sm text-neutral-600 text-center">Can join private groups in university community</p>
        </div>
        <div className="flex gap-2">
          <Image src={blueTick} width={24} height={24} alt="tick" />

          <p className="text-sm text-neutral-600 text-center">Can join more than 1 university community</p>
        </div>
        <div className="flex gap-2">
          <Image src={blueTick} width={24} height={24} alt="tick" />

          <p className="text-sm text-neutral-600 text-center">Can create groups in university community </p>
        </div>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-5 ">
        {all?.status == 'Applicant' && (
          <div className="w-full flex flex-col relative">
            <label htmlFor="Email Address" className="font-medium text-neutral-900">
              University Name
            </label>

            <Controller
              name="universityName"
              control={control}
              rules={{ required: 'University name is required!' }}
              render={({ field }) => (
                <SelectUniversityDropdown
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select University Name"
                  icon={'single'}
                  search={true}
                  err={!!UniversityVerificationFormErrors.universityName}
                />
              )}
            />
            {UniversityVerificationFormErrors.universityName && (
              <InputWarningText>{UniversityVerificationFormErrors?.universityName?.message?.toString()}</InputWarningText>
            )}
          </div>
        )}

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
          <Button disabled={isCounting} onClick={() => handleUniversityEmailSendCode()} type="button" variant="border_primary" className="h-10">
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
            name="UniversityOtp"
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
                  <div className="flex gap-2 placeholder-neutral-300">
                    {slots.map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                )}
              />
            )}
          />

          {UniversityVerificationFormErrors.UniversityOtp && (
            <InputWarningText>{UniversityVerificationFormErrors.UniversityOtp.message?.toString() || 'Please enter your otp!'}</InputWarningText>
          )}
        </div>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2">
        <Button disabled={isPending} variant="shade" onClick={() => handleNext()} type="button" className="h-10">
          Skip University Verification
        </Button>

        <Button variant="primary"> {isPending ? <Spinner /> : 'Confirm'}</Button>
        {isVerificationSuccess && <p className="text-xs text-green-500 text-center">University Email verified.</p>}
      </div>
    </div>
  )
}

export default UniversityVerificationForm
