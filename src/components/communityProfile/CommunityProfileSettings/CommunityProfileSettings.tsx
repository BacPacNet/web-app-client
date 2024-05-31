import React, { useState } from 'react'
import Option from './Option'
import { SettingOptionType } from './optionEnum'
import CommunityProfileNotification from './CommunityProfileNotification'
import CommunityProfileAccount from './CommunityProfileAccount'
import CommunityProfileBillings from './CommunityProfileBillings'
import CommunityProfileSecurity from './CommunityProfileSecurity'
import CommunityProfileAccesibility from './CommunityProfileAccesibility'

const CommunityProfileSettings = () => {
  const [selectedOption, setSelectedOption] = useState(SettingOptionType.Account)
  return (
    <>
      <Option selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      {selectedOption == SettingOptionType.Notifications ? (
        <CommunityProfileNotification />
      ) : selectedOption == SettingOptionType.Account ? (
        <CommunityProfileAccount />
      ) : selectedOption == SettingOptionType.Billings ? (
        <CommunityProfileBillings />
      ) : selectedOption == SettingOptionType.Security ? (
        <CommunityProfileSecurity />
      ) : (
        <CommunityProfileAccesibility />
      )}
    </>
  )
}

export default CommunityProfileSettings
