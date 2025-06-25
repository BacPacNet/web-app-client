import Card from '@/components/atoms/Card'
import UniversityVerificationPage from '@/components/organisms/SettingsSection/SettingPages/UniversityVerificationPage'
import React from 'react'

const UniversityVerificationSettingPage = () => {
  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="rounded-2xl h-full w-full overflow-y-scroll hideScrollbar p-6">
        <UniversityVerificationPage />
      </Card>
    </div>
  )
}

export default UniversityVerificationSettingPage
