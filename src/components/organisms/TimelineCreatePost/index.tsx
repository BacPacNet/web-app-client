import Buttons from '@/components/atoms/Buttons'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { Spinner } from '@/components/spinner/Spinner'
import { cleanInnerHTML, getMimeTypeFromUrl, imageMimeTypes, validateUploadedFiles } from '@/lib/utils'
import { useCreateUserPost } from '@/services/community-timeline'
import { useUploadToS3 } from '@/services/upload'
import { CommunityPostType, PostInputData, PostTypeOption, UserPostTypeOption } from '@/types/constants'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Quill from 'quill'
import React, { useRef, useState } from 'react'
import { GoFileMedia } from 'react-icons/go'
import gif from '@/assets/gif.svg'
import { TbFileUpload } from 'react-icons/tb'
import MediaPreview from '@/components/molecules/MediaPreview'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import mixpanel from 'mixpanel-browser'
import { TRACK_EVENT } from '@/content/constant'

type FileWithId = {
  id: string
  file: File
  size: number
}

const Editor = dynamic(() => import('@components/molecules/Editor/QuillRichTextEditor'), {
  ssr: false,
})

function TimelineCreatePost() {
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null)
  const quillRef = useRef<Quill | null>(null)
  const quillHTMLState = useRef(null)
  const [files, setFiles] = useState<FileWithId[]>([])
  const [postAccessType, setPostAccessType] = useState<CommunityPostType | UserPostTypeOption>(UserPostTypeOption.PUBLIC)
  const { mutateAsync: CreateTimelinePost, isPending } = useCreateUserPost()
  const [isPostCreating, setIsPostCreating] = useState(false)
  const { mutateAsync: uploadtoS3 } = useUploadToS3()

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
      size: file.size,
    }))

    const totalFiles = files.length + mappedFiles.length
    if (totalFiles > 4) {
      showCustomDangerToast('You can upload a maximum of 4 files.')
      return
    }

    setFiles((prev) => [...prev, ...mappedFiles])

    e.target.value = ''
  }

  const resetPostContent = () => {
    quillInstance?.setText('')
    setFiles([])
  }

  const handleSubmit = async () => {
    // Get plain text from Quill instance with proper null checks
    const plainText = quillInstance?.getText()?.trim() || ''
    const hasText = plainText.length > 0
    const hasFiles = files.length > 0

    if (!hasText && !hasFiles) {
      showCustomDangerToast('Post must contain text or at least one file.')
      return
    }

    if (files.length > 4) {
      showCustomDangerToast('You can upload a maximum of 4 files.')
      return
    }

    setIsPostCreating(true)

    const payload: PostInputData = {
      content: cleanInnerHTML(quillHTMLState.current!),
      PostType: PostTypeOption[postAccessType as never],
    }

    try {
      if (hasFiles) {
        const uploadPayload = {
          files: files.map((f) => f.file),
          context: UPLOAD_CONTEXT.TIMELINE,
        }
        const response = await uploadtoS3(uploadPayload)
        payload.imageUrl = response.data
        // mix panel start
        const imageItems =
          response.data?.filter((item: { imageUrl: string | null }) => item.imageUrl && imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))) ||
          []
        const fileItems =
          response.data?.filter(
            (item: { imageUrl: string | null }) => item.imageUrl && !imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))
          ) || []
        if (imageItems?.length > 0) {
          imageItems?.forEach((item) => {
            mixpanel.track(TRACK_EVENT.USER_POST_IMAGE_UPLOAD, {
              imageUrl: item.imageUrl,
            })
          })
        }

        if (fileItems?.length > 0) {
          fileItems?.forEach((item) => {
            mixpanel.track(TRACK_EVENT.USER_POST_FILE_UPLOAD, {
              fileUrl: item.imageUrl,
            })
          })
        }
        // mix panel end
      }
      await CreateTimelinePost(payload)
      resetPostContent()
    } catch (err) {
      console.error('Error creating post:', err)
    } finally {
      setIsPostCreating(false)
      mixpanel.track(TRACK_EVENT.USER_POST_BUTTON_CLICK, {
        buttonName: 'post_create',
      })
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

  const customEventCallback = (actionName: string) => {
    mixpanel.track(TRACK_EVENT.USER_POST_TEXT_EDIT, { textEdit: actionName })
  }

  return (
    <>
      <Editor
        onTextChange={(innerHTML) => {
          quillHTMLState.current = innerHTML
        }}
        ref={quillRef}
        getQuillInstance={setQuillInstance}
        placeholder="What`s on your mind?"
        customEventCallback={customEventCallback}
      />
      <div className="w-full px-4 bg-white rounded-b-lg">
        <MediaPreview files={files} onRemove={handleFileRemove} onOpenPDF={handleOpenPDF} />

        <div className="w-full flex items-end justify-between py-4">
          <div className="flex gap-3 sm:gap-4 items-center">
            <Popover>
              <PopoverTrigger>
                <HiOutlineEmojiHappy size={24} className="text-neutral-400 cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-card ml-8">
                <EmojiPicker lazyLoadEmojis className="!w-[325px] " onEmojiClick={handleEmojiClick} />
              </PopoverContent>
            </Popover>
            <label htmlFor="timelinePostImage" className="cursor-pointer inline-block">
              <input
                id="timelinePostImage"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              <GoFileMedia size={24} className="text-neutral-400" />
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
            <Buttons className="w-[70px]" size="medium" disabled={isPending} onClick={handleSubmit}>
              {isPending || isPostCreating ? <Spinner /> : 'Post'}
            </Buttons>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimelineCreatePost
