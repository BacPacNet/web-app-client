'use client'
import Image from 'next/image'
import Link from 'next/link'
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
//import { Button } from '@/components/ui/button'
//import { Input } from '@/components/ui/input'
//import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  LuBold,
  LuChevronDown,
  LuHome,
  LuImage,
  LuItalic,
  LuList,
  LuListOrdered,
  LuListPlus,
  LuMail,
  LuMoreHorizontal,
  LuSearch,
  LuSmile,
  LuThumbsUp,
  LuUnderline,
  LuUsers,
  LuBell,
  LuBot,
  LuFilter,
  LuArrowUpDown,
} from 'react-icons/lu'
import Buttons from '@/components/atoms/Buttons'
import InputBox from '@/components/atoms/Input/InputBox'
import { RxAvatar } from 'react-icons/rx'

export default function UnibuzzPage() {
  return (
    <div className="min-h-screen bg-[#f3f2ff]">
      {/*<header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#6744ff]">
              uni<span className="text-[#6744ff]">buzz</span>
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-sm font-medium">
            Discover
          </Link>
          <Link href="#" className="text-sm font-medium">
            Community
          </Link>
          <Link href="#" className="text-sm font-medium">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <RxAvatar className="h-8 w-8 border-2 border-[#6744ff]">
       
          </RxAvatar>
          <LuChevronDown className="h-4 w-4" />
        </div>
      </header>*/}

      {/* Main Content */}
      <div className="max-width-allowed mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr_300px] gap-0">
        {/* Left Sidebar */}
        <aside className="hidden md:block border-r bg-white p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[#6b7280] tracking-wider">COMMUNITY</h3>
              <nav className="space-y-1">
                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#6744ff] bg-[#e9e8ff]">
                  <LuHome className="h-5 w-5" />
                  <span className="text-sm font-medium">Home</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <LuUsers className="h-5 w-5" />
                  <span className="text-sm font-medium">Connections</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <LuMail className="h-5 w-5" />
                  <span className="text-sm font-medium">Messages</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <LuBell className="h-5 w-5" />
                  <span className="text-sm font-medium">Notifications</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <LuBot className="h-5 w-5" />
                  <span className="text-sm font-medium">AI Assistant</span>
                </Link>
              </nav>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[#6b7280] tracking-wider">UNIVERSITIES</h3>
              <nav className="space-y-1">
                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#e9e8ff]">
                    <span className="text-xs font-medium text-[#6744ff]">L</span>
                  </div>
                  <span className="text-sm font-medium">Lorem University</span>
                </Link>
              </nav>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#6b7280] tracking-wider">GROUPS</h3>
                <Buttons className="h-5 w-5 rounded-full">
                  <LuListPlus className="h-4 w-4 text-[#6744ff]" />
                </Buttons>
              </div>

              <div className="relative">
                <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-[#9ca3af]" />
                <InputBox type="search" placeholder="Search Group" className="pl-8 h-9 rounded-md border border-[#d1d5db] bg-white text-sm" />
              </div>

              <div className="flex gap-2">
                <Buttons className="h-8 gap-1 text-xs" size="small">
                  <LuFilter className="h-3.5 w-3.5" />
                  Filter
                </Buttons>
                <Buttons className="h-8 gap-1 text-xs" size="small">
                  <LuArrowUpDown className="h-3.5 w-3.5" />
                  Sort
                </Buttons>
              </div>

              <nav className="space-y-1">
                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <RxAvatar className="h-8 w-8">
                    {/*
                    <AvatarFallback>QM</AvatarFallback>*/}
                  </RxAvatar>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium">Quantum Mechanics III</p>
                    <p className="text-xs text-[#6b7280]">Year 2024</p>
                  </div>
                </Link>

                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e]">
                    <span className="text-white">I</span>
                  </div>
                  <span className="text-sm font-medium">Innovator&apos;s Hub</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dc2626]">
                    <span className="text-white">L</span>
                  </div>
                  <span className="text-sm font-medium">Lorem Basketball Club</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <RxAvatar className="h-8 w-8">{/*<AvatarFallback>GC</AvatarFallback>*/}</RxAvatar>
                  <span className="text-sm font-medium">Gamer&apos;s Club</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <RxAvatar className="h-8 w-8">{/*<AvatarFallback>TA</AvatarFallback>*/}</RxAvatar>
                  <span className="text-sm font-medium">Tutor&apos;s Association</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[#4b5563] hover:bg-[#f3f4f6]">
                  <RxAvatar className="h-8 w-8">{/*<AvatarFallback>CE</AvatarFallback>*/}</RxAvatar>
                  <span className="text-sm font-medium">Cinephiles for Elitists</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-4">
          {/* Text Editor */}
          {/*<div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2 border-b pb-2">
              <Buttons className="h-8 w-8 rounded-md">
                <LuBold className="h-4 w-4" />
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <Italic className="h-4 w-4" />
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <Underline className="h-4 w-4" />
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <span className="text-sm">S</span>
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <ListOrdered className="h-4 w-4" />
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <LayoutList className="h-4 w-4" />
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <span className="text-sm">[]</span>
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <span className="text-sm">()</span>
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <span className="text-sm">{'<'}</span>
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <span className="text-sm">{'='}</span>
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <span className="text-sm">{'-'}</span>
              </Buttons>
              <Buttons className="h-8 w-8 rounded-md">
                <span className="text-sm">{'>'}</span>
              </Buttons>
              <div className="ml-auto">
                <Buttons variant="ghost" className="h-8 text-xs">
                  LaTeX
                </Buttons>
              </div>
            </div>

            <div className="min-h-[100px] p-2">
              <p className="text-sm text-[#4b5563]">Active State UI</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Buttons className="h-8 w-8 rounded-full">
                  <LuSmile className="h-5 w-5 text-[#6b7280]" />
                </Buttons>
                <Buttons className="h-8 w-8 rounded-full">
                  <LuImage className="h-5 w-5 text-[#6b7280]" />
                </Buttons>
                <Buttons className="h-8 w-8 rounded-full">
                  <LuMail className="h-5 w-5 text-[#6b7280]" />
                </Buttons>
              </div>
              <div className="flex items-center gap-2">
                <Buttons variant="outline" className="h-8 gap-1 text-xs">
                  Visibility
                  <LuChevronDown className="h-3.5 w-3.5" />
                </Buttons>
                <Buttons className="h-8 bg-[#6744ff] text-xs text-white hover:bg-[#3a169c]">Post</Buttons>
              </div>
            </div>
          </div>*/}

          {/* Feed Tabs */}
          {/*<Tabs defaultValue="recent" className="mb-4">
            <TabsList className="grid w-full grid-cols-3 bg-white">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </Tabs>*/}

          {/* Posts */}
          <div className="space-y-4">
            {/* Post 1 */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RxAvatar className="h-10 w-10">
                    {/*<AvatarImage src="/placeholder.svg?height=40&width=40" alt="Robin Park" />
                    <AvatarFallback>RP</AvatarFallback>*/}
                  </RxAvatar>
                  <div>
                    <p className="text-sm font-medium">Robin Park</p>
                    <p className="text-xs text-[#6b7280]">3rd Yr. Undergraduate</p>
                    <p className="text-xs text-[#6b7280]">Biological Science</p>
                  </div>
                </div>
                <Buttons className="h-8 w-8 rounded-full">
                  <LuMoreHorizontal className="h-4 w-4" />
                </Buttons>
              </div>

              <div className="mb-4">
                <p className="text-sm">
                  So excited to bring in the new batch of students to our university and introduce them to our illustration club! If you would like to
                  join our student meetup, send me a DM or join Lorem University Community.
                </p>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <Image src="/placeholder.svg?height=200&width=300" alt="Illustration" width={300} height={200} className="rounded-lg object-cover" />
                <Image src="/placeholder.svg?height=200&width=300" alt="Illustration" width={300} height={200} className="rounded-lg object-cover" />
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Illustration"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover col-span-2"
                />
              </div>

              <div className="text-xs text-[#6b7280]">
                <p>9:31 PM · Feb 11, 2024 · Post from Lorem Illustration at Lorem University</p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Buttons className="h-8 gap-1 text-xs">
                    <LuThumbsUp className="h-3.5 w-3.5" />
                    50
                  </Buttons>
                  <Buttons className="h-8 gap-1 text-xs">
                    <LuMail className="h-3.5 w-3.5" />4
                  </Buttons>
                </div>
                <Buttons className="h-8 gap-1 text-xs">Share</Buttons>
              </div>
            </div>

            {/* Post 2 - Duplicate of Post 1 for the layout */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RxAvatar className="h-10 w-10">
                    {/*<AvatarImage src="/placeholder.svg?height=40&width=40" alt="Robin Park" />
                    <AvatarFallback>RP</AvatarFallback>*/}
                  </RxAvatar>
                  <div>
                    <p className="text-sm font-medium">Robin Park</p>
                    <p className="text-xs text-[#6b7280]">3rd Yr. Undergraduate</p>
                    <p className="text-xs text-[#6b7280]">Biological Science</p>
                  </div>
                </div>
                <Buttons className="h-8 w-8 rounded-full">
                  <LuMoreHorizontal className="h-4 w-4" />
                </Buttons>
              </div>

              <div className="mb-4">
                <p className="text-sm">
                  So excited to bring in the new batch of students to our university and introduce them to our illustration club! If you would like to
                  join our student meetup, send me a DM or join Lorem University Community.
                </p>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <Image src="/placeholder.svg?height=200&width=300" alt="Illustration" width={300} height={200} className="rounded-lg object-cover" />
                <Image src="/placeholder.svg?height=200&width=300" alt="Illustration" width={300} height={200} className="rounded-lg object-cover" />
              </div>

              <div className="text-xs text-[#6b7280]">
                <p>9:31 PM · Feb 11, 2024 · Post from Lorem Illustration at Lorem University</p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Buttons className="h-8 gap-1 text-xs">
                    <LuThumbsUp className="h-3.5 w-3.5" />
                    50
                  </Buttons>
                  <Buttons className="h-8 gap-1 text-xs">
                    <LuMail className="h-3.5 w-3.5" />4
                  </Buttons>
                </div>
                <Buttons className="h-8 gap-1 text-xs">Share</Buttons>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block border-l bg-white p-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#6b7280] tracking-wider">GROW YOUR NETWORK</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 rounded-md p-2 hover:bg-[#f3f4f6]">
                    <RxAvatar className="h-10 w-10" />
                    {/*<AvatarImage src="/placeholder.svg?height=40&width=40" alt="Robin Park" />
                      <AvatarFallback>RP</AvatarFallback>*/}
                    <div>
                      <p className="text-sm font-medium">Robin Park</p>
                      <p className="text-xs text-[#6b7280]">3rd Yr. Undergraduate</p>
                      <p className="text-xs text-[#6b7280]">Biological Science</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#6b7280] tracking-wider">JOIN GROUPS</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 rounded-md p-2 hover:bg-[#f3f4f6]">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f43f5e]">
                      <span className="text-white">U</span>
                    </div>
                    <span className="text-sm font-medium">University Group</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="space-y-2 text-xs text-[#6b7280]">
                <p>
                  <Link href="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </p>
                <p>
                  <Link href="#" className="hover:underline">
                    Terms and Conditions
                  </Link>
                </p>
                <p>
                  <Link href="#" className="hover:underline">
                    User Guidelines
                  </Link>
                </p>
                <p>
                  <Link href="#" className="hover:underline">
                    Contact Us
                  </Link>
                </p>
                <p className="pt-2">Unibuzz Networks © 2024</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
