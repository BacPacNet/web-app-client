import React, { useState, useRef, useEffect } from 'react'

type ChatInputProps = {
  onSend: (message: string) => void
  disabled?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = input.trim()
    if (trimmed) {
      onSend(trimmed)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-grow the textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px` // Limit to ~5 lines
    }
  }, [input])

  return (
    <div className="flex gap-2 bg-white sticky bottom-0 w-full p-2">
      <textarea
        ref={textareaRef}
        className="flex-1 p-2 border rounded-lg border-neutral-200 focus:ring-0 outline-none resize-none text-sm"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        style={{ maxHeight: 120, minHeight: 40, lineHeight: '20px' }}
      />
      <button
        disabled={disabled}
        className={`bg-primary-500 text-white px-4 py-2 rounded-lg self-end ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={handleSend}
      >
        Ask
      </button>
    </div>
  )
}

export default ChatInput
