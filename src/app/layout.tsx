import './globals.css'

import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import Navbar from '../components/Navbar/Navbar'
import { ReactQueryClientProvider } from '@/utils/Provider'

type FontClassName = string

const inter = Inter({ subsets: ['latin'] }) as { className: FontClassName }

export const metadata: Metadata = {
  title: 'UniBuzz',
  description: 'Connect with universities and students around the world.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs13', 'next13', 'pwa', 'next-pwa'],
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#6744ff' }],
  authors: [
    { name: '' },
    {
      name: '',
      url: '',
    },
  ],
  viewport: 'maximum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/icon-192x192.png' },
    { rel: 'icon', url: 'icons/icon-192x192.png' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  )
}
