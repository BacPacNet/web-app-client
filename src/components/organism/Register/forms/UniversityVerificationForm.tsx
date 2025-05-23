import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import { OTPInput } from 'input-otp'
import SupportingText from '@/components/atoms/SupportingText'
import { useHandleRegister_v2, useHandleUniversityEmailVerificationGenerate } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import Spinner from '@/components/atoms/spinner'
import { Slot } from '@/components/atoms/OTP-Input/OTP_SlotAndCarrot'
import useCookie from '@/hooks/useCookie'
interface props {
  setStep: (value: number) => void

  setSubStep: (value: number) => void
  isVerificationSuccess: boolean
  isPending: boolean
}

const UniversityVerificationForm = ({ setStep, setSubStep, isVerificationSuccess, isPending }: props) => {
  const [countdown, setCountdown] = useState(30)
  const [isCounting, setIsCounting] = useState(false)
  const [cookieValue, setCookieValue, deleteCookie] = useCookie('register_data')
  const {
    register,
    formState: { errors: UniversityVerificationFormErrors },
    control,
    getValues,
    setError,
    clearErrors,
  } = useFormContext()
  const { mutate: generateUniversityEmailOTP } = useHandleUniversityEmailVerificationGenerate()
  const { mutateAsync: HandleRegister, isPending: registerIsPending } = useHandleRegister_v2()
  const [cookieLoginValue, setCookieLoginValue] = useCookie('login_data')
  const all = getValues()
  const univeristyName = getValues('universityName')
  const universityLogo = getValues('universityLogo')

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

  const handleNext = async () => {
    const data = JSON.parse(cookieValue)
    const dob = new Date(data.birthDate)
    const timestampMs = dob.getTime()
    data.birthDate = timestampMs.toString()

    const res = await HandleRegister(data)
    if (res?.isRegistered) {
      const expirationDateForLoginData = new Date(Date.now() + 1 * 60 * 1000).toUTCString()

      setCookieLoginValue(JSON.stringify({ email: data?.email, password: data.password }), expirationDateForLoginData)
      deleteCookie()

      setStep(4)
      setSubStep(0)
    }
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
    <div className="w-full  flex flex-col gap-8 items-center ">
      <div className="text-center flex flex-col gap-2">
        <h1 className={` text-md font-bold text-neutral-900 font-poppins`}>University Verification</h1>
        <SupportingText className="text-xs">Do you have a email provided by your university?</SupportingText>
      </div>
      {/*<div className="flex flex-col items-start justify-start w-full">
        <div className="flex gap-2">
          <Image src={blueTick} width={24} height={24} alt="tick" />

          <p className="text-xs text-neutral-500 text-center">Can join private groups in university community</p>
        </div>
        <div className="flex gap-2">
          <Image src={blueTick} width={24} height={24} alt="tick" />

          <p className="text-xs text-neutral-500 text-center">Can join more than 1 university community</p>
        </div>
        <div className="flex gap-2">
          <Image src={blueTick} width={24} height={24} alt="tick" />

          <p className="text-xs text-neutral-500 text-center">Can create groups in university community </p>
        </div>
      </div>*/}
      <div className="flex gap-2 items-center justify-start w-full ">
        <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-card">
          <img alt="logo" width={36} height={36} src={universityLogo} className="object-contain rounded-full w-10 h-10 " />
        </div>
        <p className="font-poppins font-semibold">{univeristyName}</p>
      </div>
      <div className="w-full flex flex-col gap-5 ">
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

        <div className="relative w-full flex flex-col gap-4">
          <InputBox
            label=" University Email"
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
      <div className="w-full flex flex-col gap-4">
        <Button size="large" disabled={isPending} onClick={() => handleNext()} variant="shade" type="button">
          Skip University Verification
        </Button>

        <Button disabled={isPending} variant="primary" size="large">
          {isPending ? <Spinner /> : 'Confirm'}
        </Button>
        {isVerificationSuccess && <p className="text-xs text-green-500 text-center">University Email verified.</p>}
      </div>
    </div>
  )
}

export default UniversityVerificationForm
