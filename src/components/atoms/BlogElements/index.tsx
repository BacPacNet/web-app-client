import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BlogImageProps = {
  src: string
  alt: string
  className?: string
}

export function BlogImage({ src, alt, className }: BlogImageProps) {
  return (
    <div className={cn('relative w-full h-[200px] md:h-[270px] overflow-hidden', className)}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="510px" />
    </div>
  )
}

type BlogSectionProps = {
  title: string
  subtitle?: string
  image?: string
  imageAlt?: string
  children: ReactNode
  className?: string
}

export function BlogSection({ title, subtitle, image, imageAlt, children, className }: BlogSectionProps) {
  return (
    <section className={cn('flex w-full flex-col items-start gap-8', className)}>
      {image && <BlogImage src={image} alt={imageAlt || title} />}
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full flex-col items-start gap-2">
          <h2 className="text-2sm font-semibold font-inter text-neutral-700">{title}</h2>
          {subtitle && <h3 className="text-xs font-bold text-neutral-700">{subtitle}</h3>}
        </div>
        <div className="flex w-full flex-col items-start gap-4">{children}</div>
      </div>
    </section>
  )
}

type BlogParagraphProps = {
  children: ReactNode
  bold?: boolean
  className?: string
}

export function BlogParagraph({ children, bold, className }: BlogParagraphProps) {
  return <p className={cn('text-xs leading-relaxed', bold ? 'font-bold text-neutral-700' : 'text-neutral-700', className)}>{children}</p>
}

type BlogCtaProps = {
  label: string
  href?: string
  className?: string
}

export function BlogCta({ label, href = '/discover', className }: BlogCtaProps) {
  return (
    <div className="flex w-full items-center justify-center pt-2">
      <Link
        href={href}
        className={cn('inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-3 text-xs font-medium text-white ', className)}
      >
        {label}
      </Link>
    </div>
  )
}
