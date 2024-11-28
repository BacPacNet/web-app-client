import React from 'react'

type Props = {
  className?: string
}

const Ai_AssistantInput = ({ className = '' }: Props) => {
  return (
    <input
      type="text"
      placeholder="Ask me anything related to Lorem University!"
      className={`${className}
  border-neutral-200 w-11/12 
  py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm  text-neutral-900 placeholder:text-neutral-400 h-16 outline-none`}
    />
  )
}

export default Ai_AssistantInput
