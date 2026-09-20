import React from 'react'
import { IconType } from 'react-icons/lib'

export interface UniversityInfoCardProps {
  icon: IconType
  title: string
  info?: string | string[] | number | null
}

const infoClassName = 'text-neutral-700 text-[18px] leading-snug break-words [overflow-wrap:anywhere] w-full min-w-0 text-left'

function toDisplayInfo(info: UniversityInfoCardProps['info']): string {
  if (Array.isArray(info)) {
    return info.find((item) => typeof item === 'string' && item.length > 0) ?? ''
  }
  if (info === null || info === undefined) return ''
  return String(info)
}

const UniversityInfoCard: React.FC<UniversityInfoCardProps> = ({ icon: Icon, title, info }) => {
  const displayInfo = toDisplayInfo(info)

  return (
    <div className="flex flex-col items-start gap-2 w-full min-w-0 overflow-hidden rounded-lg">
      <p className="text-primary-700 text-[20px] flex gap-1 items-center font-semibold font-poppins">
        <Icon size={20} className="shrink-0" />
        {title}
      </p>
      {title === 'Link' && displayInfo ? (
        <a className={`${infoClassName} underline text-primary-500`} href={displayInfo} target="_blank" rel="noopener noreferrer">
          {displayInfo}
        </a>
      ) : title === 'Email' && displayInfo ? (
        <a className={infoClassName} href={`mailto:${displayInfo}`}>
          {displayInfo}
        </a>
      ) : title === 'Phone' && displayInfo ? (
        <a className={infoClassName} href={`tel:${displayInfo}`}>
          {displayInfo}
        </a>
      ) : (
        <p className={`${infoClassName} line-clamp-4`}>{displayInfo || 'Not available'}</p>
      )}
    </div>
  )
}

export default UniversityInfoCard
