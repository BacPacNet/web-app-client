import Image from 'next/image'
import React, { useRef, useState } from 'react'
import avatar from '@assets/avatar.svg'
import { useUniStore } from '@/store/store'
import { PostCommentData, PostType } from '@/types/constants'
import Quill from 'quill'
import { GoFileMedia } from 'react-icons/go'
import Buttons from '@/components/atoms/Buttons'
import { cleanInnerHTML, generateFileId, validateImageFiles, validateUploadedFiles } from '@/lib/utils'
import { useCreateUserPostComment, useCreateUserPostCommentReply } from '@/services/community-timeline'
import { useCreateGroupPostComment, useCreateGroupPostCommentReply } from '@/services/community-university'
import { Spinner } from '@/components/spinner/Spinner'
import dynamic from 'next/dynamic'
import { MdCancel } from 'react-icons/md'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { useUploadToS3 } from '@/services/upload'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { FileWithId, UPLOAD_CONTEXT } from '@/types/Uploads'
import { Sortby } from '@/types/common'
import { TbFileUpload } from 'react-icons/tb'
import CommentPreview from '../CommentMediaPreview'

const Editor = dynamic(() => import('@components/molecules/Editor/QuillRichTextEditor'), {
  ssr: false,
})

type Props = {
  setNewPost: (value: boolean) => void
  setShowCommentSection: (value: string) => void
  showInitial: boolean
  postType: PostType.Community | PostType.Timeline
  data: {
    user: string
    avatarLink: string
    date: string
    university: string
    year: string
    text: string
    adminId: string
    commentId?: string
    level?: string
  }
  postId: string
  isReply: boolean
  isNested?: boolean
  expandCommentSection?: (id: string) => void
  sortBy?: Sortby | null
  communityId?: string
  communityGroupId?: string
}

const NewPostComment = ({
  setNewPost,
  data,
  postId,
  postType,
  setShowCommentSection,
  showInitial,
  expandCommentSection,
  sortBy = null,
  communityId,
  communityGroupId,
}: Props) => {
  const quillHTMLState = useRef(null)
  const quillRef = useRef<Quill | null>(null)
  //   const [images, setImages] = useState<File[]>([])
  const [files, setFiles] = useState<FileWithId[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: mutateUserPostComment, isPending: isUserPostCommentPending } = useCreateUserPostComment(false, postId, sortBy && sortBy)
  const { mutateAsync: mutateGroupPostComment, isPending: isGroupPostCommentPending } = useCreateGroupPostComment(
    false,
    postId,
    sortBy && sortBy,
    communityId || '',
    communityGroupId || ''
  )
  const { mutateAsync: CreateUserPostCommentReply, isPending: CreateUserPostCommentReplyLoading } = useCreateUserPostCommentReply(
    false,
    true,
    postType,
    showInitial,
    postId,
    sortBy && sortBy
  )
  const { mutate: CreateGroupPostCommentReply, isPending: useCreateGroupPostCommentReplyLoading } = useCreateGroupPostCommentReply(
    false,
    //   isNested,
    true,
    postType,
    showInitial,
    postId,
    sortBy && sortBy,
    communityId || '',
    communityGroupId || ''
  )
  const { userProfileData } = useUniStore()
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null)
  const { mutateAsync: uploadToS3 } = useUploadToS3()

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
    const plainText = quillInstance?.getText().trim()
    const hasText = !!plainText && plainText.length > 0
    const hasFiles = files.length > 0

    if (!hasText && !hasFiles) {
      showCustomDangerToast('Post must contain text or at least one file.')
      return
    }
    setIsLoading(true)
    // Default data structure for the comment
    const payload: PostCommentData = {
      content: cleanInnerHTML(quillHTMLState.current!),
      commenterProfileId: userProfileData?._id || '',
      postID: postId,
    }

    // If images exist, process them
    if (hasFiles) {
      const uploadPayload = {
        files: files.map((f) => f.file),
        context: UPLOAD_CONTEXT.POST_COMMENT,
      }
      const response = await uploadToS3(uploadPayload)
      payload.imageUrl = response.data
    }

    // Handle different post types (Timeline or Community)
    if (postType === PostType.Timeline) {
      if (Number(data?.level) == 0) {
        payload.level = 0
        payload.commentId = data?.commentId

        CreateUserPostCommentReply(payload)
      } else {
        mutateUserPostComment(payload)
        if (showInitial && postId) {
          setShowCommentSection(postId)
        }
      }
    } else if (postType === PostType.Community) {
      if (Number(data?.level) == 0) {
        payload.level = 0
        payload.commentId = data?.commentId

        CreateGroupPostCommentReply(payload)
      } else {
        payload.adminId = data.adminId
        mutateGroupPostComment(payload)
        if (showInitial && postId) {
          setShowCommentSection(postId)
        }
      }

      //  if (data.adminId) {
      //    payload.adminId = data.adminId
      //  }
      //  mutateGroupPostComment(data)
    }
    resetPostContent()
    setNewPost(false)
    expandCommentSection && expandCommentSection(payload.commentId as string)
    setIsLoading(false)

    //const payload: CommunityPostData = {
    //  content: cleanInnerHTML(quillHTMLState.current!),
    //  communityPostsType: PostTypeOption[postAccessType as never],
    //  communityId: communityId,
    //  communityGroupId: communityGroupId || null,
    //  isPostVerified: userProfileData?.email?.some((community) => community.communityId === communityId) || false,
    //}
    //if (images.length) {
    //  const imagedata = await processImages(images)
    //  payload.imageUrl = imagedata
    //}
    //CreateGroupPost(payload)
    //resetPostContent()
  }

  const handleFileRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  React.useEffect(() => {
    if (quillInstance) {
      quillInstance.focus()
    }
  }, [quillInstance])

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (!quillInstance) return

    const editor = quillInstance

    // Focus the editor
    editor.focus()

    // Get the current selection (after focusing)
    const range = editor.getSelection()

    // Fallback: insert at end of text if no selection
    const position = range?.index ?? editor.getLength()

    editor.insertText(position, emojiData.emoji, 'user')
    editor.setSelection(position + emojiData.emoji.length, 0)
  }

  return (
    <>
      <div onClick={() => setNewPost(false)} className="fixed w-full h-[100%] top-0 left-0 bg-black opacity-50 z-50"></div>
      <div className="absolute min-w-[343px] w-10/12 md:w-[616px] max-h-[75%] top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] z-50 bg-white px-4 py-4 rounded-lg ">
        <div className="flex items-center gap-3">
          <Image src={data?.avatarLink || avatar} width={24} height={24} objectFit="cover" className="rounded-full w-6 h-6" alt="avatar.png" />
          <p className=" text-sm text-neutral-400">{'Replying to ' + data?.user}</p>

          {/*<p className="ml-auto text-xs text-gray">{data?.date && dayjs(new Date(data?.date).toString()).format('h:mm A · MMM D, YYYY')}</p>*/}
        </div>
        <div className="pt-4 w-full">
          <Editor
            onTextChange={(innerHTML) => (quillHTMLState.current = innerHTML)}
            ref={quillRef}
            type={postType as any}
            getQuillInstance={setQuillInstance}
            placeholder="What`s on your mind?"
          />
          <div className="w-full bg-white rounded-b-lg">
            <CommentPreview files={files} onRemove={(id: string | number) => handleFileRemove(id as string)} />
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-3 sm:gap-4 items-center ">
                <Popover>
                  <PopoverTrigger>
                    <HiOutlineEmojiHappy size={24} className="text-neutral-400 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-card ml-8">
                    <EmojiPicker lazyLoadEmojis className="!w-[325px] " onEmojiClick={handleEmojiClick} />
                  </PopoverContent>
                </Popover>
                <label htmlFor="postCommentImage" className="cursor-pointer inline-block">
                  <input
                    id="postCommentImage"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <GoFileMedia size={24} className="text-neutral-400" />
                </label>
                <label htmlFor="postCommentFile" className="cursor-pointer inline-block">
                  <input
                    id="postCommentFile"
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
                <Buttons className="w-[70px]" size="large" disabled={isLoading} onClick={handleSubmit}>
                  {isUserPostCommentPending || isGroupPostCommentPending ? <Spinner /> : 'Post'}
                </Buttons>
              </div>
            </div>
          </div>
          {/*<Image
            src={userProfileData?.profile_dp?.imageUrl || avatar}
            width={56}
            height={56}
            className="rounded-full w-12 h-12 object-cover flex-none"
            alt="avatar.png"
          />*/}
          {/*<div className="w-full">
            <PostCommentInput
              setNewPost={setNewPost}
              adminID={data.adminId}
              postID={postId}
              commenterProfileId={userProfileData?._id || ''}
              commentId={data.commentId}
              type={data.type}
              isReply={isReply}
              level={data.level ?? ''}
              isNested={isNested}
            />
          </div>*/}
        </div>
      </div>
    </>
  )
}

export default NewPostComment
