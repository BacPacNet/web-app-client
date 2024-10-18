import './SearchHistoryBox.css'

import Link from 'next/link'
import { MdAccessTime } from 'react-icons/md'
import { UniversityInfo } from '@/types/University'

interface SearchHistoryProps {
  serialNo: number
  info: UniversityInfo
}
const SearchHistoryBox: React.FC<SearchHistoryProps> = (props) => {
  console.log(props)
  return (
    <div className="history-box">
      <Link href={{ pathname: '/college', query: { id: props.info._id } }} className="history-link flex items-center">
        <div className="history-icon">
          <MdAccessTime className="history-icon " />
        </div>
        <div className="name w-4/5 flex justify-center align-middle ">{props.info.name}</div>
        {/* <div className="score w-1/6 flex justify-center align-middle text-black">{props.info.score}</div> */}
      </Link>
    </div>
  )
}

export default SearchHistoryBox
