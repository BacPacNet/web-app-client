import Card from '@/components/atoms/Card'
import ChangeUserNamePage from '@/components/organisms/SettingsSection/SettingPages/ChangeUserNamePage'

import React from 'react'

const ChangeUsernameSettingPage = () => {
  return (
    <div className="py-4 h-[-webkit-fill-available]">
      <Card defaultPadding={false} className="rounded-2xl h-max w-full overflow-y-scroll noi">
        <ChangeUserNamePage />
      </Card>
    </div>
  )
}

export default ChangeUsernameSettingPage
