import Card from '@/components/atoms/Card'
import ChangeUserNamePage from '@/components/organisms/SettingsSection/SettingPages/ChangeUserNamePage'

import React from 'react'

const ChangeUsernameSettingPage = () => {
  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="rounded-lg h-max w-full p-6 overflow-y-scroll hideScrollbar">
        <ChangeUserNamePage />
      </Card>
    </div>
  )
}

export default ChangeUsernameSettingPage
