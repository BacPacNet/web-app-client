import { Metadata } from 'next'
import LandingPageClient from '@/components/LandingPageClient'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz-logo.png'
  return {
    title: 'Unibuzz | The Student Community Platform that connects you',
    description:
      'Join Unibuzz, the leading student community platform, to connect with peers and universities, discover opportunities, and collaborate on your academic journey. Start building your network today.',
    openGraph: {
      type: 'website',
      url: url,
      title: 'Unibuzz | The Student Community Platform that connects you',
      description:
        'Join Unibuzz, the leading student community platform, to connect with peers and universities, discover opportunities, and collaborate on your academic journey. Start building your network today.',
      siteName: 'Unibuzz',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Unibuzz - Student Community Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Unibuzz | The Student Community Platform that connects you',
      description:
        'Join Unibuzz, the leading student community platform, to connect with peers and universities, discover opportunities, and collaborate on your academic journey. Start building your network today.',
      images: [ogImage],
    },
    metadataBase: new URL(url),
  }
}

export default function LandingPage() {
  return <LandingPageClient />
}
