'use client'
import React, { useState } from 'react'
import { CiCirclePlus } from 'react-icons/ci'
interface PollChoice {
  id: number
  text: string
}

interface Poll {
  choices: PollChoice[]
  duration: {
    days: number
    hours: number
    minutes: number
  }
}

const PollModal = () => {
  const [choices, setChoices] = useState<PollChoice[]>([
    { id: 1, text: '' },
    { id: 2, text: '' },
  ])
  const [pollLength, setPollLength] = useState({ days: 1, hours: 1, minutes: 1 })

  const handleChoiceChange = (id: number, text: string) => {
    setChoices((prevChoices) => prevChoices.map((choice) => (choice.id === id ? { ...choice, text } : choice)))
  }

  const addChoice = () => {
    setChoices([...choices, { id: choices.length + 1, text: '' }])
  }

  const removeChoice = () => {
    if (choices.length > 2) {
      setChoices(choices.slice(0, -1))
    }
  }

  const handlePost = () => {
    const poll: Poll = {
      choices,
      duration: pollLength,
    }
    console.log(poll)
  }

  return (
    <div className="max-w-xl flex flex-col">
      <div className="flex min-w-lg">
        <div className="w-full">
          {choices.map((choice) => (
            <div key={choice.id} className="flex flex-col gap-2 max-w-lg mb-8">
              <label htmlFor="poll choice" className="text-sm font-semibold">
                Choice {choice.id}
              </label>
              <textarea
                // type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                maxLength={25}
                placeholder="input text field here"
                className="pt-2 pl-3 pb-2 resize-none min-w-max border border-border rounded-lg focus:outline-[#A28FFF]"
              />
            </div>
          ))}
        </div>
        <button onClick={addChoice} className=" self-end mb-10">
          <CiCirclePlus className="text-primary w-12 h-12" />
        </button>
      </div>
      <p className="text-sm font-semibold">Poll Length</p>
      <div className="flex gap-12 max-w-lg pr-10">
        <div className="border border-border pl-2 pt-2 pb-2 my-4 rounded-lg">
          <label className="text-sm text-gray-1">Days:</label>
          <input
            type="number"
            value={pollLength.days}
            onChange={(e) => setPollLength({ ...pollLength, days: Number(e.target.value) })}
            className=" w-24"
          />
        </div>
        <div className="border border-border pl-2 pt-2 pb-2 my-4 rounded-lg">
          <label className="text-sm text-gray-1">Hours:</label>
          <input
            type="number"
            value={pollLength.hours}
            onChange={(e) => setPollLength({ ...pollLength, hours: Number(e.target.value) })}
            className=" w-24"
          />
        </div>
        <div className="border border-border pl-2 pt-2 pb-2 my-4 rounded-lg">
          <label className="text-sm text-gray-1">Minutes:</label>
          <input
            type="number"
            value={pollLength.minutes}
            onChange={(e) => setPollLength({ ...pollLength, minutes: Number(e.target.value) })}
            className=" w-24"
          />
        </div>
      </div>
      <button className="py-2 px-4 font-medium text-[#EF4444] border border-[#EF4444] text-white rounded-md self-center" onClick={removeChoice}>
        Remove Poll
      </button>
      <button className="text-white self-end bg-primary px-4 py-2 rounded-xl text-sm" onClick={handlePost}>
        Post
      </button>
    </div>
  )
}

export default PollModal
