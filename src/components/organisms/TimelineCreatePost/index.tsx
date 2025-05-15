import Buttons from '@/components/atoms/Buttons'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { Spinner } from '@/components/spinner/Spinner'
import { cleanInnerHTML, validateUploadedFiles } from '@/lib/utils'
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

type FileWithId = {
  id: string
  file: File
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
    if (!quillInstance || quillInstance.getText().trim().length === 0) return

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
      if (files.length) {
        const response = await uploadtoS3(files.map((f) => f.file))
        payload.imageUrl = response.data
      }
      await CreateTimelinePost(payload)
      resetPostContent()
    } catch (err) {
      console.error('Error creating post:', err)
    } finally {
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
        getQuillInstance={setQuillInstance}
        placeholder="What`s on your mind?"
      />
      <div className="w-full px-4 bg-white rounded-b-lg">
        <MediaPreview files={files} onRemove={handleFileRemove} onOpenPDF={handleOpenPDF} />

        <div className="w-full flex items-end justify-between py-4">
          <div className="flex gap-3 sm:gap-4 items-center">
            <label htmlFor="timelinePostImage" className="cursor-pointer inline-block">
              <input
                id="timelinePostImage"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />
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
            <SelectDropdown
              options={Object.values(UserPostTypeOption)}
              value={postAccessType}
              onChange={(e: any) => setPostAccessType(e)}
              placeholder="Visibility"
              icon="single"
              err={false}
              showIcon={true}
              isAllowedToRemove={false}
              variant="primary"
            />
            <Buttons className="w-[70px]" size="small" disabled={isPending} onClick={handleSubmit}>
              {isPending || isPostCreating ? <Spinner /> : 'Post'}
            </Buttons>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimelineCreatePost
