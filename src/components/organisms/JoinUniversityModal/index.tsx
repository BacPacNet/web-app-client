'use client'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import SettingsText from '@/components/atoms/SettingsText'
import React, { useState } from 'react'

const JoinUniversityModal = () => {
  const [universitiy, setUniversity] = useState('')
  return (
    <div className="flex flex-col items-center gap-8">
      <SettingsText className="text-md">Join a University</SettingsText>
      <div className="w-full">
        <SelectUniversityDropdown
          label="University Name"
          value={universitiy}
          onChange={(selectedUniversity: any) => {
            setUniversity(selectedUniversity.name)
          }}
          placeholder="Select University Name"
          icon={'single'}
          search={true}
          //err={!!errors.universityName}
        />
      </div>
    </div>
  )
}

export default JoinUniversityModal
