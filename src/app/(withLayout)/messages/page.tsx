import Card from '@/components/atoms/Card'
import MessageContainer from '@/components/organisms/MessageContainer'
import React from 'react'

const Message = () => {
  return (
    <div className="py-0 h-[-webkit-fill-available]">
      <Card defaultPadding={false} className="rounded-2xl h-full overflow-hidden w-full ">
        <MessageContainer />
      </Card>
    </div>
  )
}

export default Message
