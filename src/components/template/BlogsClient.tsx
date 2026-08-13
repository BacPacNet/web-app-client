'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BLOG_POSTS } from '@/content/blogs'
import Paginate from '@/components/molecules/Paginate'

const POSTS_PER_PAGE = 8

const BlogsClient = () => {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(BLOG_POSTS.length / POSTS_PER_PAGE)

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE
    return BLOG_POSTS.slice(start, start + POSTS_PER_PAGE)
  }, [page])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  return (
    <main className="min-h-screen bg-surface-neutral-50 flex items-center justify-center pt-16">
      <div className="flex flex-col items-center justify-center md:gap-16 gap-8 max-width-allowed px-4  ">
        <header className="flex flex-col items-start justify-start gap-4 w-full">
          <h1 className="font-poppins text-[28px] md:text-[40px] font-bold text-neutral-700 ">Blogs</h1>
          <p className=" text-sm md:text-2sm text-neutral-500  ">
            Keep informed with our latest blog posts covering new features, updates, and fixes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {paginatedPosts.map((post) => (
            <Link
              key={post.title}
              href={`/blogs/${post.title}`}
              className="flex flex-col items-start justify-start gap-8 rounded-xl bg-white shadow-card p-8 h-[400px]"
            >
              <time className="block text-xs text-neutral-500 " dateTime={post.date}>
                {post.date}
              </time>
              <div className="relative w-full flex-1 h-[200px]  min-h-0 overflow-hidden rounded-lg bg-neutral-200">
                <Image src={post.image} alt={post.heading} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
              <h2 className="shrink-0 font-poppins text-sm md:text-[20px] font-semibold leading-snug text-neutral-600 line-clamp-2">
                {post.heading}
              </h2>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center mt-[72px] pb-10">
          <Paginate onPageChange={(page) => setPage(page)} currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </main>
  )
}

export default BlogsClient
