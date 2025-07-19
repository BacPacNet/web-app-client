import { Metadata } from 'next'
import AboutClient from '@/components/template/AboutClient'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/about`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz_logo_extralarge.png'

  return {
    title: 'About | UniBuzz',
    description:
      'Discover UniBuzz, the all-in-one university network for students and faculty. Join your university community, connect, collaborate, and enjoy features designed for university life.',
    openGraph: {
      title: 'About | UniBuzz',
      description:
        'Discover UniBuzz, the all-in-one university network for students and faculty. Join your university community, connect, collaborate, and enjoy features designed for university life.',
      url,
      siteName: 'UniBuzz',
      images: [
        {
          url: ogImage,
          width: 52,
          height: 52,
          alt: 'About page on UniBuzz',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: url,
    },
  }
}

export default function AboutPage() {
  return <AboutClient />
}
