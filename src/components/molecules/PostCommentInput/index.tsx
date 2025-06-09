//'use client'
//import React, { useRef, useState } from 'react'
//import { GoFileMedia } from 'react-icons/go'
//import { HiOutlineEmojiHappy } from 'react-icons/hi'
//import { MdOutlineGifBox } from 'react-icons/md'
//import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
//import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
//import { PostCommentData, PostType } from '@/types/constants'
//import { useCreateGroupPostComment, useCreateGroupPostCommentReply } from '@/services/community-university'
//import { useCreateUserPostComment, useCreateUserPostCommentReply } from '@/services/community-timeline'
//import { showToast } from '@/components/atoms/CustomToasts/CustomToasts'
//import { EditorState, Modifier, convertToRaw } from 'draft-js'
//import './index.css'
//import draftToHtml from 'draftjs-to-html'
//const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false })
//import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
//import dynamic from 'next/dynamic'
//import { useUploadToS3 } from '@/services/upload'
//import { UPLOAD_CONTEXT } from '@/types/Uploads'

//type props = {
//  postID?: string
//  type: PostType.Community | PostType.Timeline
//  isSinglePost?: boolean
//  adminID: string
//  isReply: boolean
//  isNested?: boolean
//  commentId?: string
//  commenterProfileId: string
//  level: number
//  setNewPost: (value: boolean) => void
//}

//function PostCommentInput({
//  postID,
//  type,
//  isSinglePost,
//  adminID,
//  isReply,
//  commentId,
//  commenterProfileId,
//  level,
//  isNested = false,
//  setNewPost,
//}: props) {
//  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
//  const { mutateAsync: uploadToS3 } = useUploadToS3()
//  const valueRef = useRef<string>('')
//  const [images, setImages] = useState<File[]>([])
//  const { mutate: CreateGroupPostComment, isPending: CreateGroupPostCommentLoading } = useCreateGroupPostComment(isSinglePost ? isSinglePost : false, )
//  const { mutate: CreateUserPostComment, isPending: CreateUserPostCommentLoading } = useCreateUserPostComment(isSinglePost ? isSinglePost : false)
//  const { mutate: CreateUserPostCommentReply, isPending: CreateUserPostCommentReplyLoading } = useCreateUserPostCommentReply(
//    isSinglePost ? isSinglePost : false,
//    isNested,
//    type,
//    false,
//    ''
//  )
//  const { mutate: CreateGroupPostCommentReply, isPending: useCreateGroupPostCommentReplyLoading } = useCreateGroupPostCommentReply(
//    isSinglePost ? isSinglePost : false,
//    isNested,
//    type,
//    false,
//    ''
//  )

//  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//    const files = e.target.files
//    if (files) {
//      const fileArray = Array.from(files)
//      setImages((prevImages) => [...prevImages, ...fileArray]) // Store the actual files
//    }
//  }

//  const handleImageRemove = (index: number) => {
//    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
//  }

//  const onEditorStateChange = (state: React.SetStateAction<EditorState>) => {
//    setEditorState(state)
//  }

//  const handlePostComment = async (comment: string) => {
//    // if (comment.length <= 1) {
//    //   return console.log('Please type something to comment!')
//    // }

//    const contentState = editorState.getCurrentContent()
//    const rawContent = convertToRaw(contentState)

//    if (!rawContent.blocks[0].text && !images.length) {
//      return showToast('Enter in Input box to post', { variant: 'warning' })
//    }

//    const draftHtml = draftToHtml(rawContent)

//    if (!rawContent.blocks[0].text && !images.length) {
//      return showToast('Enter in Input box to post', { variant: 'warning' })
//    }

//    // if (ImageValue) {
//    //   const imagedata: any = await replaceImage(ImageValue, '')

//    //   const data: PostCommentData = {
//    //     postID: postID,
//    //     content: comment,
//    //     imageUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId },
//    //     commenterProfileId,
//    //   }

//    if (images.length) {
//      const uploadPayload = {
//        files: images,
//        context: UPLOAD_CONTEXT.POST_COMMENT,
//      }
//      const imagedata = await uploadToS3(uploadPayload)
//      const data: PostCommentData = {
//        content: draftHtml,
//        imageUrl: imagedata.data,
//        commenterProfileId,
//        postID: postID,
//      }

//      if (type === PostType.Timeline) {
//        if (isReply) {
//          const replyData = {
//            commentId: commentId,
//            content: draftHtml,
//            commenterProfileId,
//            level,
//          }
//        } else {
//          CreateUserPostComment(data)
//        }
//      } else if (type === PostType.Community) {
//        data.adminId = adminID
//        CreateGroupPostComment(data)
//      }
//    } else {
//      const data: PostCommentData = {
//        postID: postID,
//        content: draftHtml,
//        commenterProfileId,
//      }

//      if (type === PostType.Timeline) {
//        if (isReply) {
//          const replyData = {
//            commentId: commentId,
//            content: draftHtml,
//            commenterProfileId,
//            level,
//          }
//          CreateUserPostCommentReply(replyData)
//        } else {
//          CreateUserPostComment(data)
//        }
//      } else if (type === PostType.Community) {
//        data.adminId = adminID
//        if (isReply) {
//          const replyData = {
//            commentId: commentId,
//            content: draftHtml,
//            commenterProfileId,
//            level,
//          }
//          CreateGroupPostCommentReply(replyData)
//        } else {
//          CreateGroupPostComment(data)
//        }
//      }
//    }
//  }

//  // Handle form submission
//  const handleSubmit = (e: React.FormEvent) => {
//    e.preventDefault()
//    handlePostComment(valueRef.current)
//    setNewPost(false)
//  }

//  const handleEmojiClick = (emojiData: EmojiClickData) => {
//    const emoji = emojiData.emoji

//    const contentState = editorState.getCurrentContent()
//    const selectionState = editorState.getSelection()
//    const emojiText = `${emoji} `

//    const newContentState = Modifier.insertText(contentState, selectionState, emojiText)

//    const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters')
//    setEditorState(newEditorState)
//  }

//  return (
//    <div className="rounded-2xl bg-white w-full ">
//      <div className=" flex flex-col  w-full rounded-lg ">
//        <div className="flex gap-3  w-full mb-10">
//          <Editor
//            editorState={editorState}
//            onEditorStateChange={onEditorStateChange}
//            wrapperClassName="wrapper-class w-full  p-0 m-0"
//            editorClassName="editor-class font-poppins "
//            toolbarClassName="toolbar-class -ml-3"
//            placeholder="What’s on your mind?"
//            toolbar={{
//              options: ['inline', 'list', 'textAlign'],
//              inline: {
//                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
//              },
//              list: {
//                options: ['unordered', 'ordered'],
//              },
//              textAlign: {
//                options: ['left', 'center', 'right'],
//              },
//            }}
//          />
//          {/* <textarea
//            ref={textareaRef}
//            className="w-full p-2 border-none resize-none focus:outline-none max-h-32 overflow-y-auto"
//            placeholder="What’s on your mind?"
//            rows={1}
//            onInput={handleInput}
//          ></textarea> */}
//        </div>
//        <div className="flex items-center justify-between ">
//          <div className="flex gap-4 items-center ">
//            <Popover>
//              <PopoverTrigger>
//                <HiOutlineEmojiHappy size={24} className="text-neutral-400" />
//              </PopoverTrigger>
//              <PopoverContent className="w-auto p-0 border-none shadow-lg shadow-gray-light">
//                <div>
//                  <EmojiPicker onEmojiClick={handleEmojiClick} />
//                </div>
//              </PopoverContent>
//            </Popover>

//            <label htmlFor="postGof">
//              <MdOutlineGifBox size={24} className="text-neutral-400" />
//            </label>
//            <label htmlFor="commentImage" className="cursor-pointer inline-block">
//              <input
//                id="commentImage"
//                type="file"
//                accept="image/jpeg,image/png,image/jpg,image/gif"
//                className="hidden"
//                onChange={(e) => handleImageChange(e)}
//              />
//              <GoFileMedia size={24} className="text-neutral-400" />
//            </label>
//          </div>
//          <div className=" ">
//            <button onClick={handleSubmit} className="bg-primary-500 text-white rounded-lg  w-[69px] h-10">
//              Post
//            </button>
//          </div>
//        </div>
//      </div>

//      {/* Display selected images */}
//      <div className="flex flex-wrap gap-2">
//        {images.map((image, index) => (
//          <div key={index} className="relative">
//            <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
//            {/* Remove image button */}
//            <button
//              type="button"
//              className="absolute top-0 right-0 bg-red-500 opacity-75 px-1 rounded-sm text-white text-2xs"
//              onClick={() => handleImageRemove(index)}
//            >
//              X
//            </button>
//          </div>
//        ))}
//      </div>
//    </div>
//  )
//}

//export default PostCommentInput
