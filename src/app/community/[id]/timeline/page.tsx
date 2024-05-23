'use client'
import React, { useState } from 'react'
import Navbar from '@/components/Timeline/Navbar'
import ProfileCard from '@/components/Timeline/ProfileCard'
import PostInput from '@/components/Timeline/PostInput'
import Dropdown from '@/components/Timeline/DropDown'
import Post from '@/components/Timeline/Post'
interface User {
  name: string
  bio: string
  university: string
  department: string
  location: string
  email: string
  phone: string
  dateOfBirth: string
  followers: number
  following: number
}

interface Post {
  user: User
  content: string
  dateTime: string
  likes: number
  comments: Comment[]
  reposts: number
}

interface Comment {
  user: User
  content: string
  likes: number
}

// const samplePost = {
//   user: {
//     name: 'Joshua Welman',
//     university: 'Nagoya University',
//     department: '2nd Yr. Graduate',
//     location: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     followers: 0,
//     following: 0,
//   },
//   content: 'Can someone help me with this chemistry equation? Here\'s the link to the google drive: //https:www.bukochem.com/homework/A1-35',
//   dateTime: 'Feb 11, 2024 - Post from Bukio\'s Chemistry Lab at Nagoya University',
//   likes: 50,
//   comments: [
//     {
//       user: {
//         name: 'Johnny Nitro',
//         university: '',
//         department: '',
//         location: '',
//         email: '',
//         phone: '',
//         dateOfBirth: '',
//         followers: 0,
//         following: 0,
//       },
//       content: 'Yeah give me a second I\'ll try to solve it and send the solution over your DMs.',
//       likes: 4,
//     },
//   ],
//   reposts: 2,
// };
const sampleUser = {
  name: 'Kathryn Murphy',
  bio: 'Junior student major at Law, Nagoya University',
  university: '3rd Year, Undergraduate, Law',
  department: 'Junior student major at Law',
  location: 'London, United Kingdom',
  email: 'kathrynmurphy@gmail.com',
  phone: '+44-3028-3239',
  dateOfBirth: 'April 3rd, 2002',
  followers: 21,
  following: 63,
}
const options = ['Recent', 'Popular', 'Most Liked']

const comments = [
  {
    id: 1,
    user: 'Johnny Nitro',
    text: "Yeah give me a second I'll try to solve it and send the solution over your DMs.",
    date: '5d',
    avatar: '/path/to/commenter-avatar.png',
  },
]

const Timeline = () => {
  const [activeTab, setActiveTab] = useState<string>('Timeline')

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <main>
      <Navbar activeTab={activeTab} onTabClick={handleTabClick} />
      <div className="flex justify-center items-start gap-7 mt-16">
        <ProfileCard {...sampleUser} />
        <div className="flex flex-col gap-5">
          <PostInput />
          <Dropdown options={options} defaultOption="Recent" />
          <Post
            user="Joshua Welman"
            university="Nagoya University"
            year="2nd Yr. Graduate"
            text="Can someone help me with this chemistry equation? Here’s the link to the google drive:"
            link="https://www.butkochem.com/homework/A1-35"
            date="9:31 PM · Feb 11, 2024 · Post from Butko’s Chemistry Lab at Nagoya University"
            avatar="/path/to/avatar.png"
            likes={50}
            comments={3}
            reposts={2}
            shares={1}
            userComments={comments}
          />
        </div>
      </div>
    </main>
  )
}

export default Timeline
