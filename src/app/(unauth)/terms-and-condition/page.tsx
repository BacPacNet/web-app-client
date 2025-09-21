import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/terms-and-condition`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz_logo_extralarge.png'

  return {
    title: 'Terms and Conditions | UniBuzz',
    description: 'Read the UniBuzz Terms and Conditions to understand the rules and guidelines for using our services.',
    openGraph: {
      title: 'Terms and Conditions | UniBuzz',
      description: 'Read the UniBuzz Terms and Conditions to understand the rules and guidelines for using our services.',
      url,
      siteName: 'UniBuzz',
      images: [
        {
          url: ogImage,
          width: 52,
          height: 52,
          alt: 'Terms and Conditions page on UniBuzz',
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

export default function TermsAndCondition() {
  return (
    <main className="max-width-allowed mx-auto md:px-0 px-4 pt-8 pb-4 text-justify">
      {/*<div className="mx-auto max-w-4xl">*/}
      <h1 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Terms and Conditions</h1>

      <p className="text-neutral-500 font-normal md:text-xs text-2xs mb-4">Updated: September 20, 2025</p>
      <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6"> Welcome to Unibuzz!</h2>
      <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
        Unibuzz is a platform for students, university applicants, alumni, and faculty to connect, collaborate, and share. These Terms of Service
        (&quot;Terms&quot;) form a legal agreement between &quot;you&quot; (or &quot;User&quot;) and Unibuzz Networks Pty Ltd (&quot;Unibuzz
        Networks&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By using Unibuzz, users agree to these Terms, the Privacy Policy, and any
        community guidelines or policies published. If you do not agree, please do not use the Service.
      </p>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Who Can Use Unibuzz</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2">
          <li>• Users must be at least 13 years old (or the minimum legal age in their jurisdiction).</li>
          <li>• To access university communities, users must verify a valid university-affiliated email (e.g., .edu, .ac.in, etc.).</li>
          <li>
            • If a user does not have a university-affiliated email and/or is unable to verify their university, they are instructed to use the
            Contact Us form.
          </li>
          <li>
            • If a user is using Unibuzz on behalf of a university or organization, they represent that they have authority to bind them to these
            Terms.
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Changes to These Terms</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2">
          <li>• Unibuzz states that they may update these Terms from time to time.</li>
          <li>• If material changes are made, users will be notified via the platform or email before they take effect.</li>
          <li>• Continued use of Unibuzz after changes means agreement to the new Terms.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Your Account</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          Users are responsible for their account and the information associated with it.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-2">Key responsibilities include:</p>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2 ml-4">
          <li>• Keeping passwords secure.</li>
          <li>• Not sharing login credentials.</li>
          <li>• Notifying Unibuzz of any unauthorized use.</li>
          <li>• The ability to close an account anytime from settings.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Content and Intellectual Property</h2>

        <div className="mb-8">
          <h3 className="font-poppins text-[16px] font-semibold text-neutral-700 mb-4">Your Content</h3>
          <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-4 space-y-2">
            <li>• Users own the content they post (photos, messages, links, etc.).</li>
            <li>
              • By posting on Unibuzz, users grant Unibuzz a worldwide, royalty-free license to use, display, reproduce, and distribute content as
              necessary to operate and improve the Service.
            </li>
          </ul>
        </div>

        <div className="mb-16">
          <h3 className="font-poppins text-[16px] font-semibold text-neutral-700 mb-4">Our Content</h3>
          <ul className="text-neutral-600 font-normal md:text-xs text-2xs space-y-2">
            <li>• All software, code, and branding associated with Unibuzz is owned by Unibuzz Networks or its licensors.</li>
            <li>• This content is protected by copyright and trademark laws.</li>
          </ul>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Acceptable Use Policy</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">Users agree not to use Unibuzz to:</p>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-4 space-y-2">
          <li>• Post illegal, harmful, or abusive content.</li>
          <li>• Harass, impersonate, or threaten others.</li>
          <li>• Share false, misleading, or confidential information.</li>
          <li>• Access data or systems they&apos;re not authorized to access.</li>
          <li>• Upload viruses or spam.</li>
          <li>• Use bots or automated tools to scrape or manipulate content.</li>
          <li>• Bypass access restrictions, such as email verification.</li>
        </ul>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          Unibuzz reserves the right to remove content or suspend users for violating these rules.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Enforcement and Termination</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">An account may be suspended or terminated without notice if:</p>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-4 space-y-2">
          <li>• You violate these Terms or our policies.</li>
          <li>• Your actions threaten the integrity, safety, or reputation of the platform.</li>
        </ul>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">Users may also delete your account at any time.</p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          Termination does not affect rights and obligations that arose before.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Feedback and Suggestions</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We encourage you to share ideas through the Contact Us form or on our official Discord server.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          While not every suggestion can be implemented, all feedback is carefully reviewed.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          By submitting feedback, ideas, or feature requests, you grant us the right to use it freely and without obligation.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          Unibuzz is a user-friendly platform built with students in mind, and we take feedback seriously to continuously improve the experience by
          adding helpful and innovative features.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Third-Party Services</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2">
          <li>• Unibuzz may include links to third-party websites or tools.</li>
          <li>• We do not control them and are not responsible for their content, practices, or availability.</li>
          <li>• Your use of third-party services is governed by their terms, not ours.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Copyright Complaints (DMCA)</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          If you believe your copyrighted work was posted on Unibuzz without permission, please email us at legal@unibuzz.com with the following
          information:
        </p>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-4 space-y-2">
          <li>• A description of the work</li>
          <li>• The URL of the infringing content</li>
          <li>• Your contact information</li>
          <li>• A statement that you believe in good faith that the use is unauthorized</li>
          <li>• Your signature (physical or digital)</li>
        </ul>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          We will review and, if necessary, remove the content in accordance with applicable laws.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Data and Privacy</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2">
          <li>• We take your privacy seriously.</li>
          <li>• Review our Privacy Policy to understand what data we collect, how we use it, and your choices.</li>
          <li>• By using Unibuzz, you consent to our data practices.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Security</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2">
          <li>
            • We take data security seriously and implement reasonable administrative, technical, and physical safeguards to protect your information.
          </li>
          <li>• We regularly update our systems and monitor for threats to maintain a safe environment for our users.</li>
          <li>• However, no method of data transmission or storage is 100% secure.</li>
          <li>
            • You acknowledge that you provide your personal information at your own risk and we cannot guarantee absolute protection against
            unauthorized access or breaches.
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Disclaimers</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2">
          <li>• We provide Unibuzz &quot;as is&quot; and &quot;as available.&quot;</li>
          <li>• We do not make warranties about uptime, accuracy, or performance.</li>
          <li>• We are not liable for losses due to outages, unauthorized access, or data loss.</li>
        </ul>
      </section>
      {/* 
      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Indemnity</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          You agree to defend, indemnify, and hold harmless Unibuzz Networks from and against any claims arising out of your use of the Service or
          violation of these Terms.
        </p>
      </section> */}

      {/* <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Disclaimer of Warranty</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Use of the Service is at your own risk. We make no
          warranties about the accuracy, reliability, or availability of the Service.
        </p>
      </section> */}

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Limitation of Liability</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">Unibuzz is not liable for:</p>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-4 space-y-2">
          <li>• Indirect, incidental, or consequential damages.</li>
          <li>• Lost profits or loss of data.</li>
          <li>• Unauthorized access or use of your account.</li>
        </ul>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          Total liability is limited to the amount paid to Unibuzz (if any) in the last 12 months.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Governing Laws and Dispute Resolution</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-4 space-y-2">
          <li>• Users waive the right to participate in class actions or jury trials.</li>
          <li>• We encourage users to first contact Unibuzz via the &quot;Contact Us&quot; form for disputes, aiming for informal resolution.</li>
          <li>
            • If informal resolution fails, disputes will be resolved under the jurisdiction of competent courts in India, according to applicable
            laws.
          </li>
          <li>• The Terms are governed by the laws of India. Users outside India are responsible for complying with their local laws.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Export Control</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2">
          <li>• Prohibits using or exporting Unibuzz in violation of applicable export control laws.</li>
          <li>• Users must comply with all local laws regarding online conduct and content.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">University Responsibilities and Liability</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          Affiliated universities are responsible only for content and activities within official university spaces, including:
        </p>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-4 space-y-2">
          <li>• Posts, announcements, and updates by university administrators in the official university feed.</li>
          <li>• Content and discussions within official groups.</li>
        </ul>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          Universities are <em>not</em> responsible or liable for activities outside official spaces, such as:
        </p>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-4 space-y-2">
          <li>• Personal and group messaging.</li>
          <li>• Student-created casual groups.</li>
          <li>• Posts or comments on individual timelines.</li>
        </ul>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          This limitation does not permit misconduct. All users must comply with Unibuzz&apos;s User Guidelines and local university rules. Violations
          may lead to disciplinary action by Unibuzz (including suspension or permanent bans) and potential action by the affiliated university.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Entire Agreement</h2>
        <ul className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 space-y-2">
          <li>
            • These Terms, the Privacy Policy, and any supplemental agreements (e.g., for university partnerships) constitute the entire agreement
            between the user and Unibuzz.
          </li>
          <li>• If any part is found unenforceable, the remaining parts still apply.</li>
        </ul>
      </section>
      {/*</div>*/}
    </main>
  )
}
