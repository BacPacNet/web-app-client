import Card from '@/components/atoms/Card'
import SettingContainer from '@/components/organisms/SettingsSection/SettingsContainer'
import React from 'react'

const Settings = () => {
  return (
    <div className="py-4 h-[-webkit-fill-available]">
      <Card defaultPadding={false} className="rounded-2xl h-full w-full overflow-y-scroll noi">
        <SettingContainer />
      </Card>
    </div>
  )
}

export default Settings
