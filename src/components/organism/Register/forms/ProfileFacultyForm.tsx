'use client'
import React, { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'

import Button from '@/components/atoms/Buttons'
import Title from '@/components/atoms/Title'
import SupportingText from '@/components/atoms/SupportingText'
import InputWarningText from '@/components/atoms/InputWarningText'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import { occupationAndDepartment } from '@/types/RegisterForm'

const ProfileFacultyForm = () => {
  const {
    formState: { errors: ProfileFormErrors },
    control,
    watch,
    setValue,
  } = useFormContext()

  type occupationKeys = keyof typeof occupationAndDepartment
  const currOccupation: occupationKeys = watch('occupation')
  const currFormDepartment: occupationKeys = watch('department')

  const [currDepartment, setCurrDepartment] = useState<any>([])

  useEffect(() => {
    setCurrDepartment(occupationAndDepartment[currOccupation] || [])
    if (!occupationAndDepartment[currOccupation]?.includes(currFormDepartment)) {
      setValue('department', '')
    }
  }, [currOccupation, setValue])

  return (
    <div className="w-full sm:w-96 lg:w-1/2 flex flex-col gap-8 items-center ">
      <div className="text-center px-3">
        <Title>Faculty Setup</Title>
        <SupportingText>Enter your faculty information for networking</SupportingText>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2 ">
        <div className="w-full flex flex-col relative">
          <Controller
            name="universityName"
            control={control}
            rules={{ required: 'University name is required!' }}
            render={({ field }) => (
              <SelectUniversityDropdown
                value={field.value}
                onChange={(selectedUniversity: any) => {
                  field.onChange(selectedUniversity.name)
                  setValue('universityId', selectedUniversity._id)
                }}
                placeholder="Select University Name"
                icon={'single'}
                search={true}
                err={!!ProfileFormErrors.universityName}
              />
            )}
          />
          {ProfileFormErrors.universityName && <InputWarningText>{ProfileFormErrors?.universityName?.message?.toString()}</InputWarningText>}
        </div>

        <div className="w-full flex flex-col relative">
          <Controller
            name="occupation"
            control={control}
            rules={{ required: 'Occupation is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={Object.keys(occupationAndDepartment)}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a occupation"
                icon={'dual'}
                search={true}
                err={!!ProfileFormErrors.occupation}
              />
            )}
          />
          {ProfileFormErrors.occupation && <InputWarningText>{ProfileFormErrors?.occupation?.message?.toString()}</InputWarningText>}
        </div>
        <div className="w-full flex flex-col relative">
          <Controller
            name="department"
            control={control}
            rules={{ required: 'Department is required!' }}
            disabled={!currDepartment}
            render={({ field }) => (
              <SelectDropdown
                key={currDepartment}
                options={currDepartment}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a department"
                icon={'single'}
                err={!!ProfileFormErrors.department}
              />
            )}
          />
          {ProfileFormErrors.department && <InputWarningText>{ProfileFormErrors?.department?.message?.toString()}</InputWarningText>}
        </div>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2">
        <Button variant="primary">Next Step</Button>
      </div>

      <p className="text-[12px] text-neutral-600 text-center">You can add more profile information later in your profile settings!</p>
    </div>
  )
}

export default ProfileFacultyForm
