import React from 'react'
import dummy from '@/assets/avatar.png'
import Image from 'next/image'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUpdateIsRead } from '@/services/notification'
import { useRouter } from 'next/navigation'
import { notificationRoleAccess } from '../organisms/NotificationTabs/NotificationTab'
import { IoIosChatboxes } from 'react-icons/io'
dayjs.extend(relativeTime)

interface Props {
  data: {
    _id: string
    createdAt: string
    isRead: boolean
    message: string
    receiverId: string
    userPostId?: string
    sender_id: {
      _id: string
      firstName: string
      lastName: string
      profileDp?: string
    }
    communityGroupId?: {
      _id: string
      title: string
      communityId: string
      communityGroupLogoUrl: string
    }
    communityDetails?: {
      name: string
    }
    communityPostId?: {
      _id?: string
    }
    type: string
  }
}

const UserPostCommentNotification = ({ data }: Props) => {
  const { mutate: updateIsSeen } = useUpdateIsRead(notificationRoleAccess.COMMENT)
  const router = useRouter()
  const handleUpdateIsRead = (id: string) => {
    const dataToPush = {
      id: id,
    }
    if (data?.isRead) return router.push(`/post/${data.userPostId}?isType=Timeline`)

    updateIsSeen(dataToPush)
  }

  return (
    <div
      onClick={() => handleUpdateIsRead(data?._id)}
      className={`flex flex-col gap-2  border-b-2 border-neutral-300 pb-5 me-10 hover:bg-neutral-200 hover:p-5 transition-all duration-200 cursor-pointer`}
    >
      <div className="flex justify-between ">
        <div className="flex gap-4 items-center  ">
          <Image width={48} height={48} src={data?.sender_id?.profileDp || dummy.src} alt="dp" objectFit="cover" className="w-12 h-12 rounded-full" />

          <IoIosChatboxes size={24} color="#9685FF" />
        </div>
        <p>{dayjs(new Date(data?.createdAt).toString()).fromNow()}</p>
      </div>
      <p className="text-sm">
        <span className="font-semibold "> {data?.sender_id?.firstName + ' ' + data?.sender_id?.lastName} </span> Commented on your post.{' '}
      </p>
    </div>
  )
}

export default UserPostCommentNotification
