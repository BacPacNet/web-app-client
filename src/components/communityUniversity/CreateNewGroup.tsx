import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
type Props = {
  setNewGroup: (value: boolean) => void
}

const CreateNewGroup = ({ setNewGroup }: Props) => {
  const [logoImage, setLogoImage] = useState()
  const [coverImage, setCoverImage] = useState()

  const {
    register: GroupRegister,
    handleSubmit: handleGroupCreate,
    formState: { errors: GroupErrors },
  } = useForm()

  const onGroupSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <>
      <div className="fixed   w-full h-[100%] top-0 left-0 bg-black opacity-50 z-10"></div>
      <div className={`absolute w-9/12 max-sm:w-11/12 z-50   top-1/4 bg-white flex flex-col items-center gap-6 shadow-lg px-10 py-6 rounded-lg`}>
        <div className="flex justify-end w-full">
          {' '}
          <RxCross2 onClick={() => setNewGroup(false)} size={24} color="#737373" />
        </div>
        <div className="flex flex-col gap-4 justify-start items-start w-full">
          <h3>Create Group</h3>
          <div className={` ${!coverImage ? 'bg-slate-200' : ''}  relative shadow-lg flex flex-col w-full items-center justify-center h-52 `}>
            {coverImage && <img className="w-full h-full  absolute -z-10 object-cover rounded-lg" src={URL.createObjectURL(coverImage)} alt="" />}
            <input style={{ display: 'none' }} type="file" id="CreateGroupImage" onChange={(e: any) => setCoverImage(e.target.files[0])} />
            <label htmlFor="CreateGroupImage" className="flex flex-col items-center gap-2">
              <FiCamera size={40} className="text-slate-400" />
              <p>Add Banner Photo</p>
            </label>
          </div>
          {/* log0 */}
          <div className={` relative shadow-lg flex  items-center justify-center w-36 h-36 rounded-full `}>
            {logoImage && <img className="w-full h-full rounded-full absolute -z-10 object-cover" src={URL.createObjectURL(logoImage)} alt="" />}
            <input style={{ display: 'none' }} type="file" id="CreateGroupLogoImage" onChange={(e: any) => setLogoImage(e.target.files[0])} />
            <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
              <FiCamera size={40} className="text-slate-400" />
            </label>
          </div>
          {/* Forms  */}
          <form onSubmit={handleGroupCreate(onGroupSubmit)} className="w-full flex flex-col gap-6">
            <div className="relative w-full">
              <label htmlFor="name" className="font-semibold">
                Group Name
              </label>
              <input
                {...GroupRegister('name', { required: true })}
                placeholder="name"
                className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full"
              />
              {GroupErrors.name && <span className="text-red-500 font-normal"> Please enter your Group Name!</span>}
            </div>
            <div className="relative w-full">
              <label htmlFor="description" className="font-semibold">
                Description
              </label>
              <input
                {...GroupRegister('description', { required: true })}
                placeholder="description"
                className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full"
              />
              {GroupErrors.description && <span className="text-red-500 font-normal"> Please enter your Group description!</span>}
            </div>
            <div className="relative w-full">
              <label htmlFor="privacy" className="font-semibold">
                Choose Privacy
              </label>

              <select
                className="border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full"
                {...GroupRegister('privacy', { required: true })}
              >
                <option value="" disabled selected></option>
                <option value="public">Public</option>
                <option value="Private">Private</option>
              </select>
              {GroupErrors.privacy && <span className="text-red-500 font-normal">Please choose a privacy option!</span>}
            </div>
            <div className="relative w-full">
              <label htmlFor="inviteFriends" className="font-semibold">
                Invite Friends
              </label>
              <div className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full h-8"></div>
            </div>
            <button type="submit" className="bg-[#6647FF] py-2 rounded-lg text-white">
              Create Group
            </button>
            <button className="bg-[#F3F2FF] py-2 rounded-lg text-[#6647FF]">Redo Changes</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateNewGroup
