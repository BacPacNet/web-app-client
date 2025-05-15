import Buttons from '@/components/atoms/Buttons'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { cleanInnerHTML, validateUploadedFiles } from '@/lib/utils'
import { useCreateGroupPost } from '@/services/community-university'
import { useUploadToS3 } from '@/services/upload'
import { useUniStore } from '@/store/store'
import { CommunityPostData, CommunityPostType, PostInputType, PostTypeOption, UserPostTypeOption } from '@/types/constants'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Quill from 'quill'
import gif from '@/assets/gif.svg'
import React, { useRef, useState } from 'react'
import { GoFileMedia } from 'react-icons/go'
import { TbFileUpload } from 'react-icons/tb'
import MediaPreview from '@/components/molecules/MediaPreview'
import { Spinner } from '@/components/spinner/Spinner'

type FileWithId = {
  id: string
  file: File
}

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
  const [files, setFiles] = useState<FileWithId[]>([])
  const [postAccessType, setPostAccessType] = useState<CommunityPostType | UserPostTypeOption>(UserPostTypeOption.PUBLIC)
  const { mutate: CreateGroupPost, isPending } = useCreateGroupPost()
  const { mutateAsync: uploadToS3 } = useUploadToS3()
  const [isPostCreating, setIsPostCreating] = useState(false)

  const generateFileId = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : []
    const validation = validateUploadedFiles(newFiles)
    if (!validation.isValid) {
      showCustomDangerToast(validation.message)
      return
    }

    const mappedFiles: FileWithId[] = newFiles.map((file) => ({
      id: generateFileId(file),
      file,
    }))

    const totalFiles = files.length + mappedFiles.length
    if (totalFiles > 4) {
      showCustomDangerToast('You can upload a maximum of 4 files.')
      return
    }

    setFiles((prev) => [...prev, ...mappedFiles])
  }

  const resetPostContent = () => {
    quillInstance?.setText('')
    setFiles([])
  }

  const handleSubmit = async () => {
    const isContentEmpty = quillInstance?.getText().trim().length === 0
    if (isContentEmpty) return

    setIsPostCreating(true)

    try {
      const basePayload: CommunityPostData = {
        content: cleanInnerHTML(quillHTMLState.current!),
        communityPostsType: PostTypeOption[postAccessType as never],
        communityId,
        communityGroupId: communityGroupId || null,
        isPostVerified: userProfileData?.email?.some((entry) => entry.communityId === communityId) || false,
      }

      // Upload image if present
      if (files.length > 0) {
        const uploadResponse = await uploadToS3(files.map((f) => f.file))
        if (uploadResponse.success) {
          basePayload.imageUrl = uploadResponse.data
        }
      }

      // Create the post
      CreateGroupPost(basePayload)
    } catch (error) {
      showCustomDangerToast('Failed to create post')
    } finally {
      resetPostContent()
      setIsPostCreating(false)
    }
  }

  const handleFileRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleOpenPDF = (file: File) => {
    const fileURL = URL.createObjectURL(file)
    window.open(fileURL, '_blank')
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
        <MediaPreview files={files} onRemove={handleFileRemove} onOpenPDF={handleOpenPDF} />
        {/*<div className={`${images ? 'flex flex-wrap gap-4' : 'hidden'}`}>
          {images.map((image, index) => (
            <div key={index} className="relative w-fit">
              <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
        
              <div onClick={() => handleImageRemove(index)} className="absolute -top-1 -right-1 cursor-pointer text-sm">
                <MdCancel size={24} className="text-destructive-600 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>*/}
        <div className="w-full flex items-center justify-between py-4">
          <div className="flex gap-3 sm:gap-4 items-center ">
            <label htmlFor="postImage" className="cursor-pointer inline-block">
              <input id="postImage" type="file" multiple accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handleFileChange} />
              <GoFileMedia size={24} className="text-neutral-400" />
            </label>
            <label htmlFor="timelinePostGif" className="cursor-pointer inline-block">
              <input id="timelinePostGif" type="file" accept="image/gif" className="hidden" onChange={handleFileChange} />
              <Image src={gif} width={24} height={24} className="text-neutral-400" alt="GIF" />
            </label>
            <label htmlFor="timelinePostFile" className="cursor-pointer inline-block">
              <input
                id="timelinePostFile"
                type="file"
                multiple
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                className="hidden"
                onChange={handleFileChange}
              />
              <TbFileUpload size={24} className="text-neutral-400" />
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
