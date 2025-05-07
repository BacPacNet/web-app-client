import Image from 'next/image'
import React, { useRef, useState } from 'react'
import avatar from '@assets/avatar.svg'
import { useUniStore } from '@/store/store'
import { PostCommentData, PostType } from '@/types/constants'
import Quill from 'quill'
import { GoFileMedia } from 'react-icons/go'
import Buttons from '@/components/atoms/Buttons'
import { replaceImage } from '@/services/uploadImage'
import { cleanInnerHTML, validateImageFiles } from '@/lib/utils'
import { useCreateUserPostComment, useCreateUserPostCommentReply } from '@/services/community-timeline'
import { useCreateGroupPostComment, useCreateGroupPostCommentReply } from '@/services/community-university'
import { Spinner } from '@/components/spinner/Spinner'
import dynamic from 'next/dynamic'
import { MdCancel } from 'react-icons/md'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'

const Editor = dynamic(() => import('@components/molecules/Editor/QuillRichTextEditor'), {
  ssr: false,
})

type Props = {
  setNewPost: (value: boolean) => void
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
  postId?: string
  isReply: boolean
  isNested?: boolean
}

const NewPostComment = ({ setNewPost, data, postId, postType }: Props) => {
  const quillHTMLState = useRef(null)
  const quillRef = useRef<Quill | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: mutateUserPostComment, isPending: isUserPostCommentPending } = useCreateUserPostComment(false)
  const { mutate: mutateGroupPostComment, isPending: isGroupPostCommentPending } = useCreateGroupPostComment(false)
  const { mutate: CreateUserPostCommentReply, isPending: CreateUserPostCommentReplyLoading } = useCreateUserPostCommentReply(
    false,
    // isNested,
    true,
    postType
  )
  const { mutate: CreateGroupPostCommentReply, isPending: useCreateGroupPostCommentReplyLoading } = useCreateGroupPostCommentReply(
    false,
    //   isNested,
    true,
    postType
  )
  const { userProfileData } = useUniStore()
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null)

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
      const validation = validateImageFiles(fileArray)
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
    setIsLoading(true)
    // Default data structure for the comment
    const payload: PostCommentData = {
      content: cleanInnerHTML(quillHTMLState.current!),
      commenterProfileId: userProfileData?._id || '',
      postID: postId,
    }

    // If images exist, process them
    if (images.length) {
      const imageData = await processImages(images)
      payload.imageUrl = imageData // Add image URL to the data
    }

    // Handle different post types (Timeline or Community)
    if (postType === PostType.Timeline) {
      if (Number(data?.level) == 0) {
        payload.level = 0
        payload.commentId = data?.commentId

        CreateUserPostCommentReply(payload)
      } else {
        mutateUserPostComment(payload)
      }
    } else if (postType === PostType.Community) {
      if (Number(data?.level) == 0) {
        payload.level = 0
        payload.commentId = data?.commentId

        CreateGroupPostCommentReply(payload)
      } else {
        payload.adminId = data.adminId

        mutateGroupPostComment(payload)
      }

      //  if (data.adminId) {
      //    payload.adminId = data.adminId
      //  }
      //  mutateGroupPostComment(data)
    }
    resetPostContent()
    setNewPost(false)
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

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  React.useEffect(() => {
    if (quillInstance) {
      quillInstance.focus()
    }
  }, [quillInstance])

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
            <div className={`${images ? 'flex flex-wrap gap-4' : 'hidden'}`}>
              {images.map((image, index) => (
                <div key={index} className="relative w-fit">
                  <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
                  {/* Remove image button */}
                  <div onClick={() => handleImageRemove(index)} className="absolute -top-1 -right-1 cursor-pointer text-sm">
                    <MdCancel size={24} className="text-destructive-600 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-3 sm:gap-4 items-center ">
                <label htmlFor="postCommentImage" className="cursor-pointer inline-block">
                  <input id="postCommentImage" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} />
                  <GoFileMedia size={24} className="text-neutral-400" />
                </label>
              </div>
              <div className="flex gap-2 h-10">
                <Buttons className="w-[70px]" size="small" disabled={isLoading} onClick={handleSubmit}>
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
