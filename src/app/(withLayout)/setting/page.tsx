import Card from '@/components/atoms/Card'
import SettingContainer from '@/components/organisms/SettingsSection/SettingsContainer'
import React from 'react'

const Settings = () => {
  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="rounded-2xl h-full w-full overflow-y-scroll hideScrollbar">
        <SettingContainer />
      </Card>
    </div>
  )
}

export default Settings
