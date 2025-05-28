import Card from '@/components/atoms/Card'
import AccountDeactivationPage from '@/components/organisms/SettingsSection/SettingPages/AccountDeactivationPage'

import React from 'react'

const AccountDeactivationSettingPage = () => {
  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="p-6 rounded-2xl h-max w-full overflow-y-scroll noi">
        <AccountDeactivationPage />
      </Card>
    </div>
  )
}

export default AccountDeactivationSettingPage
