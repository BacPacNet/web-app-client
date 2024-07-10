import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  UniversityName: string
  UniversityAddress: any
  UniversityLink?: string
  universityLogo: string
}

const UniversityCommunityCart = ({ UniversityName, UniversityAddress, UniversityLink, universityLogo }: Props) => {
  const router = useRouter()
  const address = UniversityAddress?.wikiInfoBox?.Address
    ? UniversityAddress?.wikiInfoBox?.Address
    : UniversityAddress?.wikiInfoBox?.Location
    ? UniversityAddress?.wikiInfoBox?.Location
    : UniversityAddress?.collegeBoardInfo?.Location
    ? UniversityAddress?.collegeBoardInfo?.Location
    : 'Not Available'

  const handleClick = () => {
    if (UniversityLink) {
      router.push(`/community/${UniversityLink}`)
    }
  }
  return (
    <div className="flex flex-col gap-4 items-center w-1/4 max-sm:w-80 h-80 justify-between">
      <img className="w-40 h-40 bg-white shadow-lg rounded-full p-4" src={universityLogo} alt="" />
      <h3 className="text-sm font-semibold text-center">{UniversityName}</h3>
      <p className="text-xs text-neutral-500 max-w-[90%] text-center">{address}</p>
      <button onClick={() => handleClick()} className="text-primary bg-primary-50 px-4 py-2 rounded-lg">
        University Page
      </button>
    </div>
  )
}

export default UniversityCommunityCart
