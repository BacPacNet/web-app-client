import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/atoms/SectionHeader'

const partners = [
  {
    title: 'KIET Group of Institutions',
    description: 'Configuring a verified campus community across departments and student groups.',
    image: '/built.jpg',
    imageAlt: 'KIET Campus',
  },
  {
    title: 'Aggarwal College',
    description: 'Exploring structured onboarding and official communication for students.',
    image: '/built1.jpg',
    imageAlt: 'Aggarwal College Campus',
  },
]

export default function FacultyLandingPagePartners() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-[100px] px-4">
      <div className="mx-auto w-full max-width-allowed ">
        <SectionHeader
          badge="Early partners"
          badgeVariant="violet"
          title={
            <>
              Built with early university partners and <br />
              student communities
            </>
          }
          description="We're partnering with institutions and student communities to shape the verified digital campus."
          className="mb-10 sm:mb-[60px]"
        />

        <div className="mt-10 flex flex-col lg:flex-row gap-10 justify-center items-center">
          {partners.map(({ title, description, image, imageAlt }) => (
            <div key={title} className="flex w-full max-w-[380px] flex-col overflow-hidden shadow-lg rounded-xl">
              <div className="relative h-[236px] w-full overflow-hidden rounded-t-xl">
                <Image src={image} alt={imageAlt} width={380} height={236} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-grow flex-col gap-2 p-5 border border-slate-200 w-full rounded-b-xl">
                <h3 className="font-poppins text-[20px] font-semibold text-[#131A2B]">{title}</h3>
                <p className="font-inter text-xs text-[#5B6477]">{description}</p>
                <Link href="#story" className="mt-auto flex items-center gap-2 self-start text-2xs font-semibold text-primary-500 ">
                  Read the story <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
