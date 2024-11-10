'use client'
import SettingsTopBar from '@/components/molecules/SettingsTopBar'
import React, { useState } from 'react'
import SettingAccount from '../SettingTabs/SettingAccount'
import ChangeUserNameModal from '../SettingModals/ChangeUserNameModal'
import ChangePasswordModal from '../SettingModals/ChangePasswordModal'
import UniversityVerificationModal from '../SettingModals/UniversityVerificationModal'
import ChangeEmailModal from '../SettingModals/ChangeEmailModal'
import DeActivateModal from '../SettingModals/DeActivateModal'

const SettingContainer = () => {
  const [currTab, setCurrTab] = useState('Accounts')
  const [modal, setModal] = useState<string | null>(null)
  const renderTab = () => {
    switch (currTab) {
      case 'Accounts':
        return <SettingAccount setModal={setModal} />
      case 'Privacy':
        return <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Privacy</div>
      case 'Security':
        return <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Security</div>
      case 'Preferences':
        return <div className="flex items-center justify-center h-full text-6xl font-bold text-neutral-400">Preferences</div>
    }
  }

  const renderModals = () => {
    switch (modal) {
      case 'Username':
        return <ChangeUserNameModal setModal={setModal} />
      case 'Password':
        return <ChangePasswordModal setModal={setModal} />
      case 'University':
        return <UniversityVerificationModal setModal={setModal} />
      case 'Email':
        return <ChangeEmailModal setModal={setModal} />
      case 'Deactivate':
        return <DeActivateModal setModal={setModal} />
    }
  }
  return (
    <div className="bg-white mt-4 rounded-2xl drop-shadow-lg h-with-navbar-space">
      <SettingsTopBar currTab={currTab} setCurrTab={setCurrTab} />
      <div className={` h-[90%] overflow-y-scroll custom-scrollbar `}>{renderTab()}</div>
      {modal?.length && (
        <div className="fixed w-full h-full  top-0 flex justify-center items-center">
          <div onClick={() => setModal(null)} className="bg-secondary opacity-70 w-full h-full fixed -z-10 rounded-2xl"></div>
          {renderModals()}
        </div>
      )}
    </div>
  )
}

export default SettingContainer
