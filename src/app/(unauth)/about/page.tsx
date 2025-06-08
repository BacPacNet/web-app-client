import { Metadata } from 'next'
import AboutClient from '@/components/template/AboutClient'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/about`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz-logo.png'

  return {
    title: 'Privacy Policy | UniBuzz',
    description: 'Read the UniBuzz Privacy Policy to learn how we collect, use, and protect your personal information when you use our services.',
    openGraph: {
      title: 'Privacy Policy | UniBuzz',
      description: 'Read the UniBuzz Privacy Policy to learn how we collect, use, and protect your personal information when you use our services.',
      url,
      siteName: 'UniBuzz',
      images: [
        {
          url: ogImage,
          width: 52,
          height: 52,
          alt: 'Privacy Policy page on UniBuzz',
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
