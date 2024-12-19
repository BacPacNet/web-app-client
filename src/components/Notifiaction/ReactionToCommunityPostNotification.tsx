import dummy from '@/assets/avatar.png'
import Image from 'next/image'

import { BsStars } from 'react-icons/bs'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUpdateIsRead } from '@/services/notification'
import { useRouter } from 'next/navigation'
import { notificationRoleAccess } from '../organisms/NotificationTabs/NotificationTab'

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

const ReactionToCommunityPostNotification = ({ data }: Props) => {
  const { mutate: updateIsSeen } = useUpdateIsRead(notificationRoleAccess.REACTED_TO_COMMUNITY_POST)
  const router = useRouter()
  const handleUpdateIsRead = (id: string) => {
    const dataToPush = {
      id: id,
    }
    if (data?.isRead) return router.push(`/post/${data.communityPostId}?isType=Community`)

    updateIsSeen(dataToPush)
  }

  return (
    <div
      onClick={() => handleUpdateIsRead(data?._id)}
      className={`flex flex-col gap-2  border-b-2 border-neutral-300 p-4 hover:bg-neutral-200  transition-all duration-200 cursor-pointer`}
    >
      <div className="flex justify-between ">
        <div className="flex gap-4 items-center  ">
          {/* <div className="relative w-48">
            {[1, 30, 60, 90, 120].map((item) => (
              <Image
                key={item}
                width={48}
                height={48}
                src={dummy.src}
                alt="dp"
                objectFit="cover"
                className={`absolute -top-6 z-50 w-12 h-12 rounded-full`}
                style={{ left: item === 1 ? '0px' : `${item}px` }}
              />
            ))}
            <div
              key="plus"
              className={`absolute -top-6 z-50 w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center`}
              style={{ left: `150px` }}
            >
              +4
            </div>
          </div> */}
          <Image width={48} height={48} src={data?.sender_id?.profileDp || dummy.src} alt="dp" objectFit="cover" className="w-12 h-12 rounded-full" />
          <BsStars size={24} color="#9685FF" />
        </div>
        <p>{dayjs(new Date(data?.createdAt).toString()).fromNow()}</p>
      </div>
      <p className="text-sm">
        {/* <span className="font-semibold "> John Morisson and 8 others </span>reacted to your post.{' '} */}
        <span className="font-semibold "> {data?.sender_id?.firstName + ' ' + data?.sender_id?.lastName}</span> reacted to your Community post.{' '}
      </p>
    </div>
  )
}

export default ReactionToCommunityPostNotification
