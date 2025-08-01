import React from 'react'
import { useUpdateIsSeenCommunityGroupNotification } from '@/services/notification'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type Props = {
  id: string
  senderName: string
  message: string
  createdAt: string
}

const UserFollowNotification = ({ id, senderName, message, createdAt }: Props) => {
  const { mutate: updateIsSeen } = useUpdateIsSeenCommunityGroupNotification()

  const handleIsSeenGroup = (id: string) => {
    const dataToPush = {
      id: id,
    }
    updateIsSeen(dataToPush)
  }
  return (
    <div key={id} className="bg-slate-50 p-2 border-b border-slate-300">
      <p className="text-xs">
        <span className="text-sm font-bold">{senderName}</span> {message}
      </p>
      <div className="flex gap-2  justify-between items-end">
        <p className="text-xs">{dayjs(new Date(createdAt).toString()).fromNow()}</p>
        <button onClick={() => handleIsSeenGroup(id)} className="bg-slate-200 py-2 px-3 font-bold">
          Seen
        </button>
      </div>
    </div>
  )
}

export default UserFollowNotification
