import Card from '@/components/atoms/Card'
import ChangeUserPasswordPage from '@/components/organisms/SettingsSection/SettingPages/ChangeUserPasswordPage'
import React from 'react'

const ChangeUserPasswordSettingPage = () => {
  return (
    <div className="py-0 h-[-webkit-fill-available]  mb-4">
      <Card defaultPadding={false} className="rounded-2xl h-max w-full overflow-y-scroll noi">
        <ChangeUserPasswordPage />
      </Card>
    </div>
  )
}

export default ChangeUserPasswordSettingPage
