import './globals.css'
import { Inter } from 'next/font/google'

type FontClassName = string

const inter = Inter({ subsets: ['latin'] }) as { className: FontClassName }

interface Metadata {
  title: string
  description: string
}

export const metadata: Metadata = {
  title: 'BacPac',
  description: 'Connect with Universities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
