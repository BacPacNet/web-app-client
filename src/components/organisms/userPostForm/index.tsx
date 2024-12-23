'use client'
import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'
import { EditorState, convertToRaw } from 'draft-js'
//import { Editor } from 'react-draft-wysiwyg'
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

type Props = {
  communityID?: string
  communityGroupID?: string
  type: PostInputType.Community | PostInputType.Timeline
}

const UserPostForm = ({ communityID, communityGroupID, type }: Props) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const valueRef = useRef<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const { mutate: CreateGroupPost, isPending } = useCreateGroupPost()
  const { mutate: CreateTimelinePost } = useCreateUserPost()

  const [postAccessType, setPostAccessType] = useState<CommunityPostType | UserPostType>(UserPostType.PUBLIC)

  const userPostTypeKey = Object.values(UserPostType)
  const communityPostTypeKey = Object.values(CommunityPostType)

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      valueRef.current = textareaRef.current.value
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart
      const text = textareaRef.current.value
      const newText = text.slice(0, cursorPosition) + emoji + text.slice(cursorPosition)

      // Update the textarea value
      textareaRef.current.value = newText
      valueRef.current = newText // Update ref value
      handleInput() // Call input handler to update the ref value

      // Move the cursor to the right of the inserted emoji
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursorPosition + emoji.length

      // Refocus the textarea after emoji insertion
      textareaRef.current.focus()
    }
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
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You can do something with the value here, like an API call
    //if (!textareaRef.current?.value) {
    //  return alert('Please enter')
    //}
    const contentState = editorState.getCurrentContent()
    const rawContent = convertToRaw(contentState)
    console.log(rawContent, 'rawContent')
    const draftHtml = draftToHtml(rawContent)
    console.log(draftHtml, 'draftHtml')
    return handleGroupPost(draftHtml)
  }

  return (
    <div className="rounded-2xl bg-white shadow-card mt-4 p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class font-poppins max-h-40"
            toolbarClassName="toolbar-class"
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

        <div className="flex items-center mt-10 justify-between">
          <div className="flex gap-6 items-center ">
            <Popover>
              <PopoverTrigger>
                <HiOutlineEmojiHappy size={24} className="text-neutral-400" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-lg shadow-gray-light">
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
                />
              )}
            </div>
          </div>
          <div>
            <button onClick={handleSubmit} className="text-xs bg-primary-500 text-white rounded-lg px-4 py-1">
              Post
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
