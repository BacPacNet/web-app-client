'use client'
import React, { useEffect, useMemo } from 'react'
import chatboticon from '@/assets/chatboticon.png'
import { useJoinCommunity, useLeaveCommunity, useUpdateCommunity } from '@/services/community-university'
import { useUniStore } from '@/store/store'
import { CiImageOn } from 'react-icons/ci'
import { replaceImage } from '@/services/uploadImage'
import { IoMdSettings } from 'react-icons/io'

const HeroSec = ({ data, setIsJoined, isJoined }: any) => {
  const { mutate: JoinCommunity } = useJoinCommunity()
  const { mutate: LeaveCommunity } = useLeaveCommunity()
  const { mutate: updateCommunity } = useUpdateCommunity()
  const { userData } = useUniStore()

  const userVerifiedCommunityIds = useMemo(() => {
    return userData?.userVerifiedCommunities?.map((c) => c.communityId.toString()) || []
  }, [userData])

  const userUnverifiedVerifiedCommunityIds = useMemo(() => {
    return userData?.userUnVerifiedCommunities?.map((c) => c.communityId.toString()) || []
  }, [userData])

  useEffect(() => {
    if (data) {
      const communityId = data?.community?._id
      if (userVerifiedCommunityIds.includes(communityId) || userUnverifiedVerifiedCommunityIds.includes(communityId)) {
        setIsJoined(true)
      } else {
        setIsJoined(false)
      }
    }
  }, [data, userVerifiedCommunityIds, userUnverifiedVerifiedCommunityIds])

  const handleCoverImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], data?.community?.communityCoverUrl?.publicId)

      const dataToPush = { communityCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      updateCommunity({ id: data?.community?._id, data: dataToPush })
    } else {
      console.error('No file selected.')
    }
  }

  const handleLogoImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], data?.community?.communityLogoUrl?.publicId)

      const dataToPush = { communityLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      updateCommunity({ id: data?.community?._id, data: dataToPush })
    } else {
      console.error('No file selected.')
    }
  }

  return (
    <div className=" w-10/12 max-xl:w-11/12 max-md:w-9/12 max-sm:w-11/12 overflow-hidden border-2 border-neutral-300 rounded-lg pb-10">
      {/* top section  */}
      <div className="h-96 max-md:h-[28rem] relative flex max-md:flex-col justify-between max-md:justify-end items-end max-md:items-center ">
        {data?.community?.communityCoverUrl?.imageUrl ? (
          <>
            <img
              className="absolute bottom-20 -z-10 object-cover w-full h-full max-md:bottom-52"
              src={data?.community?.communityCoverUrl.imageUrl}
              alt="bg"
            />
            <div
              className={`${
                data?.community?.adminId == userData.id ? 'block  ' : 'hidden'
              } absolute w-full z-30 top-[5%] left-[84%] max-lg:left-3/4 max-md:left-2/3 max-sm:left-1/3`}
            >
              <input style={{ display: 'none' }} type="file" id="CommunityCoverImagefile" onChange={(e) => handleCoverImageUpload(e)} />
              <label htmlFor="CommunityCoverImagefile">Change cover image</label>
            </div>
          </>
        ) : (
          <div className="absolute bottom-20 z-0 object-cover w-full h-full max-md:bottom-52 bg-gray">
            <div className={`${data?.community?.adminId == userData.id ? 'block  ' : 'hidden'} absolute w-full z-30 top-1/4 left-[84%] `}>
              <input style={{ display: 'none' }} type="file" id="CommunityCoverImagefile" onChange={(e) => handleCoverImageUpload(e)} />
              <label htmlFor="CommunityCoverImagefile">Change cover image</label>
            </div>
          </div>
        )}

        <div className="flex gap-6 ps-10 max-xl:ps-5 max-md:hidden">
          <div className="flex flex-col items-center max-lg:text-sm">
            <h6 className="font-extrabold">{data?.community?.numberOfUser ? data?.community?.numberOfUser : 0}</h6>
            <label className="text-neutral-500 font-medium">Total Users </label>
          </div>
          <div className="flex flex-col items-center max-lg:text-sm">
            <h6 className="font-extrabold">{data?.community?.numberOfStudent ? data?.community?.numberOfStudent : 0}</h6>
            <label className="text-neutral-500 font-medium">Students</label>
          </div>
          <div className="flex flex-col items-center max-lg:text-sm">
            <h6 className="font-extrabold">{data?.community?.numberOfFaculty ? data?.community?.numberOfFaculty : 0}</h6>
            <label className="text-neutral-500 font-medium">Faculty</label>
          </div>
        </div>
        <div className="flex flex-col items-center max-md:gap-2 relative">
          {data?.community?.communityLogoUrl?.imageUrl ? (
            <>
              <img
                className="w-28 h-28 object-cover border-4 border-neutral-300 rounded-full bg-white"
                src={data?.community?.communityLogoUrl.imageUrl}
                alt="dp"
              />
              <div className={`${data?.community?.adminId == userData.id ? 'block  ' : 'hidden'} absolute top-1/4`}>
                <input style={{ display: 'none' }} type="file" id="communitylogoImagefile" onChange={(e) => handleLogoImageUpload(e)} />
                <label htmlFor="communitylogoImagefile">
                  <p className="">
                    <CiImageOn size={24} />
                  </p>
                </label>
              </div>
            </>
          ) : (
            <div className="w-28 h-28 object-contain border-4 border-neutral-300 rounded-full bg-white flex items-center justify-center z-10">
              <div className={`${data?.community?.adminId == userData.id ? 'block  ' : 'hidden'}  `}>
                <input style={{ display: 'none' }} type="file" id="communitylogoImagefile" onChange={(e) => handleLogoImageUpload(e)} />
                <label htmlFor="communitylogoImagefile">
                  <p className="">
                    <CiImageOn size={24} />
                  </p>
                </label>
              </div>
            </div>
          )}

          <h5 className="font-semibold text-neutral-900 text-lg text-center max-lg:text-sm max-md:text-lg">{data?.community?.name}</h5>
        </div>
        <div className="flex gap-6 max-md:flex-col-reverse max-md:items-center max-md:pt-3 ">
          <div className="flex flex-col items-center">
            <img className="object-contain" src={chatboticon.src} alt="chatboticon" />
            <label className="text-neutral-500 font-medium max-lg:text-sm">Chatbot Support</label>
          </div>
          {!isJoined && data?.community?.adminId != userData.id ? (
            <button
              onClick={() => JoinCommunity(data?.community?._id)}
              className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-1 max-md:py-3 rounded-xl mr-10 max-xl:mr-5 max-lg:text-sm max-md:mr-0"
            >
              Join Community
            </button>
          ) : data?.community?.adminId == userData.id ? (
            <button className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max  rounded-full mr-10 max-xl:mr-5 max-lg:text-sm max-md:mr-0">
              <IoMdSettings />
            </button>
          ) : (
            <button
              onClick={() => LeaveCommunity(data?.community?._id)}
              className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-1 max-md:py-3 rounded-xl mr-10 max-xl:mr-5 max-lg:text-sm max-md:mr-0"
            >
              leave Community
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeroSec
