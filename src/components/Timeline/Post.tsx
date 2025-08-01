// /* eslint-disable @next/next/no-img-element */
// // components/Post.tsx
// import React, { useState } from 'react'
// import { FaComment } from 'react-icons/fa'
// import { IoPaperPlaneSharp } from 'react-icons/io5'
// // import Image from 'next/image'
// import { SlOptions } from 'react-icons/sl'
// import { FaBookmark } from 'react-icons/fa6'
// // import { MdOutlineImage } from 'react-icons/md'
// import { MdGifBox, MdOutlineBookmarkBorder } from 'react-icons/md'
// import { HiReply, HiOutlineBell, HiOutlineFlag } from 'react-icons/hi'
// import { MdOutlineOpenInNew } from 'react-icons/md'
// import { BiRepost } from 'react-icons/bi'
// import { ModalContentType } from '@/types/global'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
// import {
//   WhatsappIcon,
//   FacebookIcon,
//   LinkedinIcon,
//   TwitterIcon,
//   WhatsappShareButton,
//   FacebookShareButton,
//   LinkedinShareButton,
//   TwitterShareButton,
// } from 'react-share'
// import { IoMdCode } from 'react-icons/io'
// import { AiOutlineLike } from 'react-icons/ai'
// import { useCreateGroupPostComment, useLikeUnilikeGroupPost, useLikeUnlikeGroupPostComment } from '@/services/community-university'
// import { useLikeUnlikeTimelinePost, useCreateUserPostComment, useLikeUnlikeUserPostComment } from '@/services/community-timeline'
// import { useUniStore } from '@/store/store'
// import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime'
// import { replaceImage } from '@/services/uploadImage'
// import { PostCommentData, PostType } from '@/types/constants'
// import Link from 'next/link'
// import { Spinner } from '../spinner/Spinner'

// dayjs.extend(relativeTime)

// interface Like {
//   userId: string
// }

// interface PostProps {
//   user: string
//   university: string
//   year: string
//   text: string
//   link?: string
//   date: string
//   avatar: string
//   likes: Like[]
//   comments: number
//   reposts: number
//   shares: number
//   userComments: any
//   setModalContentType: React.Dispatch<React.SetStateAction<ModalContentType>>
//   setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
//   isUserProfile?: boolean
//   media?: []
//   saved?: boolean
//   isUniversity?: boolean
//   postID: string
//   profileDp?: string
//   adminId: string
//   type: PostType
//   isType: string
//   isSinglePost?: boolean
// }

// interface PostOptionType {
//   postID: string
//   isType: string
// }

// const PostOptions = ({ postID, isType }: PostOptionType) => {
//   return (
//     <Popover>
//       <PopoverTrigger>
//         <SlOptions />
//       </PopoverTrigger>
//       <PopoverContent className="relative right-16 bottom-16 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
//         <div className="flex flex-col gap-5">
//           <div className="flex gap-1 items-center">
//             <Link className="flex gap-1 items-center" href={`/post/${postID}?isType=${isType}`}>
//               <MdOutlineOpenInNew className="text-primary" size={20} />
//               <p className="font-medium text-sm">Open Post</p>
//             </Link>
//           </div>
//           <div className="flex gap-1 items-center">
//             <MdOutlineBookmarkBorder className="text-primary" size={20} />
//             <p className="font-medium text-sm">Save Post</p>
//           </div>
//           <div className="flex gap-1 items-center">
//             <HiOutlineBell className="text-primary" size={20} />
//             <p className="font-medium text-sm">Mute Post from</p>
//           </div>
//           <div className="flex gap-1 items-center">
//             <HiOutlineFlag className="text-primary" size={20} />
//             <p className="font-medium text-sm">Report this Post</p>
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }

// const SharePopup = () => {
//   return (
//     <div>
//       <h1 className="font-semibold text-gray-dark mb-3">Share</h1>
//       <div className="flex gap-4">
//         <div>
//           <div className="bg-primary p-3 rounded-full">
//             <IoMdCode className="text-white self-center" size={40} />
//           </div>
//           <p className="text-center text-xs text-gray-dark mt-[6px] font-medium">Embed</p>
//         </div>
//         {/* <p className='text-sm text-gray-dark'>Embed</p> */}
//         <div>
//           <WhatsappShareButton url={window.location.href}>
//             <WhatsappIcon size={64} round />
//           </WhatsappShareButton>
//           <p className="text-center text-xs text-gray-dark font-medium">Whatsapp</p>
//         </div>
//         <div>
//           <FacebookShareButton url={window.location.href}>
//             <FacebookIcon size={64} round />
//           </FacebookShareButton>
//           <p className="text-center text-xs text-gray-dark font-medium">Facebook</p>
//         </div>
//         <div>
//           <LinkedinShareButton url={window.location.href}>
//             <LinkedinIcon size={64} round />
//           </LinkedinShareButton>
//           <p className="text-center text-xs text-gray-dark font-medium">Linkedin</p>
//         </div>
//         <div>
//           <TwitterShareButton url={window.location.href}>
//             <TwitterIcon size={64} round />
//           </TwitterShareButton>
//           <p className="text-center text-xs text-gray-dark font-medium">Twitter</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3 border-2 border-primary mt-6 rounded-full py-2 px-5">
//         <p className="text-[#A3A3A3] text-sm">{window.location.href}</p>
//         <button className="text-white bg-primary px-3 py-2 rounded-full text-xs font-medium">Copy</button>
//       </div>
//     </div>
//   )
// }

// const Post: React.FC<PostProps> = ({
//   user,
//   university,
//   year,
//   text,
//   link,
//   date,
//   avatar,
//   likes,
//   comments,
//   reposts,
//   userComments,
//   setIsModalOpen,
//   setModalContentType,
//   isUserProfile,
//   media,
//   saved,
//   isUniversity,
//   postID,
//   profileDp,
//   adminId,
//   type,
//   isType,
//   isSinglePost,
// }) => {
//   const { mutate: LikeUnlikeGroupPost } = useLikeUnilikeGroupPost()
//   const { mutate: LikeUnlikeTimelinePost } = useLikeUnlikeTimelinePost()
//   const { mutate: CreateGroupPostComment, isPending: CreateGroupPostCommentLoading } = useCreateGroupPostComment(isSinglePost ? isSinglePost : false)
//   const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment(false)
//   const { mutate: CreateUserPostComment, isPending: CreateUserPostCommentLoading } = useCreateUserPostComment(isSinglePost ? isSinglePost : false)
//   const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment(false)
//   const [comment, setComment] = useState('')
//   const [ImageValue, setImageValue] = useState<File | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const [showCommentSec, setShowCommentsec] = useState(false)
//   const { userData } = useUniStore()

//   const LikesUserId: string[] = Array.isArray(likes) ? likes.map((item) => item.userId) : []
//   const handlePostComment = async () => {
//     if (comment.length <= 1) {
//       return console.log('Please type something to comment!')
//     }
//     setIsLoading(true)
//     if (ImageValue) {
//       const imagedata: any = await replaceImage(ImageValue, '')

//       const data: PostCommentData = {
//         postID: postID,
//         content: comment,
//         imageUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId },
//         commenterProfileId: '',
//       }

//       if (type === PostType.Timeline) {
//         CreateUserPostComment(data)
//       } else if (type === PostType.Community) {
//         data.adminId = adminId
//         CreateGroupPostComment(data)
//       }
//     } else {
//       const data: PostCommentData = {
//         postID: postID,
//         commenterProfileId: '',
//         content: comment,
//       }

//       if (type === PostType.Timeline) {
//         CreateUserPostComment(data)
//       } else if (type === PostType.Community) {
//         data.adminId = adminId
//         CreateGroupPostComment(data)
//       }
//     }
//     setIsLoading(false)
//     setImageValue(null)
//     setComment('')
//   }

//   const LikeUnlikeHandler = (postId: string) => {
//     if (type === PostType.Timeline) {
//       LikeUnlikeTimelinePost(postId)
//     } else if (type === PostType.Community) {
//       LikeUnlikeGroupPost({ postId })
//     }
//   }

//   const likePostCommentHandler = (commentId: string) => {
//     if (type === PostType.Timeline) {
//       likeUserPostComment(commentId)
//     } else if (type === PostType.Community) {
//       likeGroupPostComment(commentId)
//     }
//   }

//   return (
//     <div
//       className={`${
//         isUserProfile
//           ? 'mb-4 shadow-sm lg:max-w-[696px] sm:max-w-md xs:max-w-[340px] xs:mx-4 sm:mx-0'
//           : isUniversity
//           ? 'max-w-full'
//           : 'border-2 border-gray-dark rounded-lg mb-4 shadow-sm lg:max-w-[696px] sm:max-w-md xs:max-w-[340px] xs:mx-4 sm:mx-0'
//       } `}
//     >
//       <div className="flex items-start">
//         {/* User Post */}
//         <div className={`${isUniversity ? 'w-full pt-10' : 'pt-10 '} `}>
//           {/* User Info */}
//           <div className="flex justify-between px-5 sm:px-10 xs:max-w-xs sm:max-w-md lg:max-w-full">
//             <div className="flex gap-4 items-center">
//               {avatar ? (
//                 <img src={avatar} alt={`${user}'s avatar`} width={14} height={14} className="rounded-full w-14 h-14" />
//               ) : (
//                 <div className="rounded-full w-14 h-14 bg-gray"></div>
//               )}
//               <div>
//                 <p className="font-medium text-base text-gray-dark">{user}</p>
//                 <p className="text-xs text-gray-1 pb-1">{university ? university : 'not available'}</p>
//                 <p className="text-xs text-gray-1">{!year.includes('undefined') ? year : ''}</p>
//               </div>
//             </div>
//             {/* POST OPTIONS */}
//             <div className="flex items-center gap-2">
//               {saved && <FaBookmark />}

//               <PostOptions postID={postID} isType={isType} />
//             </div>
//           </div>
//           {/* media div  */}
//           {media && (
//             <div className="flex justify-center flex-wrap w-full px-10 mt-2">
//               {media?.map((item: { imageUrl: string }) => (
//                 <img key={item.imageUrl} className="rounded-lg h-96  object-cover w-full " src={item.imageUrl} alt="media" />
//               ))}
//             </div>
//           )}
//           {/* Post Content */}
//           <div className="mt-6 px-5 sm:px-10 sm:max-w-md lg:max-w-full">
//             {/* TODO: A MARKDOWN PARSER MAY BE NEEDED FOR POST CONTENT */}
//             <p className="text-sm font-medium break-words whitespace-pre-wrap ">
//               {text}{' '}
//               <a href={link} className="text-blue-500">
//                 {link}
//               </a>
//             </p>
//             <p className="text-xs text-gray mt-4">
//               <span className="text-gray-dark break-words">{dayjs(new Date(date).toString()).format('h:m a · MMM DD, YYYY')}</span> · Post from {user}{' '}
//               at {university}
//             </p>
//           </div>
//           {/* Post Actions */}
//           <div className="flex justify-between items-center my-4 border-t-2 border-b-2 px-2 lg:px-10 py-2 border-border text-gray-1 xs:max-w-[340px] sm:max-w-md lg:max-w-full">
//             {/* Like Button */}
//             <div onClick={() => LikeUnlikeHandler(postID!)} className="flex items-center cursor-pointer">
//               <AiOutlineLike color={LikesUserId.includes(userData?.id || '') ? '#6647FF' : ''} />
//               <span className="mx-1 text-sm xs:text-xs sm:text-sm">{likes?.length ? likes?.length : 0}</span>
//             </div>
//             <div onClick={() => setShowCommentsec(!showCommentSec)} className="flex items-center">
//               <FaComment className="text-gray-500 sm:ml-6 mr-2" />
//               <span className="text-sm xs:text-xs sm:text-sm">{comments} Comments</span>
//             </div>
//             <div className="flex items-center">
//               <BiRepost className="text-gray-500 sm:ml-6 mr-2 h-6 w-6" />
//               <span className="text-sm xs:text-xs sm:text-sm">{reposts} Reposts</span>
//             </div>
//             <Popover>
//               <PopoverTrigger>
//                 <div className="flex items-center">
//                   <IoPaperPlaneSharp className="text-gray-500 sm:ml-6 mr-2" />
//                   <span className="text-sm xs:text-xs sm:text-sm">Share</span>
//                 </div>
//               </PopoverTrigger>
//               <PopoverContent className="relative right-40 top-8 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
//                 <SharePopup />
//               </PopoverContent>
//             </Popover>
//           </div>
//           {/* Comments Box */}
//           <div className="py-2 px-5 sm:px-10">
//             {/* Comments Input Box */}
//             <div className="flex items-center gap-4">
//               {profileDp ? (
//                 <img src={profileDp} alt="User Avatar" width={14} height={14} className="rounded-full w-12 h-12 sm:w-14 sm:h-14" />
//               ) : (
//                 <div className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-gray"></div>
//               )}
//               <div className="w-11/12 border border-gray-light rounded-full py-2 pr-3 flex items-center">
//                 <input
//                   onChange={(e) => setComment(e.target.value)}
//                   value={comment}
//                   type="text"
//                   placeholder="Add a comment..."
//                   className="flex-grow mx-1 sm:mx-4 p-1 border-none focus:outline-none w-full lg:min-w-[370px] xs:text-xs sm:text-sm"
//                 />
//                 {/* <MdGifBox size={24} color="#737373" /> */}
//                 <div>
//                   <input
//                     style={{ display: 'none' }}
//                     type="file"
//                     id={`CommentsImage${postID}`}
//                     onChange={(e: any) => setImageValue(e.target.files[0])}
//                     accept="image/gif,image/webp"
//                   />
//                   <label htmlFor={`CommentsImage${postID}`}>
//                     <MdGifBox size={24} color="#737373" />
//                   </label>
//                 </div>

//                 {comment?.length > 1 && (
//                   <button onClick={() => handlePostComment()} className="text-white bg-primary px-3 my-[2px] sm:px-3 sm:py-2 rounded-full text-sm">
//                     {CreateGroupPostCommentLoading || CreateUserPostCommentLoading || isLoading ? <Spinner /> : <p>Post</p>}
//                   </button>
//                 )}
//               </div>
//             </div>
//             {ImageValue && (
//               <div className="relative w-11/12">
//                 <img className="" src={URL.createObjectURL(ImageValue)} alt="" />
//                 <p onClick={() => setImageValue(null)} className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full text-center">
//                   X
//                 </p>
//               </div>
//             )}
//             {userComments?.length && showCommentSec ? <div className="my-6 text-sm text-gray-500">Most Relevant / Most Recent</div> : ''}
//             {/* Comments Section */}
//             <div className={`${!showCommentSec ? 'h-0 overflow-y-hidden' : ''} xs:max-w-xs sm:max-w-max flex flex-col gap-2 `}>
//               {userComments?.map((comment: any) => (
//                 <div key={comment._id} className="my-4 xs:mr-4 sm:mr-0">
//                   {/* Comment Info */}
//                   <div className="flex gap-4">
//                     {comment?.commenterId?.profile_dp?.imageUrl ? (
//                       <img
//                         src={comment?.commenterId?.profile_dp?.imageUrl}
//                         alt={`${comment?.user}'s avatar`}
//                         width={14}
//                         height={14}
//                         className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
//                       />
//                     ) : (
//                       <div className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-gray" />
//                     )}

//                     <div className="px-4 py-2 border border-gray rounded-lg">
//                       <div className="flex justify-between">
//                         <div>
//                           <p className="font-medium text-base text-gray-dark">{comment?.commenterId?.firstName}</p>
//                           <p className="text-xs text-gray">{comment.createdAt && dayjs(new Date(comment?.createdAt).toString()).fromNow()}</p>
//                         </div>
//                         <SlOptions color="gray" />
//                       </div>
//                       {comment?.imageUrl?.imageUrl && <img className="w-full h-80 object-contain" src={comment?.imageUrl?.imageUrl} alt="" />}
//                       <p className="text-xs sm:text-sm pt-1 break-words lg:min-w-[450px] max-lg:min-w-[200px]">{comment?.content}</p>
//                     </div>
//                   </div>
//                   {/* Comment Actions */}
//                   <div className="flex justify-end mt-3 gap-10">
//                     <div onClick={() => likePostCommentHandler(comment._id)} className="flex items-center cursor-pointer">
//                       <AiOutlineLike color={comment?.likeCount?.some((like: any) => like.userId == userData?.id) ? '#6647FF' : ''} />
//                       <span className="mx-1 text-sm">{comment?.likeCount ? comment?.likeCount.length : 0}</span>
//                     </div>
//                     <div
//                       className="flex items-center cursor-pointer"
//                       onClick={() => {
//                         setModalContentType('ReplyModal')
//                         setIsModalOpen(true)
//                       }}
//                     >
//                       <HiReply size={20} className="text-gray-dark" />
//                       <span className="ml-2 text-sm">Reply</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end mt-5 mb-10 xs:mr-8 sm:mr-0">
//               {userComments?.length > 5 && showCommentSec ? <button className="text-gray text-sm underline">View More Comments</button> : ''}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Post
