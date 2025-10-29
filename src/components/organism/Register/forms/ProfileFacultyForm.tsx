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
import { MdOutlineArrowBack } from 'react-icons/md'
import Switch from '@/components/atoms/Switch'

const ProfileFacultyForm = ({ handlePrev }: { handlePrev: () => void }) => {
  const {
    formState: { errors: ProfileFormErrors },
    control,
    watch,
    setValue,
    getValues,
  } = useFormContext()

  type occupationKeys = keyof typeof occupationAndDepartment
  const currOccupation: occupationKeys = watch('occupation')
  const currFormDepartment: occupationKeys = watch('department')
  const userType = getValues('userType')
  const [currDepartment, setCurrDepartment] = useState<any>([])

  useEffect(() => {
    setCurrDepartment(occupationAndDepartment[currOccupation] || [])
    if (!occupationAndDepartment[currOccupation]?.includes(currFormDepartment)) {
      setValue('department', '')
    }
  }, [currOccupation, setValue])

  return (
    <div className="w-full  flex flex-col gap-8 items-center ">
      <div className="text-start flex flex-col gap-2 w-full">
        <Title>Faculty Setup</Title>
        <SupportingText>Enter your faculty information for networking</SupportingText>
      </div>
      <div className="w-full flex flex-col gap-4 ">
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
                  setValue('universityLogo', selectedUniversity.logo)
                  setValue('universityDomain', selectedUniversity.domains)
                }}
                placeholder="Select University Name"
                label="University"
                icon={'single'}
                search={true}
                err={!!ProfileFormErrors.universityName}
              />
            )}
          />
          {ProfileFormErrors.universityName && <InputWarningText>{ProfileFormErrors?.universityName?.message?.toString()}</InputWarningText>}
          <div className="flex w-full gap-2 mt-2">
            <p className="text-[12px] text-neutral-500 text-start">Join the university community after signing up</p>
            <div className=" flex flex-col relative">
              <Controller
                name={'isJoinUniversity'}
                control={control}
                // rules={{ required: 'This field is required.' }}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col relative">
          <Controller
            name="occupation"
            control={control}
            rules={{ required: 'Occupation is required.' }}
            render={({ field }) => (
              <SelectDropdown
                options={Object.keys(occupationAndDepartment)}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a occupation"
                label="Occupation"
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
            rules={{ required: 'Department is required.' }}
            disabled={!currDepartment}
            render={({ field }) => (
              <SelectDropdown
                key={currDepartment}
                options={currDepartment}
                value={field.value}
                search={true}
                onChange={field.onChange}
                label="Affiliation/Department"
                placeholder="Select a department"
                icon={'single'}
                err={!!ProfileFormErrors.department}
              />
            )}
          />
          {ProfileFormErrors.department && <InputWarningText>{ProfileFormErrors?.department?.message?.toString()}</InputWarningText>}
          <p className="text-neutral-500 text-xs mt-2">
            If your affiliation/department is not listed, choose the one that is closest to your current major.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Button variant="primary" size="large">
          Next Step
        </Button>
        <Button size="large" onClick={handlePrev} leftIcon={<MdOutlineArrowBack />} variant="shade">
          Review Account
        </Button>
      </div>

      <p className="text-[12px] text-neutral-600 text-center">You can add more profile information later in your profile settings!</p>
    </div>
  )
}

export default ProfileFacultyForm
