import Link from 'next/link'

interface CollegeProps {
  serialNo: number
  info: {
    id: string
    name: string
    score: string
  }
}

const CollegeResult: React.FC<CollegeProps> = (props) => {
  return (
    <div className="mb-3.5">
      <Link href={{ pathname: '/college', query: { id: props.info.id } }} className="border-3 border-black flex justify-center align-middle">
        <div className="no w-1/6 flex justify-center align-middle text-black">{props.serialNo + 1}</div>
        <div className="name w-4/5 flex justify-center align-middle text-black">{props.info.name}</div>
        <div className="score w-1/6 flex justify-center align-middle text-black">{props.info.score}</div>
      </Link>
    </div>
  )
}

export default CollegeResult
