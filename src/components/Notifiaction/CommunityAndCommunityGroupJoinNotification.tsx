import React from 'react'
import dummy from '@/assets/avatar.png'
import Image from 'next/image'
import { FaUsers } from 'react-icons/fa'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useJoinCommunityGroup, useUpdateIsRead } from '@/services/notification'
import { useRouter } from 'next/navigation'
import Buttons from '../atoms/Buttons'
dayjs.extend(relativeTime)

interface Props {
  data: {
    _id: string
    createdAt: string
    isRead: boolean
    message: string
    receiverId: string
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

const CommunityAndCommunityGroupJoinNotification = ({ data }: Props) => {
  const { mutate: joinGroup } = useJoinCommunityGroup()
  const { mutate: updateIsSeen } = useUpdateIsRead()
  const router = useRouter()
  const handleJoinGroup = (groupId: string = '', id: string) => {
    if (!groupId || !id) return

    const dataToPush = {
      groupId: groupId,
      id: id,
    }
    joinGroup(dataToPush)
  }

  const handleReject = (id: string) => {
    const dataToPush = {
      id: id,
    }
    updateIsSeen(dataToPush)
  }

  return (
    <div className={`flex flex-col gap-2  border-b-2 border-neutral-300 pb-5 me-10 hover:bg-neutral-200 hover:p-5 transition-all duration-200 `}>
      <div className="flex justify-between ">
        <div className="flex gap-4 items-center  ">
          <Image
            width={48}
            height={48}
            src={data?.communityGroupId?.communityGroupLogoUrl || dummy.src}
            alt="dp"
            objectFit="cover"
            className="w-12 h-12 rounded-full"
          />

          <FaUsers size={24} color="#9685FF" />
        </div>
        <p>{dayjs(new Date(data?.createdAt).toString()).fromNow()}</p>
      </div>
      <div className="w-full flex justify-between items-center">
        <p className="text-sm">
          You have been invited to join{' '}
          <span
            onClick={() => router.push(`/community/${data.communityGroupId?.communityId}/${data.communityGroupId?._id}`)}
            className="font-semibold hover:underline cursor-pointer"
          >
            {data?.communityDetails?.name}’s {data?.communityGroupId?.title}.{' '}
          </span>
        </p>
        <div className="flex gap-2 items-center">
          <Buttons onClick={() => handleJoinGroup(data?.communityGroupId?._id, data._id)} size="extra_small">
            Accept
          </Buttons>
          <Buttons disabled={data?.isRead} onClick={() => handleReject(data._id)} size="extra_small">
            Reject
          </Buttons>
        </div>
      </div>
    </div>
  )
}

export default CommunityAndCommunityGroupJoinNotification
