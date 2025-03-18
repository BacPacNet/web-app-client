'use client'
import InputBox from '@/components/atoms/Input/InputBox'
import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'

import Button from '@/components/atoms/Buttons'
import Title from '@/components/atoms/Title'
import SupportingText from '@/components/atoms/SupportingText'
import InputWarningText from '@/components/atoms/InputWarningText'

import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import DateSelect from '@/components/atoms/DateSelect/DateSelect'
import { GenderOptions, userType } from '@/types/RegisterForm'
import { Country } from 'country-state-city'
import { MdOutlineArrowBack } from 'react-icons/md'

const ProfileSetupForm = ({ handlePrev }: { handlePrev: () => void }) => {
  const {
    register,
    formState: { errors: ProfileFormErrors },
    control,
  } = useFormContext()

  return (
    <div className="w-full  flex flex-col gap-8 items-center ">
      <div className="text-center flex flex-col gap-4">
        <Title>Profile Setup</Title>
        <SupportingText>Enter your profile information for networking. You can add more profile information later!</SupportingText>
      </div>
      <div className="w-full flex flex-col gap-4 ">
        <div className="w-full flex flex-col">
          <InputBox
            label="First Name"
            type="text"
            placeholder="John"
            {...register('firstName', {
              required: 'Please enter your first name.',
              pattern: {
                value: /^[A-Za-z\s-]+$/,
                message: 'First name can only contain letters, spaces, and hyphens.',
              },
            })}
            err={!!ProfileFormErrors.firstName}
          />
          {ProfileFormErrors.firstName && <InputWarningText>{ProfileFormErrors.firstName.message?.toString()}</InputWarningText>}
        </div>

        <div className="w-full flex flex-col">
          <InputBox
            label="Last Name"
            placeholder="Doe"
            type="text"
            {...register('lastName', {
              required: 'Please enter your last name.',
              pattern: {
                value: /^[A-Za-z\s-]+$/,
                message: 'Last name can only contain letters, spaces, and hyphens.',
              },
            })}
            err={!!ProfileFormErrors.lastName}
          />
          {ProfileFormErrors.lastName && <InputWarningText>{ProfileFormErrors.lastName.message?.toString()}</InputWarningText>}
        </div>
        <div className="w-full flex flex-col">
          <Controller
            name="birthDate"
            control={control}
            rules={{
              required: 'Birth Date is required.',
              validate: (value) => {
                if (!value) return 'Birth Date is required.'
                const today = new Date()
                const birthDate = new Date(value)
                const age = today.getFullYear() - birthDate.getFullYear()
                const monthDiff = today.getMonth() - birthDate.getMonth()
                const dayDiff = today.getDate() - birthDate.getDate()
                const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

                return adjustedAge >= 14 || 'You must be at least 14 years old.'
              },
            }}
            render={({ field }) => (
              <DateSelect
                placeholder="MM/DD/YYYY"
                value={field.value}
                onChange={field.onChange}
                label="Birthday"
                err={!!ProfileFormErrors.birthDate}
              />
            )}
          />
          {ProfileFormErrors.birthDate && <InputWarningText>{ProfileFormErrors?.birthDate?.message?.toString()}</InputWarningText>}
        </div>

        <div className="w-full flex flex-col relative">
          <Controller
            name="userType"
            control={control}
            rules={{ required: 'User type is required.' }}
            render={({ field }) => (
              <SelectDropdown
                isStatus={true}
                options={userType}
                value={field.value}
                onChange={field.onChange}
                label="Status"
                icon={'single'}
                err={!!ProfileFormErrors.userType}
                placeholder="Select your current role."
              />
            )}
          />
          {ProfileFormErrors.userType && <InputWarningText>{ProfileFormErrors?.userType?.message?.toString()}</InputWarningText>}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Button variant="primary">Next Step</Button>
        <Button onClick={handlePrev} leftIcon={<MdOutlineArrowBack />} variant="shade">
          Review Account
        </Button>
      </div>

      <p className="text-[12px] text-neutral-600 text-center">You can add more profile information later in your profile settings!</p>
    </div>
  )
}
export default ProfileSetupForm
