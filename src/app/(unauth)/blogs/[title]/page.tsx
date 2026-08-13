import { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, getBlogByTitle } from '@/content/blogs'
import BestEngineeringCollegesBlog from '@/components/template/blogs/BestEngineeringColleges'
import CampusLifePlacementsBlog from '@/components/template/blogs/CampusLifePlacements'
import KietUnibuzzBlog from '@/components/template/blogs/KietUnibuzz'
import AggarwalCollegeBlog from '@/components/template/blogs/AggarwalCollege'

const BLOG_PAGES: Record<string, ComponentType> = {
  'best-engineering-colleges-in-ghaziabad-for-2026-applicants': BestEngineeringCollegesBlog,
  'why-campus-life-clubs-and-hackathons-matter-for-placements': CampusLifePlacementsBlog,
  'kiet-ghaziabad-unibuzz-digital-campus': KietUnibuzzBlog,
  'aggarwal-college-ballabgarh-digital-student-life': AggarwalCollegeBlog,
}

type Props = {
  params: { title: string }
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ title: post.title }))
}

export default function BlogDetailPage({ params }: Props) {
  const title = decodeURIComponent(params.title)
  const post = getBlogByTitle(title)
  const BlogPage = BLOG_PAGES[title]

  if (!post || !BlogPage) {
    notFound()
  }

  return <BlogPage />
}
