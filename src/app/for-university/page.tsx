'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Mail,
  EyeOff,
  UserSearch,
  BarChart3,
  LayoutGrid,
  Calendar,
  Users,
  Search,
  Lock,
  Share2,
  Bell,
  CheckCircle,
  Rss,
  GraduationCap,
  Megaphone,
  Briefcase,
  Sliders,
  Settings,
  PlayCircle,
} from 'lucide-react'
import styles from './page.module.css'
import Footer from '@/components/Footer/Footer'
import Script from 'next/script'

// Testimonial data matching Dr. Abhas Kanungo
const testimonials = [
  {
    quote:
      '“One of the key challenges we encountered was that details about student clubs, activities, and campus events were scattered across various platforms. As a result, many students were unaware of the opportunities available to them and often missed chances to participate. Unibuzz has helped solve this issue by creating a single space where students can easily find clubs, join communities, keep track of upcoming events, and take a more active role in campus life.”',
    author: 'Dr. Abhas Kanungo',
    role: 'Assistant Dean SW, KIET Group of Institutions',
    logo: '/kiet_logo.jpg',
  },
  {
    quote:
      '“Unibuzz has centralized our official announcements and streamlined student communication. It has completely eliminated the confusion of informal WhatsApp groups and brought our entire academic structure online in one safe, verified digital space.”',
    author: 'Aggarwal College Representative',
    role: 'Dean of Academic Affairs, Aggarwal College',
    logo: '/aggarwal_logo.jpg',
  },
]

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

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

      {/* Chatbot Script */}
      <Script id="tochat-chatbot" defer src="https://widget.tochat.be/bundle.js?key=684ca8ae-d86b-4356-9346-8e6e288967ad" strategy="lazyOnload" />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleHighlight}>All in One</span> Campus <br />
                Communication and <br />
                Student Acquisition
              </h1>
              <p className={styles.heroDescription}>
                Centralize official communication, student groups, clubs, placements, events, and campus engagement. Showcase your university by
                letting applicants connect with students and faculty and explore your campus.
              </p>
              <div className={styles.heroButtons}>
                <Link href="/book-demo">
                  <button className={styles.btnPrimary}>
                    Book a Free Demo <ArrowRight size={16} />
                  </button>
                </Link>
                <button className={styles.btnSecondary}>
                  <PlayCircle size={18} /> See How It Works
                </button>
              </div>
              <div className={styles.heroFeatures}>
                <div className={styles.heroFeatureItem}>
                  <CheckCircle size={18} /> Institution-controlled
                </div>
                <div className={styles.heroFeatureItem}>
                  <CheckCircle size={18} /> Role-based verified access
                </div>
                <div className={styles.heroFeatureItem}>
                  <CheckCircle size={18} /> Built for campus engagement
                </div>
              </div>
            </div>
            <div className={styles.heroImageContainer}>
              <Image src="/banner.jpg" alt="Unibuzz App Mockup Showcase" width={500} height={500} className={styles.heroImage} priority />
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className={`${styles.problemSection} section-padding`} id="problem">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.badge} ${styles.badgeProblem}`}>The problem</span>
            <h2 className={styles.sectionTitle}>
              Campus communication is fragmented <br />
              <span className={styles.sectionTitleHighlight}>— and it’s causing real issues.</span>
            </h2>
            <p className={styles.sectionSub}>
              University communication is spread across informal tools that institutions can’t verify, control, or measure — and that’s creating risk,
              missed messages, and wasted time.
            </p>
          </div>

          <div className={styles.grid3x2}>
            {/* Informal WhatsApp groups */}
            <div className={styles.card}>
              <div className={`${styles.cardIconBox} ${styles.themeOrange}`}>
                <MessageSquare size={24} />
              </div>
              <h3 className={styles.cardTitle}>Informal WhatsApp groups</h3>
              <p className={styles.cardDesc}>Open chat groups are hard to control, easy to leave, and impossible to verify.</p>
            </div>

            {/* Email updates get missed */}
            <div className={styles.card}>
              <div className={`${styles.cardIconBox} ${styles.themeOrange}`}>
                <Mail size={24} />
              </div>
              <h3 className={styles.cardTitle}>Email updates get missed</h3>
              <p className={styles.cardDesc}>Important official communication is buried in crowded inboxes and rarely read.</p>
            </div>

            {/* Clubs and events lack visibility */}
            <div className={styles.card}>
              <div className={`${styles.cardIconBox} ${styles.themeOrange}`}>
                <EyeOff size={24} />
              </div>
              <h3 className={styles.cardTitle}>Clubs and events lack visibility</h3>
              <p className={styles.cardDesc}>Activity is scattered, so participation stays low and momentum is lost.</p>
            </div>

            {/* Students can't discover peers */}
            <div className={styles.card}>
              <div className={`${styles.cardIconBox} ${styles.themeOrange}`}>
                <UserSearch size={24} />
              </div>
              <h3 className={styles.cardTitle}>Students can&apos;t discover peers</h3>
              <p className={styles.cardDesc}>Finding the right people, groups, and opportunities is left to chance.</p>
            </div>

            {/* Admins lack engagement visibility */}
            <div className={styles.card}>
              <div className={`${styles.cardIconBox} ${styles.themeOrange}`}>
                <BarChart3 size={24} />
              </div>
              <h3 className={styles.cardTitle}>Admins lack engagement visibility</h3>
              <p className={styles.cardDesc}>Leadership has no reliable view of what&apos;s working across campus.</p>
            </div>

            {/* Campus life is scattered */}
            <div className={styles.card}>
              <div className={`${styles.cardIconBox} ${styles.themeOrange}`}>
                <LayoutGrid size={24} />
              </div>
              <h3 className={styles.cardTitle}>Campus life is scattered</h3>
              <p className={styles.cardDesc}>Communication is spread across too many disconnected platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className={`${styles.solutionSection} section-padding`} id="community">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.badge} ${styles.badgeSolution}`}>The solution</span>
            <h2 className={styles.sectionTitle}>
              Unibuzz brings the university community <br />
              into <span className={styles.heroTitleHighlight}>one verified digital space</span>
            </h2>
            <p className={styles.sectionSub}>Everything campus communication needs — official, structured, and institution-controlled.</p>
          </div>

          <div className={styles.grid4x2}>
            {/* Official Announcements */}
            <div className={styles.solutionCard}>
              <Megaphone className={styles.solutionIcon} size={24} />
              <h3 className={styles.solutionTitle}>Official announcements</h3>
              <p className={styles.solutionDesc}>Pin verified updates that every student actually sees.</p>
            </div>

            {/* Verified Access */}
            <div className={styles.solutionCard}>
              <Lock className={styles.solutionIcon} size={24} />
              <h3 className={styles.solutionTitle}>Verified access</h3>
              <p className={styles.solutionDesc}>Verified student, faculty, and admin identities campus-wide.</p>
            </div>

            {/* University-wide Feed */}
            <div className={styles.solutionCard}>
              <Rss className={styles.solutionIcon} size={24} />
              <h3 className={styles.solutionTitle}>University-wide feed</h3>
              <p className={styles.solutionDesc}>One community feed for the whole institution.</p>
            </div>

            {/* Department & Course Groups */}
            <div className={styles.solutionCard}>
              <GraduationCap className={styles.solutionIcon} size={24} />
              <h3 className={styles.solutionTitle}>Department & course groups</h3>
              <p className={styles.solutionDesc}>Structured spaces for every department and cohort.</p>
            </div>

            {/* Clubs & Societies */}
            <div className={styles.solutionCard}>
              <Users className={styles.solutionIcon} size={24} />
              <h3 className={styles.solutionTitle}>Clubs & societies</h3>
              <p className={styles.solutionDesc}>Give student groups a home with real visibility.</p>
            </div>

            {/* Placement & Career Updates */}
            <div className={styles.solutionCard}>
              <Briefcase className={styles.solutionIcon} size={24} />
              <h3 className={styles.solutionTitle}>Placement & career updates</h3>
              <p className={styles.solutionDesc}>Share drives, openings, and prep in one channel.</p>
            </div>

            {/* Messaging & Collaboration */}
            <div className={styles.solutionCard}>
              <MessageSquare className={styles.solutionIcon} size={24} />
              <h3 className={styles.solutionTitle}>Messaging & collaboration</h3>
              <p className={styles.solutionDesc}>Direct and group messaging that stays on-platform.</p>
            </div>

            {/* Admin & Moderation Controls */}
            <div className={styles.solutionCard}>
              <Settings className={styles.solutionIcon} size={24} />
              <h3 className={styles.solutionTitle}>Admin & moderation controls</h3>
              <p className={styles.solutionDesc}>Role-based permissions and approval workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Deep Dive Section */}
      <section className={`${styles.howItWorksSection} section-padding`} id="discover">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.badge} ${styles.badgeHowItWorks}`}>How it works</span>
            <h2 className={styles.sectionTitle}>
              Enhance university visibility and student <br />
              satisfaction for <span className={styles.heroTitleHighlight}>increased revenue.</span>
            </h2>
            <p className={styles.sectionSub}>
              Unify your entire university community on a single platform to boost visibility and student satisfaction, driving greater revenue.
            </p>
          </div>

          <div className={styles.featuresList}>
            {/* Feature 1 */}
            <div className={styles.featureRow}>
              <div className={styles.featureDetail}>
                <span className={`${styles.featureDetailBadge} ${styles.themeGreen}`}>Promote & grow</span>
                <h3 className={styles.featureDetailTitle}>Promote your university</h3>
                <p className={styles.featureDetailDesc}>
                  Showcase your university to prospective students (applicants) to boost admissions and increase revenue.
                </p>
                <div className={styles.featureBulletList}>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> Promoted university posts
                  </div>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> Promoted university blogs and stories
                  </div>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> Direct pipeline to admissions
                  </div>
                </div>
              </div>
              <div className={styles.featureImageWrapper}>
                <Image src="/promote.jpg" alt="Students Collaborating" width={600} height={400} className={styles.featureImage} />
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`${styles.featureRow} ${styles.featureRowReversed}`}>
              <div className={styles.featureImageWrapper}>
                <Image src="/centralize.jpg" alt="Campus communication" width={600} height={400} className={styles.featureImage} />
              </div>
              <div className={styles.featureDetail}>
                <span className={`${styles.featureDetailBadge} ${styles.themeBlue}`}>Communicate & engage</span>
                <h3 className={styles.featureDetailTitle}>Centralize official communication</h3>
                <p className={styles.featureDetailDesc}>
                  Replace scattered chats and missed emails with pinned official announcements, a university-wide feed, and on-platform messaging.
                </p>
                <div className={styles.featureBulletList}>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> Pinned official announcements
                  </div>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> University-wide community feed
                  </div>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> Messaging & collaboration
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureRow}>
              <div className={styles.featureDetail}>
                <span className={`${styles.featureDetailBadge} ${styles.themePurple}`}>Verify & onboard</span>
                <h3 className={styles.featureDetailTitle}>Bring your verified campus online</h3>
                <p className={styles.featureDetailDesc}>
                  Set up your institution&apos;s space, verify students, faculty, and admins, and structure departments, courses, clubs, and official
                  groups.
                </p>
                <div className={styles.featureBulletList}>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> Verified student, faculty & admin identities
                  </div>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> Role-based access and permissions
                  </div>
                  <div className={styles.featureBullet}>
                    <Check size={16} /> Department, course & club structure
                  </div>
                </div>
              </div>
              <div className={styles.featureImageWrapper}>
                <Image src="/bring.jpg" alt="Aerial Campus View" width={600} height={400} className={styles.featureImage} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className={`${styles.useCasesSection} section-padding`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.badge} ${styles.badgeUseCases}`}>Use cases</span>
            <h2 className={styles.sectionTitle}>10 ways universities can use Unibuzz</h2>
            <p className={styles.sectionSub}>
              From day one onboarding to campus-wide analytics — practical ways institutions put the platform to work.
            </p>
          </div>

          <div className={styles.useCasesGrid}>
            {[
              { num: '01', title: 'Official announcements', desc: 'Broadcast verified updates campus-wide.' },
              { num: '02', title: 'First-year onboarding', desc: 'Welcome and orient new students from day one.' },
              { num: '03', title: 'Department & course groups', desc: 'Structured spaces for every cohort.' },
              { num: '04', title: 'Clubs & societies', desc: 'Run student organisations with visibility.' },
              { num: '05', title: 'Placement cell communication', desc: 'Centralize drives, openings, and prep.' },
              { num: '06', title: 'Events & hackathons', desc: 'Promote, register, and track participation.' },
              { num: '07', title: 'Faculty-student interaction', desc: 'Keep academic conversations on platform.' },
              { num: '08', title: 'Peer discovery', desc: 'Help students find the right people.' },
              { num: '09', title: 'Applicant campus showcase', desc: 'Show real campus life to prospects.' },
              { num: '10', title: 'Pipeline for increased revenue', desc: 'Increase university visibility for admissions.' },
            ].map((uc, i) => (
              <div key={i} className={styles.useCaseCard}>
                <span className={styles.useCaseNum}>{uc.num}</span>
                <h4 className={styles.useCaseTitle}>{uc.title}</h4>
                <p className={styles.useCaseDesc}>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className={`${styles.testimonialsSection} section-padding`} id="testimonials">
        <div className="container">
          <div className={styles.testimonialContainer}>
            <Image src={testimonials[testimonialIndex].logo} alt="Partner logo" width={240} height={120} className={styles.testimonialLogo} />
            <blockquote className={styles.testimonialQuote}>{testimonials[testimonialIndex].quote}</blockquote>
            <p className={styles.testimonialAuthor}>{testimonials[testimonialIndex].author}</p>
            <p className={styles.testimonialRole}>{testimonials[testimonialIndex].role}</p>

            <div className={styles.testimonialNav}>
              <button className={styles.testimonialNavBtn} onClick={handlePrevTestimonial}>
                <ChevronLeft size={20} />
              </button>
              <button className={styles.testimonialNavBtn} onClick={handleNextTestimonial}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Early Partners Section */}
      <section className={`${styles.partnersSection} section-padding`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.badge} ${styles.badgePartners}`}>Early partners</span>
            <h2 className={styles.sectionTitle}>
              Built with early university partners and <br />
              student communities
            </h2>
            <p className={styles.sectionSub}>We’re partnering with institutions and student communities to shape the verified digital campus.</p>
          </div>

          <div className={styles.partnersGrid}>
            {/* Partner 1 */}
            <div className={styles.partnerCard}>
              <div className={styles.partnerImgWrapper}>
                <Image src="/built.jpg" alt="KIET Campus" width={600} height={300} className={styles.partnerImg} />
              </div>
              <div className={styles.partnerContent}>
                <h3 className={styles.partnerTitle}>KIET Group of Institutions</h3>
                <p className={styles.partnerDesc}>Configuring a verified campus community across departments and student groups.</p>
              </div>
            </div>

            {/* Partner 2 */}
            <div className={styles.partnerCard}>
              <div className={styles.partnerImgWrapper}>
                <Image src="/built1.jpg" alt="Aggarwal College Campus" width={600} height={300} className={styles.partnerImg} />
              </div>
              <div className={styles.partnerContent}>
                <h3 className={styles.partnerTitle}>Aggarwal College</h3>
                <p className={styles.partnerDesc}>Exploring structured onboarding and official communication for students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Transform Section */}
      <section className={`${styles.ctaSection} section-padding`}>
        <div className="container">
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>Ready to transform your university?</h2>
            <p className={styles.ctaDesc}>Contact us to get started and kickstart using UniBuzz for your university today.</p>
            <Link href="/book-demo">
              <button className={styles.btnPrimary}>
                Book a Free Demo <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer minimal />
    </div>
  )
}
