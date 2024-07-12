import './CollegeResult.css'

import Link from 'next/link'

interface CollegeProps {
  serialNo: number
  info: {
    id: string
    name: string
    pathUrl: string
    country: string
  }
}
const CollegeResult: React.FC<CollegeProps> = (props) => {
  return (
    <div className="college-result">
      {/* <Link href={{ pathname: '/college', query: { pathUrl: props?.info?.pathUrl } }} className="h-10 flex justify-center align-middle"> */}
      <Link href={{ pathname: `/discover/${props?.info?.pathUrl}` }} className="h-10 flex justify-center align-middle">
        <div className="no w-1/6 flex justify-center align-middle text-black">{props?.serialNo + 1}</div>
        <div className="name w-4/5 flex justify-center align-middle text-black">{props?.info?.name}</div>
        {/* <div className="score w-1/6 flex justify-center align-middle text-black">{props?.info?.score}</div> */}
        <div className="score w-1/6 flex justify-center align-middle text-black">{props?.info?.country}</div>
      </Link>
    </div>
  )
}

export default CollegeResult
