'use client'

import Button from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import Title from '@/components/atoms/Title'
import Spinner from '@/components/atoms/spinner'
import { useGetPartnerUniversities } from '@/services/universitySearch'
import { UniversityInfo } from '@/types/University'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import Link from 'next/link'
const SelectUniversitiesForm = () => {
  const { data: universities, isLoading } = useGetPartnerUniversities()
  const { setValue, watch, getValues } = useFormContext()
  const selectedUniversityIds: string[] = watch('selectedUniversityIds') || []

  const toggleUniversity = (universityId: string) => {
    const current: string[] = getValues('selectedUniversityIds') || []
    const updated = current.includes(universityId) ? current.filter((id) => id !== universityId) : [...current, universityId]
    setValue('selectedUniversityIds', updated, { shouldValidate: true })
  }

  const selectedCount = selectedUniversityIds.length

  return (
    <div className="w-full flex flex-col gap-8 items-center ">
      <div className="text-start flex flex-col gap-2 w-full">
        <Title>Select Universities</Title>
        <SupportingText>Select all universities you would like to join and explore as an applicant.</SupportingText>
      </div>

      <div className="w-full border border-neutral-200  bg-[#F9FAFB] rounded-lg max-h-[280px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : universities?.length ? (
          universities.map((university: UniversityInfo) => (
            <UniversityListItem
              key={university._id}
              university={university}
              isSelected={selectedUniversityIds.includes(university._id)}
              onToggle={() => toggleUniversity(university._id)}
            />
          ))
        ) : (
          <p className="text-sm text-neutral-500 text-center py-8">No partner universities available.</p>
        )}
      </div>

      <div className="w-full flex flex-col gap-4">
        <Button disabled={selectedCount === 0} variant="primary" size="large">
          {`Add ${selectedCount} ${selectedCount === 1 ? 'University' : 'Universities'}`}
        </Button>

        <p className="text-sm text-primary-500 text-center h-[48px] flex items-center justify-center">
          <Link href="/login">Already have an account? Login</Link>
        </p>
      </div>
    </div>
  )
}

type UniversityListItemProps = {
  university: UniversityInfo
  isSelected: boolean
  onToggle: () => void
}

const UniversityListItem = ({ university, isSelected, onToggle }: UniversityListItemProps) => {
  const [logoSrc, setLogoSrc] = useState(university.logo || universityLogoPlaceholder)

  return (
    <label className=" flex items-center gap-3 px-4 py-3 cursor-pointer ">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="w-[18px] h-[18px] shrink-0 appearance-none rounded border-2 border-neutral-200 cursor-pointer
          checked:bg-primary checked:border-primary
          relative after:content-[''] after:absolute after:w-[5px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-white
          after:rotate-45 after:top-[1px] after:left-[5px] checked:after:block after:hidden"
      />
      <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-card bg-white shrink-0 overflow-hidden">
        <img
          alt={`${university.name} logo`}
          width={36}
          height={36}
          src={logoSrc}
          className="w-full h-full min-w-0 object-contain rounded-full p-1"
          onError={() => setLogoSrc(universityLogoPlaceholder)}
        />
      </div>
      <span className="text-sm text-neutral-600 font-inter">{university.name}</span>
    </label>
  )
}

export default SelectUniversitiesForm
