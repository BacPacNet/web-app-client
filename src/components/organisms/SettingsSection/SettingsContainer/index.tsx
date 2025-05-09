'use client'

import type React from 'react'

import { useRouter } from 'next/navigation'
import { FaUser, FaLock, FaUserShield, FaPencilAlt, FaChevronRight } from 'react-icons/fa'

type SettingsItem = {
  href: string
  label: string
}

type SettingsSection = {
  title: string
  icon: React.ReactNode
  items: SettingsItem[]
}

export default function AccountSettingsPage() {
  const router = useRouter()

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      icon: <FaUser className="text-neutral-500 w-5 h-5" />,
      items: [
        { href: '/setting/university-verification', label: 'University Verification' },
        { href: '/setting/change-username', label: 'Change Username' },
        { href: '/setting/change-password', label: 'Change Password' },
        // { href: '/setting/change-email', label: 'Change Email' },
        { href: '/setting/deactivation', label: 'Account Deactivation' },
      ],
    },
    // {
    //   title: 'Privacy',
    //   icon: <FaLock className="text-[#6b7280]" />,
    //   items: [
    //     { href: '/privacy/profile-visibility', label: 'Profile Visibility' },
    //     { href: '/privacy/tagging-permissions', label: 'Tagging Permissions' },
    //   ],
    // },
    // {
    //   title: 'Security',
    //   icon: <FaUserShield className="text-[#6b7280]" />,
    //   items: [
    //     { href: '/security/two-factor-authentication', label: 'Two Factor Authentication' },
    //     { href: '/security/connected-devices', label: 'Connected Devices' },
    //   ],
    // },
    // {
    //   title: 'Preferences',
    //   icon: <FaPencilAlt className="text-[#6b7280]" />,
    //   items: [
    //     { href: '/preferences/language', label: 'Language' },
    //     { href: '/preferences/display-theme', label: 'Display/Theme' },
    //   ],
    // },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="max-w-2xl mx-auto p-4  rounded-2xl mb-4">
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="flex items-center gap-[10px] mb-4">
              {section.icon}
              <h6 className="text-[20px] font-bold text-neutral-700">{section.title}</h6>
            </div>

            <div className="space-y-0">
              {section.items.map((item, itemIndex) => (
                <SettingsLink key={itemIndex} href={item.href} label={item.label} onClick={() => handleNavigation(item.href)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SettingsLinkProps {
  href: string
  label: string
  onClick: () => void
}

function SettingsLink({ href, label, onClick }: SettingsLinkProps) {
  return (
    <div onClick={onClick} className="flex items-center justify-between py-4 border-b border-neutral-300 cursor-pointer">
      <span className="text-neutral-500 font-medium text-sm">{label}</span>
      <FaChevronRight className="text-neutral-500" />
    </div>
  )
}
