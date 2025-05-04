import Buttons from '@/components/atoms/Buttons'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
//import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import Spinner from '@/components/atoms/spinner'
import { cleanInnerHTML, validateImageFiles } from '@/lib/utils'
import { useCreateGroupPost } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { useUniStore } from '@/store/store'
import { CommunityPostData, CommunityPostType, CommunityPostTypeOption, PostInputType, PostTypeOption, UserPostTypeOption } from '@/types/constants'
import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef, useState } from 'react'
import { GoFileMedia } from 'react-icons/go'
import { MdCancel } from 'react-icons/md'

const Editor = dynamic(() => import('@components/molecules/Editor/QuillRichTextEditor'), {
  ssr: false,
})

interface Props {
  communityId: string
  communityGroupId: string
}

function CommunityCreatePost({ communityId, communityGroupId }: Props) {
  const quillRef = useRef<Quill | null>(null)
  const quillHTMLState = useRef(null)
  const { userProfileData } = useUniStore()
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [postAccessType, setPostAccessType] = useState<CommunityPostType | UserPostTypeOption>(UserPostTypeOption.PUBLIC)
  const { mutate: CreateGroupPost, isPending } = useCreateGroupPost()

  const [isPostCreating, setIsPostCreating] = useState(false)

  const processImages = async (imagesData: File[]) => {
    const promises = imagesData.map((image) => replaceImage(image, ''))
    const results = await Promise.all(promises)
    return results.map((result) => ({
      imageUrl: result?.imageUrl || null,
      publicId: result?.publicId || null,
    }))
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      const fileArray = Array.from(files)
      const validation = validateImageFiles(fileArray)
      if (!validation.isValid) {
        showCustomDangerToast(validation.message)
        return
      }
      setImages((prevImages) => [...prevImages, ...fileArray]) // Store the actual files
    }
  }

  const resetPostContent = () => {
    quillInstance?.setText('')
    setImages([])
  }

  const handleSubmit = async () => {
    if (quillInstance && quillInstance?.getText().toString().length - 1 === 0) return
    setIsPostCreating(true)
    const payload: CommunityPostData = {
      content: cleanInnerHTML(quillHTMLState.current!),
      communityPostsType: PostTypeOption[postAccessType as never],
      communityId: communityId,
      communityGroupId: communityGroupId || null,
      isPostVerified: userProfileData?.email?.some((community) => community.communityId === communityId) || false,
    }
    if (images.length) {
      const imagedata = await processImages(images)
      payload.imageUrl = imagedata
    }
    CreateGroupPost(payload)
    resetPostContent()
    setIsPostCreating(false)
  }

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return (
    <>
      <Editor
        onTextChange={(innerHTML) => (quillHTMLState.current = innerHTML)}
        ref={quillRef}
        type={PostInputType.Timeline}
        getQuillInstance={setQuillInstance}
        placeholder="What`s on your mind?"
      />
      <div className="w-full px-4 bg-white rounded-b-lg">
        <div className={`${images ? 'flex flex-wrap gap-4' : 'hidden'}`}>
          {images.map((image, index) => (
            <div key={index} className="relative w-fit">
              <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
              {/* Remove image button */}
              <div onClick={() => handleImageRemove(index)} className="absolute -top-1 -right-1 cursor-pointer text-sm">
                <MdCancel size={24} className="text-destructive-600 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex items-center justify-between py-4">
          <div className="flex gap-3 sm:gap-4 items-center ">
            <label htmlFor="postImage" className="cursor-pointer inline-block">
              <input id="postImage" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} />
              <GoFileMedia size={24} className="text-neutral-400" />
            </label>
          </div>
          <div className="flex gap-2 h-10">
            {/*<SelectDropdown
              options={Object.values(CommunityPostTypeOption)}
              value={postAccessType}
              onChange={(e: any) => setPostAccessType(e)}
              placeholder=""
              icon={'single'}
              // search={true}
              err={false}
              showIcon={true}
              isAllowedToRemove={false}
            />*/}
            <Buttons className="w-[70px]" size="small" disabled={isPending} onClick={handleSubmit}>
              {isPending || isPostCreating ? <Spinner /> : 'Post'}
            </Buttons>
          </div>
        </div>
      </div>
    </>
  )
}

export default CommunityCreatePost
