import Card from '@/components/atoms/Card'
import { BlockedUsersPage } from '@/components/organisms/SettingsSection/SettingPages/BlockedUsersPage'

import React from 'react'

const BlockedUsersSettingPage = () => {
  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="p-6 rounded-lg h-max w-full overflow-y-scroll hideScrollbar">
        <BlockedUsersPage />
      </Card>
    </div>
  )
}

export default BlockedUsersSettingPage
