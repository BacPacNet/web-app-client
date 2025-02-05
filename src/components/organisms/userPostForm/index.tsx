'use client'
import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'
import { EditorState, Modifier, convertToRaw } from 'draft-js'
const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false })
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.css'
import draftToHtml from 'draftjs-to-html'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { MdOutlineGifBox } from 'react-icons/md'
import { GoFileMedia } from 'react-icons/go'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { CommunityPostData, CommunityPostType, PostInputData, PostInputType, UserPostType } from '@/types/constants'
import { RxCrossCircled } from 'react-icons/rx'
import { useCreateUserPost } from '@/services/community-timeline'
import { useCreateGroupPost } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { Spinner } from '@/components/spinner/Spinner'
import { showToast } from '@/components/atoms/CustomToasts/CustomToasts'

type Props = {
  communityID?: string
  communityGroupID?: string
  type: PostInputType.Community | PostInputType.Timeline
}

const UserPostForm = ({ communityID, communityGroupID, type }: Props) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [images, setImages] = useState<File[]>([])
  const { mutate: CreateGroupPost } = useCreateGroupPost()
  const { mutate: CreateTimelinePost, isPending } = useCreateUserPost()
  const [isPostCreating, setIsPostCreating] = useState(false)

  const [postAccessType, setPostAccessType] = useState<CommunityPostType | UserPostType>(UserPostType.PUBLIC)

  const userPostTypeKey = Object.values(UserPostType)
  const communityPostTypeKey = Object.values(CommunityPostType)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji

    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const emojiText = `${emoji} `

    const newContentState = Modifier.insertText(contentState, selectionState, emojiText)

    const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters')
    setEditorState(newEditorState)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setImages((prevImages) => [...prevImages, ...fileArray]) // Store the actual files
    }
  }

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }
  const processImages = async (imagesData: File[]) => {
    const promises = imagesData.map((image) => replaceImage(image, ''))
    const results = await Promise.all(promises)
    return results.map((result) => ({
      imageUrl: result?.imageUrl || null,
      publicId: result?.publicId || null,
    }))
  }

  const handleGroupPost = async (inputValue: string) => {
    setIsPostCreating(true)
    if (images.length) {
      const imagedata = await processImages(images)
      const data: PostInputData = {
        content: inputValue,
        imageUrl: imagedata,
        ...(type == PostInputType.Timeline ? { PostType: postAccessType } : { communityPostsType: postAccessType }),
      }

      //if type is community , add communityId field to data
      if (type === PostInputType.Community) {
        const communityData: CommunityPostData = {
          ...data,
          communityId: communityID,
          ...(communityGroupID && communityGroupID?.length > 0 && { communiyGroupId: communityGroupID }),
        }
        CreateGroupPost(communityData)
      } else if (type === PostInputType.Timeline) {
        CreateTimelinePost(data)
      }
    } else {
      const data: PostInputData = {
        content: inputValue,
        ...(type == PostInputType.Timeline ? { PostType: postAccessType } : { communityPostsType: postAccessType }),
      }

      if (type === PostInputType.Community) {
        const communityData: CommunityPostData = {
          ...data,
          communityId: communityID,
          ...(communityGroupID && communityGroupID?.length > 0 && { communiyGroupId: communityGroupID }),
        }
        CreateGroupPost(communityData)
      } else if (type === PostInputType.Timeline) {
        CreateTimelinePost(data)
      }
    }
    setIsPostCreating(false)
    setEditorState(EditorState.createEmpty())
    setImages([])
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const contentState = editorState.getCurrentContent()
    const rawContent = convertToRaw(contentState)

    if (!rawContent.blocks[0].text && !images.length) {
      return showToast('Enter in Input box to post', { variant: 'warning' })
    }

    const draftHtml = draftToHtml(rawContent)

    return handleGroupPost(draftHtml)
  }
  const onEditorStateChange = (state: React.SetStateAction<EditorState>) => {
    setEditorState(state)
  }

  return (
    <div className="rounded-2xl bg-white shadow-card mt-4 p-4 ">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class font-poppins max-h-40"
            toolbarClassName="toolbar-class -ml-4"
            placeholder="What’s on your mind?"
            toolbar={{
              options: ['inline', 'list', 'textAlign'],
              inline: {
                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
              },
              list: {
                options: ['unordered', 'ordered'],
              },
              textAlign: {
                options: ['left', 'center', 'right'],
              },
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3 sm:gap-4 items-center ">
            <Popover>
              <PopoverTrigger>
                <HiOutlineEmojiHappy size={24} className="text-neutral-400" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-lg shadow-gray-light z-10">
                <div>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              </PopoverContent>
            </Popover>

            <label htmlFor="postGof">
              <MdOutlineGifBox size={24} className="text-neutral-400" />
            </label>
            <label htmlFor="postImage" className="cursor-pointer inline-block">
              <input id="postImage" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} />
              <GoFileMedia size={24} className="text-neutral-400" />
            </label>
            <div className="w-28 max-sm:w-20">
              {type == PostInputType.Community ? (
                <SelectDropdown
                  options={communityPostTypeKey}
                  value={postAccessType}
                  onChange={(e: any) => setPostAccessType(e)}
                  placeholder=""
                  icon={'single'}
                  // search={true}
                  err={false}
                  showIcon={true}
                  isAllowedToRemove={false}
                />
              ) : (
                <SelectDropdown
                  options={userPostTypeKey}
                  value={postAccessType}
                  onChange={(e: any) => setPostAccessType(e)}
                  placeholder=""
                  icon={'single'}
                  // search={true}
                  err={false}
                  showIcon={true}
                  isAllowedToRemove={false}
                />
              )}
            </div>
          </div>
          <div>
            <button disabled={isPending} onClick={handleSubmit} className="text-xs bg-primary-500 text-white rounded-lg px-4 py-1">
              {isPending || isPostCreating ? <Spinner /> : 'Post'}
            </button>
          </div>
        </div>
        {/* Display selected images */}
        <div className="flex flex-wrap gap-4 ">
          {images.map((image, index) => (
            <div key={index} className="relative w-fit">
              <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
              {/* Remove image button */}
              <div onClick={() => handleImageRemove(index)} className="absolute top-1 right-1 cursor-pointer text-sm">
                <RxCrossCircled />
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}

export default UserPostForm
