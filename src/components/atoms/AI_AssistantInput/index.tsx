import React, { useState } from 'react'

type Message = {
  _id: string
  prompt: string
  response: string
  createdAt: string
}

type ChatInputProps = {
  onSend: (message: string) => void
  disabled?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div className="px-4 flex gap-2 bg-white sticky bottom-0 w-full">
      <input
        type="text"
        className="flex-1 p-2 border rounded-lg border-neutral-200 focus:ring-0 outline-none"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        disabled={disabled}
        className={`bg-primary-500 text-white px-4 py-2 rounded-lg  ${disabled ? 'cursor-not-allowed' : ''}`}
        onClick={handleSend}
      >
        Ask
      </button>
    </div>
  )
}

export default ChatInput
