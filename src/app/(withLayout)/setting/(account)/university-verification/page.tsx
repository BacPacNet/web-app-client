import Card from '@/components/atoms/Card'
import UniversityVerificationPage from '@/components/organisms/SettingsSection/SettingPages/UniversityVerificationPage'
import React from 'react'

const UniversityVerificationSettingPage = () => {
  return (
    <div className="py-4 h-[-webkit-fill-available]">
      <Card defaultPadding={false} className="rounded-2xl h-max w-full overflow-y-scroll noi">
        <UniversityVerificationPage />
      </Card>
    </div>
  )
}

export default UniversityVerificationSettingPage
