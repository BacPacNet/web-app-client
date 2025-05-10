import Card from '@/components/atoms/Card'
import AccountDeactivationPage from '@/components/organisms/SettingsSection/SettingPages/AccountDeactivationPage'

import React from 'react'

const AccountDeactivationSettingPage = () => {
  return (
    <div className="py-0 h-[-webkit-fill-available]  mb-4">
      <Card defaultPadding={false} className="rounded-2xl h-max w-full overflow-y-scroll noi">
        <AccountDeactivationPage />
      </Card>
    </div>
  )
}

export default AccountDeactivationSettingPage
