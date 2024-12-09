'use client'
import React, { useEffect, useState } from 'react'
import SettingModalWrapper from '../SettingModalWrapper'
import SettingsText from '@/components/atoms/SettingsText'
import SubText from '@/components/atoms/SubText'
import InputBox from '@/components/atoms/Input/InputBox'

import Button from '@/components/atoms/Buttons'
import { Controller, useForm } from 'react-hook-form'
import InputWarningText from '@/components/atoms/InputWarningText'

import { OTPInput } from 'input-otp'
import { Slot } from '@/components/atoms/OTP-Input/OTP_SlotAndCarrot'
import { useAddUniversityEmail } from '@/services/edit-profile'
import { useHandleUniversityEmailVerificationGenerate } from '@/services/auth'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import { Spinner } from '@/components/spinner/Spinner'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

type FormDataType = {
  UniversityOtp: string
  universityEmail: string
  universityName: string
}

const UniversityVerificationModal = () => {
  const [countdown, setCountdown] = useState(30)
  const [isCounting, setIsCounting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    clearErrors,
    getValues,
  } = useForm<FormDataType>({})
  const { mutate: generateUniversityEmailOTP, data: otpData, isPending } = useHandleUniversityEmailVerificationGenerate()
  const { mutate, error, isPending: isPendingChangeApi, isSuccess } = useAddUniversityEmail()

  const handleUniversityEmailSendCode = () => {
    const email = getValues('universityEmail')
    if (!email) {
      setError('universityEmail', { type: 'manual', message: 'Please enter your email!' })
      return
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i
    if (!emailRegex.test(email)) {
      setError('universityEmail', { type: 'manual', message: 'Invalid email format' })
      return
    }

    clearErrors('universityEmail')
    const data = { email }
    handleUniversityEmailSendCodeCount()
    generateUniversityEmailOTP(data)
  }

  const onSubmit = async (data: FormDataType) => {
    mutate(data)
  }
  const handleUniversityEmailSendCodeCount = () => {
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
      showCustomSuccessToast('University email added successfully!')
    }
  }, [isSuccess])

  return (
    <div className="flex flex-col items-center gap-8">
      <div>
        <SettingsText className="text-md text-center">University Verification</SettingsText>
        <SubText className="text-center">Do you have a email provided by your university?</SubText>
      </div>
      <form className="w-full flex flex-col items-center gap-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col  w-11/12 gap-4">
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
                onChange={(selectedUniversity: any) => {
                  field.onChange(selectedUniversity.name)
                }}
                placeholder="Select University Name"
                icon={'single'}
                search={true}
                err={!!errors.universityName}
              />
            )}
          />
          {errors.universityName && <InputWarningText>{errors?.universityName?.message?.toString()}</InputWarningText>}
        </div>

        <div className="flex flex-col  w-11/12 gap-4">
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
              err={!!errors.universityEmail}
            />
            {errors.universityEmail && (
              <InputWarningText>
                {errors.universityEmail.message ? errors.universityEmail.message.toString() : 'Please enter your email!'}
              </InputWarningText>
            )}
            <Button disabled={isCounting} onClick={() => handleUniversityEmailSendCode()} type="button" variant="border_primary">
              Send Code
            </Button>
            {isCounting && <p className="text-xs text-neutral-500 text-center">Resend Available after {countdown}s</p>}
          </div>

          {isPending && (
            <div className="w-full flex justify-center">
              <Spinner />
            </div>
          )}
          {/* otp  */}
          {otpData?.isAvailable ? (
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
              {errors.UniversityOtp && <InputWarningText>{errors.UniversityOtp.message?.toString() || 'Please enter your otp!'}</InputWarningText>}
              {/* <Button variant="border_primary">Confirm Code</Button> */}
            </div>
          ) : (
            ''
          )}
        </div>
        {otpData?.isAvailable ? (
          <Button disabled={isPendingChangeApi} type="submit" className=" w-11/12" size="small">
            {isPendingChangeApi ? <Spinner /> : 'Complete Verification'}
          </Button>
        ) : (
          ''
        )}
      </form>
      {error?.response?.data?.message ? <InputWarningText>{error?.response?.data?.message}</InputWarningText> : ''}
    </div>
  )
}

export default UniversityVerificationModal
