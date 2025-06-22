import Card from '@/components/atoms/Card'
import ChangeUserPasswordPage from '@/components/organisms/SettingsSection/SettingPages/ChangeUserPasswordPage'
import React from 'react'

const ChangeUserPasswordSettingPage = () => {
  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="p-6 rounded-2xl h-max w-full overflow-y-scroll hideScrollbar">
        <ChangeUserPasswordPage />
      </Card>
    </div>
  )
}

export default ChangeUserPasswordSettingPage
