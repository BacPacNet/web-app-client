import Card from '@/components/atoms/Card'
import { ReferralsPage } from '@/components/organisms/SettingsSection/SettingPages/ReferralsPage'

import React from 'react'

const ReferralsSettingPage = () => {
  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="p-6 rounded-lg h-max w-full overflow-y-scroll hideScrollbar">
        <ReferralsPage />
      </Card>
    </div>
  )
}

export default ReferralsSettingPage
