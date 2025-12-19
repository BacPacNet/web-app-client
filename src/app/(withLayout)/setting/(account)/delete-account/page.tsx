import Card from '@/components/atoms/Card'
import DeleteAccountPage from '@/components/organisms/SettingsSection/SettingPages/DeleteAccountPage'

import React from 'react'

const DeleteAccountSettingPage = () => {
  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="p-6 rounded-lg h-max w-full overflow-y-scroll hideScrollbar">
        <DeleteAccountPage />
      </Card>
    </div>
  )
}

export default DeleteAccountSettingPage
