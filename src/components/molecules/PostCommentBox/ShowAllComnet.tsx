'use client'

import { FaArrowDown } from 'react-icons/fa'
import { useRouter, useSearchParams } from 'next/navigation'

const ShowAllComponent = ({ postID, setShowCommentSection }: any) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = () => {
    setShowCommentSection(postID)

    const params = new URLSearchParams(searchParams.toString())
    params.delete('commentId')

    const newUrl = `/post/${postID}${params.toString() ? `?${params}` : ''}`
    router.replace(newUrl)
  }

  return (
    <div className="text-neutral-500 flex items-center gap-2 mt-2 hover:cursor-pointer">
      <p onClick={handleClick}>show all comments</p>
      <FaArrowDown />
    </div>
  )
}

export default ShowAllComponent
