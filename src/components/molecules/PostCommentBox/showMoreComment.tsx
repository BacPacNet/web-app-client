import { FC } from 'react'
import { FaArrowDown } from 'react-icons/fa'
import Spinner from '@/components/atoms/spinner'

interface ShowMoreComponentProps {
  handleShowMore: () => void
  isFetching: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
}

const ShowMoreComponent: FC<ShowMoreComponentProps> = ({ handleShowMore, isFetching, isFetchingNextPage, hasNextPage }) => {
  if (!hasNextPage) return null
  return (
    <div className="text-neutral-500 flex items-center gap-2 my-2 hover:cursor-pointer" onClick={handleShowMore}>
      <p>show more comments</p>
      <FaArrowDown />
      {(isFetchingNextPage || isFetching) && <Spinner />}
    </div>
  )
}

export default ShowMoreComponent
