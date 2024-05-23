// components/Post.tsx
import React from 'react'
import { FaThumbsUp, FaComment, FaShare, FaRetweet } from 'react-icons/fa'
import Image from 'next/image'

interface Comment {
  id: number
  user: string
  text: string
  date: string
  avatar: string
}

interface PostProps {
  user: string
  university: string
  year: string
  text: string
  link: string
  date: string
  avatar: string
  likes: number
  comments: number
  reposts: number
  shares: number
  userComments: Comment[]
}

const Post: React.FC<PostProps> = ({ user, university, year, text, link, date, avatar, likes, comments, reposts, shares, userComments }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-start">
        <Image src={avatar} alt={`${user}'s avatar`} width={48} height={48} className="rounded-full" />
        <div className="ml-4 w-full">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{user}</h3>
              <p className="text-sm text-gray-600">{university}</p>
              <p className="text-sm text-gray-600">{year}</p>
            </div>
            <div className="text-gray-500">...</div>
          </div>
          <p className="mt-2">
            {text}{' '}
            <a href={link} className="text-blue-500">
              {link}
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-2">{date}</p>
          <div className="flex items-center mt-4">
            <FaThumbsUp className="text-gray-500 mr-2" />
            <span>{likes}</span>
            <FaComment className="text-gray-500 ml-6 mr-2" />
            <span>{comments} Comments</span>
            <FaRetweet className="text-gray-500 ml-6 mr-2" />
            <span>{reposts} Reposts</span>
            <FaShare className="text-gray-500 ml-6 mr-2" />
            <span>{shares} Shares</span>
          </div>
          <div className="mt-4 border-t border-gray-300 pt-4">
            <div className="flex items-start">
              <Image src="/timeline/avatar.png" alt="User Avatar" width={36} height={36} className="rounded-full" />
              <input type="text" placeholder="Add a comment..." className="flex-grow ml-4 p-2 border rounded-lg" />
            </div>
            <div className="mt-4 text-sm text-gray-500">Most Relevant / Most Recent</div>
            {userComments.map((comment) => (
              <div key={comment.id} className="mt-4 flex">
                <Image src={comment.avatar} alt={`${comment.user}'s avatar`} width={36} height={36} className="rounded-full" />
                <div className="ml-4">
                  <p className="font-semibold">{comment.user}</p>
                  <p className="text-sm">{comment.text}</p>
                  <p className="text-xs text-gray-500">{comment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
