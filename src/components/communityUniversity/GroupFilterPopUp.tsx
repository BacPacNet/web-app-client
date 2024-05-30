import React from 'react'
import { RxCross2 } from 'react-icons/rx'

type Props = {
  setShowPopUp: (value: boolean) => void
}

const GroupFilterPopUp = ({ setShowPopUp }: Props) => {
  return (
    <>
      <div className="fixed   w-full h-[100%] top-0 left-0 backdrop-blur-sm z-10"></div>
      <div className={`fixed w-96 max-sm:w-11/12 z-50   top-1/3 bg-white flex flex-col items-center gap-6 shadow-lg px-10 py-6 rounded-lg`}>
        <div className="flex justify-end w-full">
          {' '}
          <RxCross2 onClick={() => setShowPopUp(false)} size={24} color="#737373" />
        </div>

        <p className="font-medium text-lg text-center">Groups </p>
        <div className="w-full flex flex-col gap-2">
          {['Clubs', 'Circles', 'Lectures', 'Miscellaneous'].map((item) => (
            <div key={item} className="flex justify-between w-full">
              <label className="text-lg font-semibold">{item}</label>
              <input className="form-checkbox h-5 w-5 text-black-600" type="checkbox" />
            </div>
          ))}
        </div>
        <button onClick={() => setShowPopUp(false)} className="self-end bg-[#6647FF] py-2 px-6 text-white rounded-md">
          Apply
        </button>
      </div>
    </>
  )
}

export default GroupFilterPopUp
