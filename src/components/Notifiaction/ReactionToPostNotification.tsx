import dummy from '@/assets/avatar.png'
import Image from 'next/image'

import { BsStars } from 'react-icons/bs'
const ReactionToPostNotification = () => {
  return (
    <div className="flex flex-col gap-2 border-b-2 border-neutral-300 pb-5 me-10">
      <div className="flex justify-between ">
        <div className="flex gap-4 items-center mb-5 ">
          <div className="relative w-48">
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
          </div>
          <BsStars size={24} color="#9685FF" />
        </div>
        <p>2h ago</p>
      </div>
      <p className="text-sm">
        <span className="font-semibold "> John Morisson and 8 others </span>reacted to your post.{' '}
      </p>
    </div>
  )
}

export default ReactionToPostNotification
