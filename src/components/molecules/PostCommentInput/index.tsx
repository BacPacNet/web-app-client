'use client'
import React, { useRef, useState } from 'react'
import { GoFileMedia } from 'react-icons/go'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { MdOutlineGifBox } from 'react-icons/md'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { PostCommentData, PostType } from '@/types/constants'
import { useCreateGroupPostComment, useCreateGroupPostCommentReply } from '@/services/community-university'
import { useCreateUserPostComment, useCreateUserPostCommentReply } from '@/services/community-timeline'
import { replaceImage } from '@/services/uploadImage'

type props = {
  postID?: string
  type: PostType.Community | PostType.Timeline
  isSinglePost?: boolean
  adminID: string
  isReply: boolean
  isNested?: boolean
  commentId?: string
  commenterProfileId: string
  level: string
  setNewPost: (value: boolean) => void
}

function PostCommentInput({
  postID,
  type,
  isSinglePost,
  adminID,
  isReply,
  commentId,
  commenterProfileId,
  level,
  isNested = false,
  setNewPost,
}: props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const valueRef = useRef<string>('')
  const [images, setImages] = useState<File[]>([])
  const { mutate: CreateGroupPostComment, isPending: CreateGroupPostCommentLoading } = useCreateGroupPostComment(isSinglePost ? isSinglePost : false)
  const { mutate: CreateUserPostComment, isPending: CreateUserPostCommentLoading } = useCreateUserPostComment(isSinglePost ? isSinglePost : false)
  const { mutate: CreateUserPostCommentReply, isPending: CreateUserPostCommentReplyLoading } = useCreateUserPostCommentReply(
    isSinglePost ? isSinglePost : false,
    isNested,
    type
  )
  const { mutate: CreateGroupPostCommentReply, isPending: useCreateGroupPostCommentReplyLoading } = useCreateGroupPostCommentReply(
    isSinglePost ? isSinglePost : false,
    isNested,
    type
  )

  const [ImageValue, setImageValue] = useState<File | null>(null)

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      valueRef.current = textareaRef.current.value
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }
  // Handle emoji click
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

  const handlePostComment = async (comment: string) => {
    if (comment.length <= 1) {
      return console.log('Please type something to comment!')
    }
    if (ImageValue) {
      const imagedata: any = await replaceImage(ImageValue, '')

      const data: PostCommentData = {
        postID: postID,
        content: comment,
        imageUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId },
        commenterProfileId,
      }

      if (type === PostType.Timeline) {
        if (isReply) {
          const replyData = {
            commentId: commentId,
            content: comment,
            commenterProfileId,
            level,
          }
        } else {
          CreateUserPostComment(data)
        }
      } else if (type === PostType.Community) {
        data.adminId = adminID
        CreateGroupPostComment(data)
      }
    } else {
      const data: PostCommentData = {
        postID: postID,
        content: comment,
        commenterProfileId,
      }

      if (type === PostType.Timeline) {
        if (isReply) {
          const replyData = {
            commentId: commentId,
            content: comment,
            commenterProfileId,
            level,
          }
          CreateUserPostCommentReply(replyData)
        } else {
          CreateUserPostComment(data)
        }
      } else if (type === PostType.Community) {
        data.adminId = adminID
        if (isReply) {
          const replyData = {
            commentId: commentId,
            content: comment,
            commenterProfileId,
            level,
          }
          CreateGroupPostCommentReply(replyData)
        } else {
          CreateGroupPostComment(data)
        }
      }
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You can do something with the value here, like an API call
    handlePostComment(valueRef.current)
    setNewPost(false)
  }
  return (
    <div className="rounded-2xl bg-white w-full">
      <div className="border-2 border-neutral-300 w-full rounded-lg px-1">
        <div className="flex gap-3 h-24">
          <textarea
            ref={textareaRef}
            className="w-full p-2 border-none resize-none focus:outline-none max-h-32 overflow-y-auto"
            placeholder="What’s on your mind?"
            rows={1}
            onInput={handleInput}
          ></textarea>
        </div>
        <div className="flex items-center justify-between px-2 py-5 relative">
          <div className="absolute right-2 bottom-3">
            <button onClick={handleSubmit} className="bg-primary-500 text-white rounded-lg px-3 py-2 w-[69px] ">
              Post
            </button>
          </div>
          <div className="flex gap-4 items-center ">
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
          </div>
        </div>
      </div>

      {/* Display selected images */}
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
            {/* Remove image button */}
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 opacity-75 px-1 rounded-sm text-white text-2xs"
              onClick={() => handleImageRemove(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostCommentInput
