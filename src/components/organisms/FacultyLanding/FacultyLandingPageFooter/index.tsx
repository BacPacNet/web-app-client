import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { StaticImageData } from 'next/image'
import unibuzzLogo from '@assets/unibuzz_logo.svg'
import linkedin from '@assets/linkedin.svg'
import insta from '@assets/insta.svg'

type FooterLink = {
  label: string
  href: string
  icon?: StaticImageData
  external?: boolean
}

const platformLinks: FooterLink[] = [
  { label: 'Community', href: '/timeline' },
  { label: 'Discover', href: '/discover' },
  { label: 'About Us', href: '/about' },
  { label: 'Blogs', href: '#' },
]

const legalLinks: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms and Conditions', href: '/terms-and-condition' },
  { label: 'Usability Guidelines', href: '/user-guidelines' },
]

const companyLinks: FooterLink[] = [
  { label: 'Contact Us', href: '/contact' },
  {
    label: 'LinkedIn',
    href: 'https://in.linkedin.com/company/unibuzznetworks',
    icon: linkedin,
    external: true,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/uni.buzz',
    icon: insta,
    external: true,
  },
]

const footerColumns: { title: string; links: FooterLink[] }[] = [
  { title: 'Platform', links: platformLinks },
  { title: 'Legal', links: legalLinks },
  { title: 'Company', links: companyLinks },
]

const linkClassName = 'inline-flex items-center gap-2 font-inter text-xs text-[#3A169C]'

function FooterLinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-inter text-2xs font-semibold uppercase tracking-wider text-[#3A169C]">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map(({ label, href, icon, external }) => (
          <li key={label}>
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                {icon ? <Image src={icon} alt="" width={18} height={18} className="h-[18px] w-[18px]" /> : null}
                {label}
              </a>
            ) : (
              <Link href={href} className={linkClassName}>
                {icon ? <Image src={icon} alt="" width={18} height={18} className="h-[18px] w-[18px]" /> : null}
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function FacultyLandingPageFooter() {
  return (
    <footer className="bg-surface-primary-50 px-4 py-16 sm:py-20 lg:py-[100px]" id="footer">
      <div className="mx-auto w-full max-width-allowed">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="max-w-[320px] font-poppins text-md font-bold text-[#3A169C] sm:max-w-none sm:text-lg-small lg:text-[36px]">
            Ready to transform your university?
          </h2>
          <p className="font-inter text-xs text-[#3A169C] sm:text-2sm">Contact us to get started today.</p>
          <Link
            href="/book-demo"
            className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-3 font-inter text-xs font-medium text-white transition-transform duration-150 active:scale-95"
          >
            Book a Demo <ArrowRight size={16} />
          </Link>
        </div>

        <div className="my-10 h-px w-full bg-[#3A169C] sm:my-14 lg:my-16" />

        <div className="flex flex-col gap-10 py-6 sm:py-10 lg:flex-row lg:justify-between lg:gap-16 lg:px-6 lg:py-14">
          <div className="order-2 flex max-w-[320px] flex-col gap-4 lg:order-1">
            <Link href="/faculty" aria-label="Unibuzz home">
              <Image src={unibuzzLogo} alt="Unibuzz" width={120} height={22} className="h-[22px] w-auto" />
            </Link>
            <p className="font-inter text-xs text-[#3A169C]">
              A verified digital campus platform helping universities centralize communication and engagement.
            </p>
            <p className="font-inter text-xs text-[#3A169C]">© 2026 Unibuzz. All rights reserved.</p>
          </div>

          <div className="order-1 flex flex-col gap-8 lg:order-2 lg:flex-row lg:gap-20">
            {footerColumns.map(({ title, links }) => (
              <FooterLinkColumn key={title} title={title} links={links} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
