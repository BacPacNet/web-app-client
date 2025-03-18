import './CollegeResult.css'

import Link from 'next/link'
import ImagePlaceholder from '@assets/unibuzz-orange.png'
import { UniversityInfo } from '@/types/University'
import { useRouter } from 'next/navigation'

const CollegeResult = ({ university }: { university: UniversityInfo }) => {
  const router = useRouter()
  return (
    <div className="">
      <div className="py-2 px-4 flex gap-5 items-center w-full justify-start">
        <div className="w-8 h-8 rounded-full  flex justify-center align-middle shadow-lg">
          <img
            className="object-contain rounded-full w-auto h-auto"
            width={32}
            height={32}
            alt=""
            src={university?.logo || (ImagePlaceholder as unknown as string)}
          />
        </div>
        <p className=" w-4/5 line-clamp-1 text-neutral-500">{university?.name}</p>
        {/*<div className="score w-1/6 flex justify-center align-middle text-black">{university?.score}</div>*/}
      </div>
    </div>
  )
}

export default CollegeResult
