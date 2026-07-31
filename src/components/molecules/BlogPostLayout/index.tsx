import { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type BlogPostLayoutProps = {
  title: string
  date: string
  children: ReactNode
}

export default function BlogPostLayout({ title, date, children }: BlogPostLayoutProps) {
  return (
    <main className="flex min-h-screen items-start justify-center py-16">
      <article className="flex w-full sm:w-[510px] flex-col items-start gap-8 px-4 sm:px-6">
        <nav className="flex w-full items-center gap-2 text-xs text-neutral-500" aria-label="Breadcrumb">
          <Link href="/blogs" className="text-primary hover:underline">
            Blogs
          </Link>
          <ChevronRight size={14} className="shrink-0 text-neutral-400" />
          <span className="w-full truncate">{title}</span>
        </nav>

        <div className="flex w-full flex-col items-start gap-4">
          <time className="text-xs text-neutral-500" dateTime={date}>
            {date}
          </time>
          <h1 className="text-md-big font-bold font-poppins text-neutral-700">{title}</h1>
        </div>

        {children}
      </article>
    </main>
  )
}
