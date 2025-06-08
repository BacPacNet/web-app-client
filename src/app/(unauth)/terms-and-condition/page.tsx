import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/terms-and-condition`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz-logo.png'

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

      <p className="text-neutral-500 font-normal md:text-xs text-2xs mb-4">Effective Date: August 1, 2024</p>

      <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
        Welcome to Unibuzz! A vibrant social media platform where students connect and share ideas. These Terms and Conditions (&quot;Terms&quot;)
        govern your access to and use of Unibuzz Networks Pty Ltd (herein referred to as Unibuzz Networks) website, mobile application, and related
        services (collectively, the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these Terms, our Privacy Policy,
        and any additional terms applicable to certain features of the Service, which are incorporated herein by reference.
      </p>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Acceptance of Terms</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          By creating an account, accessing, or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms.
          If you are using the Service on behalf of an organization or entity, you are agreeing to these Terms for that organization and promising
          that you have the authority to bind that organization to these Terms.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Changes to Terms</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          We reserve the right to modify these Terms at any time. We will notify you of any material changes to the Terms by posting the new Terms on
          the Service and updating the &quot;Effective Date&quot; above. Your continued use of the Service after any such changes take effect
          constitutes your acceptance of the new Terms.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Your Account</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          You must provide accurate and complete information when creating an account and keep this information up to date. You are responsible for
          maintaining the confidentiality of your account password and for all activities that occur under your account. Unibuzz Networks is not
          liable for any loss or damage arising from your failure to comply with this requirement.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">User Content</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          You retain all ownership rights in your User Content. However, by submitting, posting, or displaying User Content, you grant Unibuzz
          Networks a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify,
          publish, transmit, display, and distribute such User Content in any and all media or distribution methods (now known or later developed).
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Prohibited Conduct</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or disclosing any part of the Service in
          any medium, including without limitation by any automated or non-automated &quot;scraping&quot;; (ii) using any automated system, including
          without limitation &quot;robots,&quot; &quot;spiders,&quot; &quot;offline readers,&quot; etc., to access the Service; (iii) transmitting
          spam, chain letters, or other unsolicited email; (iv) attempting to interfere with, compromise the system integrity or security, or decipher
          any transmissions to or from the servers running the Service; (v) taking any action that imposes, or may impose at our sole discretion an
          unreasonable or disproportionately large load on our infrastructure; (vi) uploading invalid data, viruses, worms, or other software agents
          through the Service; (vii) collecting or harvesting any personally identifiable information, including account names, from the Service;
          (viii) using the Service for any commercial solicitation purposes; (ix) impersonating another person or otherwise misrepresenting your
          affiliation with a person or entity, conducting fraud, hiding or attempting to hide your identity; (x) interfering with the proper working
          of the Service; (xi) accessing any content on the Service through any technology or means other than those provided or authorized by the
          Service; or (xii) bypassing the measures we may use to prevent or restrict access to the Service, including without limitation features that
          prevent or restrict use or copying of any content or enforce limitations on use of the Service or the content therein.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Privacy</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          Your privacy is important to us. Our Privacy Policy explains how we collect, use, and share information about you and is incorporated into
          these Terms by reference. By using the Service, you agree to the collection, use, and sharing of your information as set forth in the
          Privacy Policy.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Security</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          We care about the integrity and security of your personal information. However, we cannot guarantee that unauthorized third parties will
          never be able to defeat our security measures or use your personal information for improper purposes. You acknowledge that you provide your
          personal information at your own risk.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Third-Party Links, Sites, and Services</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          The Service may contain links to third-party websites, advertisers, services, special offers, or other events or activities that are not
          owned or controlled by Unibuzz Networks. Unibuzz Networks does not endorse or assume any responsibility for any such third-party sites,
          information, materials, products, or services. If you access a third-party website from the Service, you do so at your own risk, and you
          understand that these Terms and Unibuzz Network&apos;s Privacy Policy do not apply to your use of such sites.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Termination</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          Unibuzz may terminate or suspend your access to or ability to use the Service immediately, without prior notice or liability, for any reason
          whatsoever, including without limitation if you breach the Terms. Upon termination of your access, your right to use the Service will
          immediately cease.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Indemnity</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          You agree to defend, indemnify, and hold harmless Unibuzz Networks, its officers, directors, employees, and agents, from and against any
          claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorneys&apos; fees and costs, arising out of
          or in any way connected with: (i) your access to or use of the Service; (ii) your violation of any term of these Terms; (iii) your violation
          of any third-party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that your User Content
          caused damage to a third party. This defense and indemnification obligation will survive these Terms and your use of the Service.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Disclaimer of Warranty</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Use of the Service is at your own risk. To the maximum
          extent permitted by applicable law, the Service is provided without warranties of any kind, whether express or implied, including, but not
          limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. No advice or information, whether
          oral or written, obtained by you from Unibuzz Networks or through the Service will create any warranty not expressly stated herein. Without
          limiting the foregoing, Unibuzz Networks, its subsidiaries, its affiliates, and its licensors do not warrant that the content is accurate,
          reliable or correct; that the Service will meet your requirements; that the Service will be available at any particular time or location,
          uninterrupted or secure; that any defects or errors will be corrected; or that the Service is free of viruses or other harmful components.
          Any content downloaded or otherwise obtained through the use of the Service is downloaded at your own risk and you will be solely
          responsible for any damage to your computer system or mobile device or loss of data that results from such download or your use of the
          Service.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Limitation of Liability</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          To the maximum extent permitted by applicable law, in no event shall Unibuzz Networks, its affiliates, agents, directors, employees,
          suppliers, or licensors be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including without
          limitation damages for loss of profits, goodwill, use, data, or other intangible losses, that result from the use of, or inability to use,
          this Service. Under no circumstance will Unibuzz Networks be responsible for any damage, loss, or injury resulting from hacking, tampering,
          or other unauthorized access or use of the Service or your account or the information contained therein. This limitation of liability
          section applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if Unibuzz
          Networks has been advised of the possibility of such damage.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Governing Law</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          These Terms shall be governed by and construed in accordance with the laws of the country you are residing in, without giving effect to any
          principles of conflicts of law.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Dispute Resolution</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          You agree that any disputes between you and Unibuzz Networks will be resolved by binding, individual arbitration and you waive your right to
          participate in a class action lawsuit or class-wide arbitration. We explain the process in more detail in our Arbitration Agreement included
          in these Terms.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">General</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          These Terms, together with the Privacy Policy and any amendments and any additional agreements you may enter into with Unibuzz Networks in
          connection with the Service, shall constitute the entire agreement between you and Unibuzz Networks concerning the Service. If any provision
          of these Terms is deemed invalid by a court of competent jurisdiction, the invalidity of such provision shall not affect the validity of the
          remaining provisions of these Terms, which shall remain in full force and effect.
        </p>
      </section>
      {/*</div>*/}
    </main>
  )
}
