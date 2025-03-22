import Footer from '@/components/Footer/Footer'
import React, { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
