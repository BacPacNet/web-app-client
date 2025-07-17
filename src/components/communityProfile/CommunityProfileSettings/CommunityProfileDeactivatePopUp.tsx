import React from 'react'

type Props = {
  setShowPopUp: (value: boolean) => void
}

const CommunityProfileDeactivatePopUp = ({ setShowPopUp }: Props) => {
  return (
    <>
      <div className="fixed   w-full h-[100%] top-0 left-0 backdrop-blur-sm "></div>
      <div className={`fixed z-10   top-1/3 bg-white flex flex-col items-center gap-6 shadow-lg px-10 py-10 rounded-lg`}>
        <h6 className="font-bold text-lg max-w-[250px] text-center">Are you sure about deactivating your account?</h6>
        <div className="flex gap-2">
          <input type="checkbox" />
          <label>Yes I comply to deactivating my account.</label>
        </div>
        <button onClick={() => setShowPopUp(false)} className="mx-auto bg-[#EF4444] py-2 px-3 rounded-md text-white max-w-max">
          Deactivate Account
        </button>
      </div>
    </>
  )
}

export default CommunityProfileDeactivatePopUp
