'use client'
import InputBox from '@/components/atoms/Input/InputBox'
import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'

import Button from '@/components/atoms/Buttons'
import Title from '@/components/atoms/Title'
import SupportingText from '@/components/atoms/SupportingText'
import InputWarningText from '@/components/atoms/InputWarningText'

import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { country_list } from '@/utils/countriesList'
import DateSelect from '@/components/atoms/DateSelect/DateSelect'
import { GenderOptions, userType } from '@/types/RegisterForm'

const ProfileSetupForm = () => {
  const {
    register,
    formState: { errors: ProfileFormErrors },
    control,
  } = useFormContext()

  return (
    <div className="w-1/2 flex flex-col gap-8 items-center">
      <div className="text-center px-3">
        <Title>Profile Setup</Title>
        <SupportingText>Enter your profile information for networking</SupportingText>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2 ">
        <div className="w-full flex flex-col">
          <InputBox
            placeholder="First Name"
            type="text"
            {...register('firstName', {
              required: true,
            })}
            err={!!ProfileFormErrors.firstName}
          />
          {ProfileFormErrors.firstName && <InputWarningText>Please enter your First Name!</InputWarningText>}
        </div>
        <div className="w-full flex flex-col">
          <InputBox
            placeholder="Last Name"
            type="text"
            {...register('lastName', {
              required: true,
            })}
            err={!!ProfileFormErrors.lastName}
          />
          {ProfileFormErrors.lastName && <InputWarningText>Please enter your Last Name!</InputWarningText>}
        </div>
        <div className="w-full flex flex-col">
          <Controller
            name="birthDate"
            control={control}
            rules={{ required: 'birthDate is required!' }}
            render={({ field }) => (
              <DateSelect value={field.value} onChange={field.onChange} placeholder="Birthday" err={!!ProfileFormErrors.birthDate} />
            )}
          />
          {ProfileFormErrors.birthDate && <InputWarningText>Please enter your Birthday!</InputWarningText>}
        </div>
        <div className="w-full flex flex-col relative">
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Gender is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={GenderOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a Gender"
                icon={'single'}
                err={!!ProfileFormErrors.gender}
              />
            )}
          />
          {ProfileFormErrors.gender && <InputWarningText>{ProfileFormErrors?.gender?.message?.toString()}</InputWarningText>}
        </div>

        <div className="w-full flex flex-col relative">
          <Controller
            name="country"
            control={control}
            rules={{ required: 'country is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={country_list}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a country"
                icon={'dual'}
                search={true}
                err={!!ProfileFormErrors.country}
              />
            )}
          />
          {ProfileFormErrors.country && <InputWarningText>{ProfileFormErrors?.country?.message?.toString()}</InputWarningText>}
        </div>

        <div className="w-full flex flex-col relative">
          <Controller
            name="userType"
            control={control}
            rules={{ required: 'userType is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={userType}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a Type"
                icon={'single'}
                err={!!ProfileFormErrors.userType}
              />
            )}
          />
          {ProfileFormErrors.userType && <InputWarningText>{ProfileFormErrors?.userType?.message?.toString()}</InputWarningText>}
        </div>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2">
        <Button variant="primary">Next Step</Button>
      </div>

      <p className="text-[12px] text-neutral-600 text-center">You can add more profile information later in your profile settings!</p>
    </div>
  )
}
export default ProfileSetupForm
