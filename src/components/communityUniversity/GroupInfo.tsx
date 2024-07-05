import { useJoinCommunityGroup, useUpdateCommunityGroup } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { useUniStore } from '@/store/store'
import React, { useEffect, useMemo, useState } from 'react'
import { FaLock } from 'react-icons/fa'
import { CiImageOn } from 'react-icons/ci'
import { IoMdSettings } from 'react-icons/io'

const GroupInfo = ({ data, isJoinedinCommunity, setIsJoinedInGroup, isJoinedInGroup }: any) => {
  const { mutate: JoinCommunityGroup } = useJoinCommunityGroup()
  const { userData } = useUniStore()
  const { mutate: UpdateCommunityGroup, data: updateData } = useUpdateCommunityGroup()
  const [coverImage, setCoverImage] = useState('')
  const [logoImage, setLogoImage] = useState('')
  const [tempImg, setTempImg] = useState('')
  const [uploadFunc, setUploadFunc] = useState('')

  const userVerifiedCommunityGroupIds = useMemo(() => {
    return userData?.userVerifiedCommunities?.flatMap((x) => x.communityGroups.map((y) => y.communityGroupId.toString())) || []
  }, [userData])

  const userUnverifiedVerifiedCommunityGroupIds = useMemo(() => {
    return userData?.userUnVerifiedCommunities?.flatMap((x) => x.communityGroups.map((y) => y.communityGroupId.toString())) || []
  }, [userData])

  useEffect(() => {
    if (data) {
      const communityGroupId = data?._id?.toString()
      if (userVerifiedCommunityGroupIds.includes(communityGroupId) || userUnverifiedVerifiedCommunityGroupIds.includes(communityGroupId)) {
        setIsJoinedInGroup(true)
      } else {
        setIsJoinedInGroup(false)
      }
    }
    if (data?.communityGroupLogoCoverUrl?.imageUrl) {
      setCoverImage(data?.communityGroupLogoCoverUrl?.imageUrl)
    } else {
      setCoverImage('')
    }
    if (data?.communityGroupLogoUrl?.imageUrl) {
      setLogoImage(data?.communityGroupLogoUrl?.imageUrl)
    } else {
      setLogoImage('')
    }
  }, [data, userVerifiedCommunityGroupIds, userUnverifiedVerifiedCommunityGroupIds])

  useEffect(() => {
    if (updateData?.message == 'Updated Successfully') {
      if (tempImg && uploadFunc == 'cover') setCoverImage(tempImg)
      else if (tempImg && uploadFunc == 'logo') setLogoImage(tempImg)
    }
  }, [updateData])

  const handleCoverImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], data?.communityGroupLogoCoverUrl?.publicId)

      setTempImg(imagedata?.imageUrl)
      setUploadFunc('cover')
      const dataToPush = { communityGroupLogoCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      UpdateCommunityGroup({ dataToPush, id: data._id })
    } else {
      console.error('No file selected.')
    }
  }

  const handleLogoImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], data?.communityGroupLogoUrl?.publicId)
      setTempImg(imagedata?.imageUrl)
      setUploadFunc('logo')
      const dataToPush = { communityGroupLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
      UpdateCommunityGroup({ dataToPush, id: data._id })
    } else {
      console.error('No file selected.')
    }
  }

  return (
    <div className="w-full overflow-hidden border-2 border-neutral-300 rounded-lg">
      {/* top section  */}
      <div className="h-52 relative flex justify-start items-end   ">
        {coverImage ? (
          <>
            <img className="absolute bottom-8 -z-10 object-cover w-full" src={coverImage} alt="bg" />
            <div className="absolute bottom-8 z-0 w-full h-full  group">
              <div className={`${data?.adminUserId._id == userData.id ? 'block ' : 'hidden'} w-full  text-end  mt-10 pr-4 `}>
                <input style={{ display: 'none' }} type="file" id="file" onChange={(e) => handleCoverImageUpload(e)} />
                <label htmlFor="file">Change cover image</label>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute bottom-8 -z-10 w-full h-full bg-gray group" />
            <div className={`${data?.adminUserId._id == userData.id ? 'block absolute ' : 'hidden'} w-full z-30 top-0 left-2/3 `}>
              <input style={{ display: 'none' }} type="file" id="file" onChange={(e) => handleCoverImageUpload(e)} />
              <label htmlFor="file">Change cover image</label>
            </div>
          </>
        )}
        {logoImage ? (
          <div className="group relative">
            <img className="w-20 h-20 object-cover rounded-full ms-10 max-md:hidden " src={logoImage} alt="dp" />
            <div className={`${data?.adminUserId._id == userData.id ? 'block absolute ' : 'hidden'} absolute top-3 right-1/4`}>
              <input style={{ display: 'none' }} type="file" id="file2" onChange={(e) => handleLogoImageUpload(e)} />
              <label htmlFor="file2">
                <p className="">
                  <CiImageOn size={24} />
                </p>
              </label>
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 object-cover rounded-full ms-10 max-md:hidden bg-orange relative group ">
            <div className={`${data?.adminUserId._id == userData.id ? 'group-hover:block' : 'hidden'} absolute top-1/3 right-1/3`}>
              <input style={{ display: 'none' }} type="file" id="file2" onChange={(e) => handleLogoImageUpload(e)} />
              <label htmlFor="file2">
                <p className="">
                  <CiImageOn size={24} />
                </p>
              </label>
            </div>
          </div>
        )}
      </div>
      {/* name  */}
      <div className="flex justify-between items-center py-4 px-8">
        <div className="flex flex-col gap-1 w-full ">
          <h6 className="font-extrabold text-lg max-lg:text-sm flex items-center gap-2">
            {data?.title} {data?.communityGroupType == 'private' && <FaLock size={18} />}
          </h6>
          <p className="text-sm max-sm:text-xs font-medium text-neutral-500 max-xl:max-w-sm max-lg:max-w-full">
            {data?.description ? data?.description : 'No Description'}
            {/* Undergraduate research group at the department of chemistry at Loreum’s . */}
          </p>
          <p className="text-sm font-semibold text-neutral-500 mt-2 max-lg:hidden">{data?.memberCount} Members </p>
          <div className="lg:hidden flex justify-between items-center">
            <p className="text-sm font-semibold text-neutral-500 mt-4">{data?.memberCount} Members </p>
            {data?.adminUserId?._id == userData.id ? (
              <button className=" bg-[#6647FF] py-3 px-3 text-white rounded-full min-w-fit">
                <IoMdSettings />
              </button>
            ) : (
              <button onClick={() => JoinCommunityGroup(data?._id)} className=" bg-[#6647FF] py-2 px-3 text-white rounded-md">
                {isJoinedInGroup ? 'Leave Group' : 'Join Group'}
              </button>
            )}
          </div>
        </div>
        {data?.adminUserId?._id == userData.id ? (
          <button className="max-lg:hidden bg-[#6647FF] py-3 px-3 text-white rounded-full min-w-fit">
            <IoMdSettings />
          </button>
        ) : (
          <button
            onClick={() => JoinCommunityGroup(data?._id)}
            disabled={!isJoinedinCommunity}
            className="max-lg:hidden bg-[#6647FF] py-2 px-3 text-white rounded-md min-w-fit"
          >
            {isJoinedInGroup ? 'Leave Group' : 'Join Group'}
          </button>
        )}
      </div>
    </div>
  )
}

export default GroupInfo
