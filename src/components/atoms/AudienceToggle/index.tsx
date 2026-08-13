'use client'

import { usePathname, useRouter } from 'next/navigation'
import { getAudienceFromPath, setStoredAudience, withAudience, type Audience } from '@/utils/audienceRoute'

const options: { label: string; value: Audience }[] = [
  { label: 'Faculty', value: 'faculty' },
  { label: 'Student', value: 'student' },
]

export default function AudienceToggle() {
  const pathname = usePathname()
  const router = useRouter()
  const activeAudience = getAudienceFromPath(pathname)

  const handleSelect = (audience: Audience) => {
    if (audience === activeAudience) return
    setStoredAudience(audience)
    router.push(withAudience(pathname, audience))
  }

  return (
    <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-100 p-1" role="group" aria-label="Select audience">
      {options.map(({ label, value }) => {
        const isActive = activeAudience === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleSelect(value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 ${
              isActive ? 'bg-primary-500 font-semibold text-white' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
