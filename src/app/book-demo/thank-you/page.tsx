"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Menu, 
  X, 
  ArrowRight,
  CheckCircle,
  GraduationCap
} from "lucide-react";
import styles from "./page.module.css";
import unibuzzLogo from "@/assets/unibuzz_logo.svg";
import Footer from "@/components/Footer/Footer";
import Script from "next/script";

export default function ThankYouPage() {
  const [activeToggle, setActiveToggle] = useState<"faculty" | "student">("faculty");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

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
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      {/* Navigation Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerContainer}`}>
          <div className={styles.logoArea}>
            <Link href="/" className="flex items-center">
              <Image src={unibuzzLogo} alt="Unibuzz Logo" width={84} height={21} className="h-full cursor-pointer sm:w-[84px] w-[70px]" />
            </Link>
            <div className={styles.toggleSwitch}>
              <button 
                className={`${styles.toggleBtn} ${activeToggle === "faculty" ? styles.toggleBtnActive : ""}`}
                onClick={() => setActiveToggle("faculty")}
              >
                Faculty
              </button>
              <button 
                className={`${styles.toggleBtn} ${activeToggle === "student" ? styles.toggleBtnActive : ""}`}
                onClick={() => setActiveToggle("student")}
              >
                Student
              </button>
            </div>
          </div>

          <nav className={styles.navLinks}>
            <Link href="/timeline" className={styles.navLink}>Community</Link>
            <Link href="/discover" className={styles.navLink}>Discover</Link>
            <Link href="/for-university#blogs" className={styles.navLink}>Blogs</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
          </nav>

          <div className={styles.navActions}>
            <Link href="/book-demo">
              <button className={styles.btnDemo}>Book a Free Demo</button>
            </Link>
            <Link href="/register">
              <button className={styles.btnSignUp}>Sign Up</button>
            </Link>
          </div>

          <Menu className={styles.mobileMenuBtn} onClick={toggleMobileMenu} />
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && <div className={styles.drawerOverlay} onClick={toggleMobileMenu} />}
      <div className={`${styles.drawer} ${mobileMenuOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <Link href="/" className="flex items-center" onClick={toggleMobileMenu}>
            <Image src={unibuzzLogo} alt="Unibuzz Logo" width={84} height={21} className="h-full cursor-pointer sm:w-[84px] w-[70px]" />
          </Link>
          <X className={styles.drawerClose} onClick={toggleMobileMenu} />
        </div>
        <div className={styles.drawerLinks}>
          <Link href="/timeline" className={styles.navLink} onClick={toggleMobileMenu}>Community</Link>
          <Link href="/discover" className={styles.navLink} onClick={toggleMobileMenu}>Discover</Link>
          <Link href="/for-university#blogs" className={styles.navLink} onClick={toggleMobileMenu}>Blogs</Link>
          <Link href="/about" className={styles.navLink} onClick={toggleMobileMenu}>About</Link>
        </div>
        <div className={styles.drawerActions}>
          <Link href="/book-demo" style={{ width: "100%" }}>
            <button className={styles.btnDemo} style={{ width: "100%" }}>Book a Free Demo</button>
          </Link>
          <Link href="/register" onClick={toggleMobileMenu} style={{ width: "100%" }}>
            <button className={styles.btnSignUp} style={{ width: "100%" }}>Sign Up</button>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <main className={styles.contentArea}>
        <div className={styles.gridTexture} />
        <div className={styles.particle} style={{ width: "128px", height: "128px", top: "15%", right: "25%", animationDelay: "0s" }} />
        <div className={styles.particle} style={{ width: "192px", height: "192px", bottom: "30%", left: "15%", animationDelay: "-3s" }} />
        <div className={styles.particle} style={{ width: "96px", height: "96px", top: "60%", right: "10%", animationDelay: "-5s" }} />

        <div className={styles.glassPanel}>
          <CheckCircle size={64} className="text-indigo-600 mb-2" style={{ color: "#6366f1" }} />
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
  );
}
