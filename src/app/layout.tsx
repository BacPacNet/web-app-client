import './globals.css'

import { Inter } from 'next/font/google'
import { Poppins } from 'next/font/google'
import type { Metadata } from 'next'

import { ReactQueryClientProvider } from '@/utils/Provider'
import ZustandSocketProvider from '@/utils/ZustandSocketProvider'
import { Toaster } from 'react-hot-toast'
import LogoNavbar from '@/components/atoms/LogoNavbar'
import { ModalManager } from '@/components/molecules/Modal/ModalManager'
import { ImageManager } from '@/components/molecules/ImageWrapper/ImageManager'
import { ModalProvider } from '@/context/ModalContext'
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

export const metadata = {
  title: 'UniBuzz | All in one University Network',
  description: 'Connect with universities and students around the world.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
            <ModalProvider>
              <Toaster />
              <ModalManager />
              <ImageManager />
              <LogoNavbar />
              {children}
              {/*<Footer />*/}
            </ModalProvider>
          </ZustandSocketProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
