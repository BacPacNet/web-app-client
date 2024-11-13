'use client'
import React, { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'

import LoginButtons from '@/components/atoms/LoginButtons'
import Title from '@/components/atoms/Title'
import SupportingText from '@/components/atoms/SupportingText'
import InputWarningText from '@/components/atoms/InputWarningText'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import { currYear, degreeAndMajors } from '@/types/RegisterForm'

const ProfileStudentForm = () => {
  const {
    formState: { errors: ProfileFormErrors },
    control,
    watch,
    setValue,
  } = useFormContext()

  type DegreeKeys = keyof typeof degreeAndMajors
  const currDegree: DegreeKeys = watch('degree')
  const currMa: DegreeKeys = watch('major')
  const [currMajor, setCurrMajor] = useState<any>([])

  useEffect(() => {
    setCurrMajor(degreeAndMajors[currDegree] || [])
    if (!degreeAndMajors[currDegree]?.includes(currMa)) {
      setValue('major', '')
    }
  }, [currDegree, setValue])

  return (
    <div className="w-1/2 flex flex-col gap-8 items-center">
      <div className="text-center px-3">
        <Title>Profile Setup</Title>
        <SupportingText>Enter your profile information for networking</SupportingText>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2 ">
        <div className="w-full flex flex-col relative">
          <Controller
            name="universityName"
            control={control}
            rules={{ required: 'University Name is required!' }}
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
            name="year"
            control={control}
            rules={{ required: 'year is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={currYear}
                value={field.value}
                onChange={field.onChange}
                placeholder="year"
                icon={'single'}
                err={!!ProfileFormErrors.year}
              />
            )}
          />
          {ProfileFormErrors.year && <InputWarningText>{ProfileFormErrors?.year?.message?.toString()}</InputWarningText>}
        </div>

        <div className="w-full flex flex-col relative">
          <Controller
            name="degree"
            control={control}
            rules={{ required: 'degree is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={Object.keys(degreeAndMajors)}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a degree"
                icon={'single'}
                search={true}
                err={!!ProfileFormErrors.degree}
              />
            )}
          />
          {ProfileFormErrors.degree && <InputWarningText>{ProfileFormErrors?.degree?.message?.toString()}</InputWarningText>}
        </div>
        <div className="w-full flex flex-col relative">
          <Controller
            name="major"
            control={control}
            rules={{ required: 'major is required!' }}
            disabled={!currDegree}
            render={({ field }) => (
              <SelectDropdown
                key={currMajor}
                options={currMajor}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a major"
                icon={'single'}
                err={!!ProfileFormErrors.major}
              />
            )}
          />
          {ProfileFormErrors.major && <InputWarningText>{ProfileFormErrors?.major?.message?.toString()}</InputWarningText>}
        </div>
      </div>
      <div className="w-10/12 xl:wGender-9/12 flex flex-col gap-2">
        <LoginButtons variant="primary">Next Step</LoginButtons>
      </div>

      <p className="text-[12px] text-neutral-600 text-center">You can add more profile information later in your profile settings!</p>
    </div>
  )
}

export default ProfileStudentForm
