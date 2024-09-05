'use client'
import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useReactMessageEmoji } from '@/services/Messages'

dayjs.extend(relativeTime)

type Props = {
  profilePic: string | undefined
  name: string
  content: string
  date: string
  myMessage: boolean
  id: string
  reactions: {
    userId: string
    emoji: string
  }[]
  chatId: string
  media: { imageUrl: string; publicId: string }[]
}

const emojis = ['👍', '🧡', '😆', '😂', '😇']

const UserMessage = ({ profilePic, name, content, date, myMessage, id, reactions, chatId, media }: Props) => {
  const [isReact, setIsReact] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const { mutate: reactToMessage } = useReactMessageEmoji(chatId)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [content])

  return (
    <div onClick={() => setIsReact(!isReact)} ref={ref} className={`flex relative gap-2 px-4  ${myMessage ? 'flex-row-reverse' : ''}`}>
      {isReact && (
        <div className="absolute -bottom-8 bg-slate-200 rounded-full w-44 h-8 flex justify-between text-2xl ">
          {emojis.map((emoji) => (
            <p key={emoji} className="cursor-pointer" onClick={() => reactToMessage({ data: { messageId: id, emoji } })}>
              {emoji}
            </p>
          ))}
        </div>
      )}
      {reactions && (
        <div className="absolute -bottom-8  rounded-full w-8 h-8 rounded-full flex justify-between text-2xl ">
          {reactions.map((emoji) => (
            <p key={emoji.userId} className="cursor-pointer">
              {emoji.emoji}
            </p>
          ))}
        </div>
      )}
      {profilePic ? (
        <img className="min-w-[48px] h-12 rounded-full" src={profilePic} alt="user-pic" />
      ) : (
        <div className="min-w-[56px] h-14 rounded-full bg-gray"></div>
      )}
      <div className={`w-full `}>
        <div className={`flex gap-4 items-center ${myMessage ? 'justify-end' : ''} `}>
          <p className="font-semibold ">{name}</p>
          <p className="text-xs ]">{dayjs(new Date(date).toString()).fromNow()}</p>
        </div>
        <p className={`text-sm flex ${myMessage ? 'justify-end' : ''} whitespace-break-spaces `}>{content}</p>
        {media && (
          <div className={` flex  ${myMessage ? 'justify-end' : ''} `}>
            {media.map((item) => (
              <img className={`  w-40  `} key={item.imageUrl} src={item.imageUrl} alt="" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserMessage
