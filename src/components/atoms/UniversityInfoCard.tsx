import React from 'react'
import { IconType } from 'react-icons/lib'

export interface UniversityInfoCardProps {
  icon: IconType
  title: string
  info: string
}

const UniversityInfoCard: React.FC<UniversityInfoCardProps> = ({ icon: Icon, title, info }) => (
  <div>
    <p className="text-primary-700 text-[20px] flex gap-1 items-center font-semibold font-poppins">
      <Icon size={20} />
      {title}
    </p>
    {title === 'Link' && info?.length ? (
      <a className="underline text-primary-500" href={info} target="_blank" rel="noopener noreferrer">
        {info}
      </a>
    ) : title === 'Email' && info?.length ? (
      <a href={`mailto:${info}`}>{info}</a>
    ) : title === 'Phone' && info?.length ? (
      <a href={`tel:${info}`}>{info}</a>
    ) : (
      <p className="text-neutral-700 text-[18px] line-clamp-6">{info || 'Not available'}</p>
    )}
  </div>
)

export default UniversityInfoCard
