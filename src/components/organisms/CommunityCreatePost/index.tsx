import Buttons from '@/components/atoms/Buttons'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { cleanInnerHTML, validateUploadedFiles } from '@/lib/utils'
import { useCreateGroupPost } from '@/services/community-university'
import { useUploadToS3 } from '@/services/upload'
import { useUniStore } from '@/store/store'
import { CommunityPostData, CommunityPostType, PostInputType, PostTypeOption, UserPostTypeOption } from '@/types/constants'
import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef, useState } from 'react'
import { GoFileMedia } from 'react-icons/go'
import { TbFileUpload } from 'react-icons/tb'
import MediaPreview from '@/components/molecules/MediaPreview'
import { Spinner } from '@/components/spinner/Spinner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { UPLOAD_CONTEXT } from '@/types/Uploads'

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
  const [postAccessType] = useState<CommunityPostType | UserPostTypeOption>(UserPostTypeOption.PUBLIC)
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
    const plainText = quillInstance?.getText().trim()
    const hasText = !!plainText && plainText.length > 0
    const hasFiles = files.length > 0

    if (!hasText && !hasFiles) {
      showCustomDangerToast('Post must contain text or at least one file.')
      return
    }

    setIsPostCreating(true)

    try {
      const basePayload: CommunityPostData = {
        content: cleanInnerHTML(quillHTMLState.current!),
        communityPostsType: PostTypeOption[postAccessType as never],
        communityId,
        communityGroupId: communityGroupId || null,
        isPostVerified: userProfileData?.email?.some((entry) => entry.communityId === communityId) as boolean,
      }

      // Upload image if present
      if (hasFiles) {
        const uploadPayload = {
          files: files.map((f) => f.file),
          context: UPLOAD_CONTEXT.COMMUNITY,
        }
        const uploadResponse = await uploadToS3(uploadPayload)
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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (!quillInstance) return

    const editor = quillInstance

    editor.focus()

    const range = editor.getSelection()

    const position = range?.index ?? editor.getLength()

    editor.insertText(position, emojiData.emoji, 'user')
    editor.setSelection(position + emojiData.emoji.length, 0)
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
            <Popover>
              <PopoverTrigger>
                <HiOutlineEmojiHappy size={24} className="text-neutral-400 cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-card ml-8">
                <EmojiPicker lazyLoadEmojis className="!w-[325px] " onEmojiClick={handleEmojiClick} />
              </PopoverContent>
            </Popover>
            <label htmlFor="postImage" className="cursor-pointer inline-block">
              <input
                id="postImage"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              <GoFileMedia size={24} className="text-neutral-400" />
            </label>

            <label htmlFor="communityPostFile" className="cursor-pointer inline-block">
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
            <Buttons className="w-[70px]" size="medium" disabled={isPending} onClick={handleSubmit}>
              {isPending || isPostCreating ? <Spinner /> : 'Post'}
            </Buttons>
          </div>
        </div>
      </div>
    </>
  )
}

export default CommunityCreatePost
