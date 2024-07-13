import React from 'react'
import { useJoinCommunityGroup, useUpdateIsSeenCommunityGroupNotification } from '@/services/notification'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
type Props = {
  id: string
  senderName: string
  groupName: string
  message: string
  groupId: string
  createdAt: string
}

const InviteNotification = ({ id, groupId, senderName, groupName, message, createdAt }: Props) => {
  const { mutate: joinGroup } = useJoinCommunityGroup()
  const { mutate: updateIsSeen } = useUpdateIsSeenCommunityGroupNotification()

  const handleJoinGroup = (groupId: string, id: string) => {
    const dataToPush = {
      groupId: groupId,
      id: id,
    }
    joinGroup(dataToPush)
  }

  const handleIsSeenGroup = (id: string) => {
    const dataToPush = {
      id: id,
    }
    updateIsSeen(dataToPush)
  }

  return (
    <div key={id} className="bg-slate-50 p-2 border-b border-slate-300">
      <p className="text-xs">
        {message} <span className="text-sm font-bold">{groupName}</span> from <span className="text-sm font-bold">{senderName}</span>
      </p>
      <div className="flex gap-2 justify-between items-end">
        <p className="text-xs">{dayjs(new Date(createdAt).toString()).fromNow()}</p>
        <>
          <button onClick={() => handleIsSeenGroup(id)} className="bg-slate-200 py-2 px-3 font-bold">
            Deny
          </button>
          <button onClick={() => handleJoinGroup(groupId, id)} className="bg-blue-400 py-2 px-4 font-bold">
            Join
          </button>
        </>
      </div>
    </div>
  )
}

export default InviteNotification
