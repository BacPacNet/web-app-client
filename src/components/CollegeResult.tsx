import './CollegeResult.css'

import Link from 'next/link'
import ImagePlaceholder from '@assets/unibuzz-orange.png'
import { UniversityInfo } from '@/types/University'
import { useEffect } from 'react'

const CollegeResult = ({ university }: { university: UniversityInfo }) => {
  return (
    <div className="">
      <Link
        href={{ pathname: `/university/${university?.pathUrl}`, query: { search: JSON.stringify(university) } }}
        className="py-2 px-4 flex items-center w-full justify-start"
      >
        <div className="no w-1/6 flex justify-center align-middle text-black">
          <img width={40} height={40} alt="logo" src={university?.logos?.[0] || ImagePlaceholder} />
        </div>
        <div className=" w-4/5  text-black">{university?.name}</div>
        {/*<div className="score w-1/6 flex justify-center align-middle text-black">{university?.score}</div>*/}
      </Link>
    </div>
  )
}

export default CollegeResult
