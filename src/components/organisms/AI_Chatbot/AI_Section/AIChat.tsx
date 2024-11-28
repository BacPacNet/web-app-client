import Image from 'next/image'
import React from 'react'
import avatar from '@assets/avatar.svg'
import aiLogo from '@/assets/chatbot/aiIcon.svg'

const dummyChatData = [
  { image: avatar, desc: 'Lorem University’s course list for 2024? 1st' },
  {
    image: aiLogo,
    desc: "Lorem ipsum is a placeholder text commonly used in the printing, typesetting, and graphic design industries. It's derived from a scrambled section of De finibus bonorum et malorum, a 1st-century BC Latin text by Cicero. The text is used as a dummy text to fill in content areas during the design phase of a project, allowing designers to focus on visual elements without the distraction of readable text Here’s a snippet of the most commonly used version:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  },
  { image: avatar, desc: 'Lorem University’s course list for 2024?' },
  {
    image: aiLogo,
    desc: "Lorem ipsum is a placeholder text commonly used in the printing, typesetting, and graphic design industries. It's derived from a scrambled section of De finibus bonorum et malorum, a 1st-century BC Latin text by Cicero. The text is used as a dummy text to fill in content areas during the design phase of a project, allowing designers to focus on visual elements without the distraction of readable text Here’s a snippet of the most commonly used version:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  },
  { image: avatar, desc: 'Lorem University’s course list for 2024?' },
  {
    image: aiLogo,
    desc: "Lorem ipsum is a placeholder text commonly used in the printing, typesetting, and graphic design industries. It's derived from a scrambled section of De finibus bonorum et malorum, a 1st-century BC Latin text by Cicero. The text is used as a dummy text to fill in content areas during the design phase of a project, allowing designers to focus on visual elements without the distraction of readable text Here’s a snippet of the most commonly used version:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  },
  { image: avatar, desc: 'Lorem University’s course list for 2024?' },
  {
    image: aiLogo,
    desc: "Lorem ipsum is a placeholder text commonly used in the printing, typesetting, and graphic design industries. It's derived from a scrambled section of De finibus bonorum et malorum, a 1st-century BC Latin text by Cicero. The text is used as a dummy text to fill in content areas during the design phase of a project, allowing designers to focus on visual elements without the distraction of readable text Here’s a snippet of the most commonly used version:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  },
  {
    image: aiLogo,
    desc: "Lorem ipsum is a placeholder text commonly used in the printing, typesetting, and graphic design industries. It's derived from a scrambled section of De finibus bonorum et malorum, a 1st-century BC Latin text by Cicero. The text is used as a dummy text to fill in content areas during the design phase of a project, allowing designers to focus on visual elements without the distraction of readable text Here’s a snippet of the most commonly used version:Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  },
]

const AIChat = () => {
  return (
    <div className="w-full flex  h-[750px] overflow-y-auto px-4 ">
      <div className="flex flex-col gap-4  ">{dummyChatData?.map((item, idx) => <ChatCard key={idx} data={item} />)}</div>
    </div>
  )
}

export default AIChat

const ChatCard = ({ data }: any) => {
  return (
    <div className="flex gap-2 items-start mt-5">
      <Image width={10} height={10} alt="dp" src={data?.image} className="w-10 h-10" />
      <p className={`max-w-[80%] p-2 rounded-xl text-neutral-500 text-sm ${data.desc.length < 50 ? 'bg-neutral-50' : ''}`}>{data?.desc}</p>
    </div>
  )
}
