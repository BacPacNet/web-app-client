import React, { useEffect, useState } from 'react'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import CommunityProfileDeactivatePopUp from './CommunityProfileDeactivatePopUp'
import accountveriImg from "@/assets/Account_Verified.png"

const CommunityProfileAccount = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
const [accountVerified,setAccountVerified] = useState(false)
  const [showPopUp, setShowPopUp] = useState(false)

  useEffect(() => {
    if (showPopUp) {
      document.body.classList.add('noscroll');
    } else {
      document.body.classList.remove('noscroll');
    }

    return () => {
      document.body.classList.remove('noscroll');
    };
  }, [showPopUp]);
  return (
    <>
      <div className={`py-10 px-12 flex flex-col gap-16 `}>
        <div className="flex flex-col gap-10">
          <h6 onClick={()=>setAccountVerified(!accountVerified)} className="font-bold text-lg">Account Verification</h6>
          {
            !accountVerified ?
            <div className="flex flex-col gap-2">
            <label className="font-medium mb-4">Verify your account with Sheer ID. </label>
            <input className="border-2 border-[#E5E5E5] w-80 h-10 max-lg:w-10/12 rounded-lg px-3" type="text" placeholder="University Email" />
            <label className="text-neutral-500 text-sm">Enter your university email. </label>
          </div>
          :
          <div className='flex flex-col gap-6 justify-center items-center'>
            <img className='w-40' src={accountveriImg.src} alt="acc" />
            <label className="font-medium mb-4">Your account is verified.</label>
            <input className="border-2 border-[#E5E5E5] w-80 h-10 max-lg:w-10/12 rounded-lg px-3" type="text" disabled placeholder="unibuzz.college@gmail.com" />
            
          </div>
          }
         
        </div>
        {/* change email  */}
        <div className="flex flex-col gap-10">
          <h6 className="font-bold text-lg text-start">Change Email</h6>
          <div className="flex flex-col items-center gap-10">
            <div className="relative flex flex-col gap-2">
              <label className="font-medium text-sm">Current Email</label>
              <input
                className="border-2 border-[#E5E5E5] w-80 h-10 rounded-lg px-3 pr-10"
                type={showEmail ? 'text' : 'password'}
                placeholder="********"
              />
              <div className="absolute pt-9 right-0 pr-3 flex items-center text-sm leading-5">
                {showEmail ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowEmail(!showEmail)} />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowEmail(!showEmail)} />
                )}
              </div>
            </div>

            <div className="relative flex flex-col gap-2">
              <label className="font-medium text-sm">New Email</label>
              <input
                className="border-2 border-[#E5E5E5] w-80 h-10 rounded-lg px-3 pr-10"
                type={showEmail ? 'text' : 'password'}
                placeholder="********"
              />
              <div className="absolute pt-9 right-0 pr-3 flex items-center text-sm leading-5">
                {showEmail ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowEmail(!showEmail)} />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowEmail(!showEmail)} />
                )}
              </div>
            </div>
            <div className=" relative flex flex-col gap-2">
              <label className="font-medium text-sm">Confirm Email</label>
              <input
                className="border-2 border-[#E5E5E5] w-80 h-10 rounded-lg px-3 pr-10"
                type={showEmail ? 'text' : 'password'}
                placeholder="********"
              />
              <div className="absolute pt-9 right-0 pr-3 flex items-center text-sm leading-5">
                {showEmail ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowEmail(!showEmail)} />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowEmail(!showEmail)} />
                )}
              </div>
            </div>
          </div>
          <button className="mx-auto bg-[#6647FF] py-2 px-3 rounded-md text-white max-w-max">Confirm Reset</button>
        </div>
        {/* change Password  */}
        <div className="flex flex-col gap-10">
          <h6 className="font-bold text-lg text-start">Change Password</h6>
          <div className="flex flex-col items-center gap-10">
            <div className="relative flex flex-col gap-2">
              <label className="font-medium text-sm">Current Password</label>
              <input
                className="border-2 border-[#E5E5E5] w-80 h-10 rounded-lg px-3 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
              />
              <div className="absolute pt-9 right-0 pr-3 flex items-center text-sm leading-5">
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
            </div>

            <div className="relative flex flex-col gap-2">
              <label className="font-medium text-sm">New Password</label>
              <input
                className="border-2 border-[#E5E5E5] w-80 h-10 rounded-lg px-3 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
              />
              <div className="absolute pt-9 right-0 pr-3 flex items-center text-sm leading-5">
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
            </div>
            <div className=" relative flex flex-col gap-2">
              <label className="font-medium text-sm">Confirm Password</label>
              <input
                className="border-2 border-[#E5E5E5] w-80 h-10 rounded-lg px-3 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
              />
              <div className="absolute pt-9 right-0 pr-3 flex items-center text-sm leading-5">
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
            </div>
          </div>
          <button className="mx-auto bg-[#6647FF] py-2 px-3 rounded-md text-white max-w-max">Confirm Reset</button>
        </div>

        {/* account deactivation  */}
        <div className="flex flex-col gap-10">
          <h6 className="font-bold text-lg">Account Deactivation</h6>
          <div className="flex flex-col gap-2">
            <p className="font-medium mb-4">
              You’re about to start the process of deactivating your Unibuzz account. Your information will no longer be viewable on Unibuzz. You can
              restore your Unibuzz account if it was accidentally or wrongfully deactivated for up to 30 days after deactivation.{' '}
            </p>
          </div>
        </div>
        <button onClick={() => setShowPopUp(true)} className="mx-auto bg-[#EF4444] py-2 px-3 rounded-md text-white max-w-max">
          Deactivate Account
        </button>
      </div>
      {showPopUp && <CommunityProfileDeactivatePopUp setShowPopUp={setShowPopUp} />}
    </>
  )
}

export default CommunityProfileAccount
