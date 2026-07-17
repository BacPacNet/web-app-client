'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import styles from './page.module.css'
import Footer from '@/components/Footer/Footer'
import Script from 'next/script'

export default function ThankYouPage() {
  return (
    <div className={styles.landingPageWrapper}>
      {/* Google Tag Manager */}
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5FM87MGZ');`}
      </Script>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-5FM87MGZ"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      {/* Content Area */}
      <main className={styles.contentArea}>
        <div className={styles.gridTexture} />
        <div className={styles.particle} style={{ width: '128px', height: '128px', top: '15%', right: '25%', animationDelay: '0s' }} />
        <div className={styles.particle} style={{ width: '192px', height: '192px', bottom: '30%', left: '15%', animationDelay: '-3s' }} />
        <div className={styles.particle} style={{ width: '96px', height: '96px', top: '60%', right: '10%', animationDelay: '-5s' }} />

        <div className={styles.glassPanel}>
          <CheckCircle size={64} className="text-indigo-600 mb-2" style={{ color: '#6366f1' }} />
          <h1 className={styles.thankYouHeading}>Thank You!</h1>
          <p className={styles.thankYouText}>
            Thank you for reaching out to us! <br />
            We have received your demo request and are preparing a personalized experience for you. <br />
            Our team will get in touch with you shortly to confirm the scheduled time.
          </p>
          <Link href="/for-university" className={styles.btnBack}>
            Back to Home <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
