import Card from '@/components/atoms/Card'
import MessageContainer from '@/components/organisms/MessageContainer'
import React from 'react'

const Message = () => {
  return (
    <div className="h-[inherit] py-4">
      <Card defaultPadding={false} className="rounded-lg h-full overflow-hidden w-full ">
        <MessageContainer />
      </Card>
    </div>
  )
}

export default Message
