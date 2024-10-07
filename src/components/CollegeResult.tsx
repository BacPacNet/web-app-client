import './CollegeResult.css'

import Link from 'next/link'
import ImagePlaceholder from '@assets/unibuzz-orange.png'

interface CollegeProps {
  university: {
    id: string
    name: string
    score: string
  }
}
const CollegeResult: React.FC<CollegeProps> = ({ university }: any) => {
  console.log(university, 'universityuniversity')
  return (
    <div className="">
      <Link href={{ pathname: '/college', query: { id: university?.id } }} className="py-2 px-4 flex items-center w-full justify-start">
        <div className="no w-1/6 flex justify-center align-middle text-black">
          <img width={40} height={40} alt="logo" src={university?.logos[0] || ImagePlaceholder} />
        </div>
        <div className=" w-4/5  text-black">{university?.name}</div>
        {/*<div className="score w-1/6 flex justify-center align-middle text-black">{university?.score}</div>*/}
      </Link>
    </div>
  )
}

export default CollegeResult
