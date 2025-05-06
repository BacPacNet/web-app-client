import Buttons from '@/components/atoms/Buttons'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { Spinner } from '@/components/spinner/Spinner'
import { cleanInnerHTML, formatFileSize, validateUploadedFiles } from '@/lib/utils'
import { useCreateUserPost } from '@/services/community-timeline'
import { replaceImage } from '@/services/uploadImage'
import { CommunityPostType, PostInputData, PostInputType, PostTypeOption, UserPostTypeOption } from '@/types/constants'
import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef, useState } from 'react'
import { FiFile, FiFileText, FiImage } from 'react-icons/fi'
import { GoFileMedia } from 'react-icons/go'
import { RxCrossCircled } from 'react-icons/rx'

const Editor = dynamic(() => import('@components/molecules/Editor/QuillRichTextEditor'), {
  ssr: false,
})

function TimelineCreatePost() {
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null)
  const quillRef = useRef<Quill | null>(null)
  const quillHTMLState = useRef(null)
  const [images, setImages] = useState<File[]>([])
  const [postAccessType, setPostAccessType] = useState<CommunityPostType | UserPostTypeOption>(UserPostTypeOption.PUBLIC)
  const { mutate: CreateTimelinePost, isPending } = useCreateUserPost()
  const [isPostCreating, setIsPostCreating] = useState(false)

  // Add this utility function to your utils file
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FiImage className="text-blue-500" size={24} />
    }
    switch (fileType) {
      case 'application/pdf':
        return <FiFileText className="text-primary-500" size={24} />
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return <FiFile className="text-primary-500" size={24} />
      default:
        return <FiFile className="text-primary-500" size={24} />
    }
  }

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
      const validation = validateUploadedFiles(fileArray)
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

    const payload: PostInputData = {
      content: cleanInnerHTML(quillHTMLState.current!),
      PostType: PostTypeOption[postAccessType as never],
    }
    if (images.length) {
      const imagedata = await processImages(images)
      payload.imageUrl = imagedata
    }

    CreateTimelinePost(payload)
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
        getQuillInstance={setQuillInstance}
        placeholder="What`s on your mind?"
      />
      <div className="w-full px-4 bg-white rounded-b-lg ">
        <div className={`${images ? 'flex flex-wrap gap-4 items-end' : 'm-0'}`}>
          {images.map((file, index) => (
            <div key={index} className="relative w-fit group">
              {file.type.startsWith('image/') ? (
                // Image preview
                <div className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
                </div>
              ) : (
                // Document preview card
                <div className="w-40 p-3 bg-surface-primary-50 rounded-lg border border-primary-500 flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div className="truncate flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              )}
              {/* Remove button */}
              <button
                onClick={() => handleImageRemove(index)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors"
                aria-label="Remove file"
              >
                <RxCrossCircled className="text-red-500" size={18} />
              </button>
            </div>
          ))}

          {/*{images.map((image, index) => (
            <div key={index} className="relative w-fit">
              <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
      
              <div onClick={() => handleImageRemove(index)} className="absolute -top-1 -right-1 cursor-pointer text-sm">
                <MdCancel size={24} className="text-destructive-600 bg-white rounded-full" />
              </div>
            </div>
          ))}*/}
        </div>
        <div className="w-full flex items-end justify-between py-4">
          <div className="flex gap-3 sm:gap-4 items-center ">
            <label htmlFor="timelinePostImage" className="cursor-pointer inline-block">
              <input
                id="timelinePostImage"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/mswordvalidateImageFiles"
                className="hidden"
                onChange={(e) => handleImageChange(e)}
              />
              <GoFileMedia size={24} className="text-neutral-400" />
            </label>
          </div>
          <div className="flex gap-2 h-10">
            <SelectDropdown
              options={Object.values(UserPostTypeOption)}
              value={postAccessType}
              onChange={(e: any) => setPostAccessType(e)}
              placeholder="Visibility"
              icon={'single'}
              // search={true}
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
