import Card from '@/components/atoms/Card'
import MessageContainer from '@/components/organisms/MessageContainer'
import React from 'react'

const Message = () => {
  return (
    <div className="py-4 h-with-navbar">
      <Card defaultPadding={false} className="rounded-2xl h-full overflow-hidden w-full p-6">
        <MessageContainer />
      </Card>
    </div>
  )
}

export default Message
