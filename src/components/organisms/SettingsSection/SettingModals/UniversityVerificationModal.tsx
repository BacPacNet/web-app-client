'use client'
import React from 'react'
import SettingModalWrapper from '../SettingModalWrapper'
import SettingsText from '@/components/atoms/SettingsText'
import SubText from '@/components/atoms/SubText'
import InputBox from '@/components/atoms/Input/InputBox'

import Button from '@/components/atoms/Buttons'
import { Controller, useForm } from 'react-hook-form'
import InputWarningText from '@/components/atoms/InputWarningText'

import OTPInput from '@/components/atoms/OTP-Input/OTP_Input'
import { useChangeUserPassword } from '@/services/edit-profile'
import { useHandleUniversityEmailVerificationGenerate } from '@/services/auth'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import { Spinner } from '@/components/spinner/Spinner'

type Props = {
  setModal: (value: string | null) => void
}

type FormDataType = {
  UniversityOtp: string
  universityEmail: string
  universityName: string
}

const UniversityVerificationModal = ({ setModal }: Props) => {
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
  const { mutate, error } = useChangeUserPassword()

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
    generateUniversityEmailOTP(data)
  }

  const onSubmit = async (data: FormDataType) => {
    mutate(data)
  }

  return (
    <SettingModalWrapper setModal={setModal}>
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
              rules={{ required: 'University Name is required!' }}
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
              <Button onClick={() => handleUniversityEmailSendCode()} type="button" variant="border_primary">
                Send Code
              </Button>
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
                  render={({ field }) => <OTPInput length={6} value={field.value || '000000'} onChange={(otp) => field.onChange(otp)} />}
                />
                {errors.UniversityOtp && <InputWarningText>{errors.UniversityOtp.message?.toString() || 'Please enter your OTP!'}</InputWarningText>}
                {/* <Button variant="border_primary">Confirm Code</Button> */}
              </div>
            ) : (
              ''
            )}
          </div>
          {otpData?.isAvailable ? (
            <Button type="submit" className=" w-11/12" size="small">
              Complete Verification
            </Button>
          ) : (
            ''
          )}
        </form>
        {error?.response?.data?.message ? <InputWarningText>{error?.response?.data?.message}</InputWarningText> : ''}
      </div>
    </SettingModalWrapper>
  )
}

export default UniversityVerificationModal
