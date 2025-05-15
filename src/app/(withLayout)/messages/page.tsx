import Card from '@/components/atoms/Card'
import MessageContainer from '@/components/organisms/MessageContainer'
import React from 'react'

const Message = () => {
  return (
    <div className="h-[-webkit-fill-available] py-4">
      <Card defaultPadding={false} className="rounded-2xl h-full overflow-hidden w-full ">
        <MessageContainer />
      </Card>
    </div>
  )
}

export default Message
