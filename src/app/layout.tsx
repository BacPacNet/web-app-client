import './globals.css'

import { Inter } from 'next/font/google'
import { Poppins } from 'next/font/google'
import type { Metadata } from 'next'

import { ReactQueryClientProvider } from '@/utils/Provider'
import ZustandSocketProvider from '@/utils/ZustandSocketProvider'

import SecondaryNavbar from '@/components/Timeline/Navbar'
import LogoNavbar from '@/components/atoms/LogoNavbar'
type FontClassName = string

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
}) as { className: FontClassName }

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

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
    <html lang="en" className={`${poppins.variable} ${inter.className}`}>
      <head>
        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </head>

      <body>
        <ReactQueryClientProvider>
          <ZustandSocketProvider>
            <LogoNavbar />
            {children}
          </ZustandSocketProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
