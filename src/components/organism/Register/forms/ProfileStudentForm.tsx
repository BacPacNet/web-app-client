'use client'
import React, { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'

import Button from '@/components/atoms/Buttons'
import Title from '@/components/atoms/Title'
import SupportingText from '@/components/atoms/SupportingText'
import InputWarningText from '@/components/atoms/InputWarningText'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import { currYear, degreeAndMajors } from '@/types/RegisterForm'
import { MdOutlineArrowBack } from 'react-icons/md'
import Switch from '@/components/atoms/Switch'

const ProfileStudentForm = ({ handlePrev }: { handlePrev: () => void }) => {
  const {
    formState: { errors: ProfileFormErrors },
    control,
    watch,
    setValue,
  } = useFormContext()

  type DegreeKeys = keyof typeof degreeAndMajors
  const currDegree: DegreeKeys = watch('year')
  const currMa: DegreeKeys = watch('major')
  const [currMajor, setCurrMajor] = useState<any>([])

  useEffect(() => {
    setCurrMajor(degreeAndMajors[currDegree] || [])
    if (!degreeAndMajors[currDegree]?.includes(currMa)) {
      setValue('major', '')
    }
  }, [currDegree, setValue])

  return (
    <div className="w-full  flex flex-col gap-8 items-center ">
      <div className="text-start flex flex-col gap-2 w-full">
        <Title>Student Setup</Title>
        <SupportingText>Enter your university information to finish your student profile setup. </SupportingText>
      </div>
      <div className="w-full flex flex-col gap-3 ">
        {/*<div
          className={`
          border-neutral-200
        flex justify-between items-center py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm  text-neutral-900 h-10 outline-none`}
        >
          {userType}
        </div>*/}
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
                }}
                label="University"
                placeholder="Select University Name"
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
        {/*<div className="w-full flex flex-col relative">
          <Controller
            name="year"
            control={control}
            rules={{ required: 'year is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={currYear}
                value={field.value}
                onChange={field.onChange}
                label="Year"
                placeholder="Select your current education year."
                icon={'single'}
                err={!!ProfileFormErrors.year}
              />
            )}
          />
          {ProfileFormErrors.year && <InputWarningText>{ProfileFormErrors?.year?.message?.toString()}</InputWarningText>}
        </div>*/}

        <div className="w-full flex flex-col relative">
          <Controller
            name="year"
            control={control}
            rules={{ required: 'Year is required.' }}
            render={({ field }) => (
              <SelectDropdown
                options={Object.keys(degreeAndMajors)}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select your current education year."
                icon={'single'}
                label="Year"
                search={true}
                err={!!ProfileFormErrors.year}
              />
            )}
          />
          {ProfileFormErrors.year && <InputWarningText>{ProfileFormErrors?.year?.message?.toString()}</InputWarningText>}
        </div>

        <div className="w-full flex flex-col relative">
          <Controller
            name="major"
            control={control}
            rules={{ required: 'Major is required.' }}
            disabled={!currDegree}
            render={({ field }) => (
              <SelectDropdown
                key={currMajor}
                options={currMajor}
                value={field.value}
                onChange={field.onChange}
                search={true}
                label="Major"
                placeholder="Select your current major"
                icon={'single'}
                err={!!ProfileFormErrors.major}
              />
            )}
          />
          {ProfileFormErrors.major && <InputWarningText>{ProfileFormErrors?.major?.message?.toString()}</InputWarningText>}
        </div>
        <p className="text-neutral-500 text-2xs">If your major is not listed, choose the one that is closest to your current major.</p>
      </div>
      {/*<div className="w-10/12 xl:w-9/12 flex flex-col gap-2">
        <Button variant="primary">Next Step</Button>
      </div>*/}
      <div className="w-full flex flex-col gap-2">
        <Button size="large" variant="primary">
          Next Step
        </Button>
        <Button size="large" onClick={handlePrev} leftIcon={<MdOutlineArrowBack />} variant="shade">
          Review Account
        </Button>
      </div>

      <p className="text-[12px] text-neutral-500 text-center">You can add more profile information later in your profile settings!</p>
    </div>
  )
}

export default ProfileStudentForm
