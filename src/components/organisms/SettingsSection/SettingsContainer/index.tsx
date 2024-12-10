'use client'

import React, { useState } from 'react'
import SettingAccount from '../SettingTabs/SettingAccount'
import ChangeUserNameModal from '../SettingModals/ChangeUserNameModal'
import ChangePasswordModal from '../SettingModals/ChangePasswordModal'
import UniversityVerificationModal from '../SettingModals/UniversityVerificationModal'
import ChangeEmailModal from '../SettingModals/ChangeEmailModal'
import DeActivateModal from '../SettingModals/DeActivateModal'
import Tabs from '@/components/molecules/Tabs'
import { openModal } from '@/components/molecules/Modal/ModalManager'

const SettingContainer = () => {
  const [modal, setModal] = useState<string | null>(null)

  const renderModals: any = () => {
    switch (modal) {
      case 'Username':
        return openModal(<ChangeUserNameModal />)
      case 'Password':
        return openModal(<ChangePasswordModal />)
      case 'University':
        return openModal(<UniversityVerificationModal />)
      case 'Email':
        return openModal(<ChangeEmailModal />)
      case 'Deactivate':
        return openModal(<DeActivateModal />)
    }
  }

  const tabs = [
    {
      label: 'Accounts',
      content: <SettingAccount setModal={setModal} />,
    },
    {
      label: `Privacy`,
      content: <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Privacy</div>,
    },
    {
      label: `Security`,
      content: <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Security</div>,
    },
    {
      label: `Preferences`,
      content: <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Preferences</div>,
    },
  ]
  return (
    <div className="bg-white mt-4 rounded-2xl drop-shadow-lg h-with-navbar-space">
      <Tabs tabs={tabs} className={'h-full overflow-y-scroll custom-scrollbar py-2 ps-10'} />
      {modal?.length && renderModals()}
    </div>
  )
}

export default SettingContainer
