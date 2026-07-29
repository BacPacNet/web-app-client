import { ArrowRight, Check, X } from 'lucide-react'
import SectionHeader from '@/components/atoms/SectionHeader'

const currentWayItems = [
  'Scattered across WhatsApp, Instagram & email',
  'Announcements buried, half-read or missed',
  'Anonymous groups no one can verify or govern',
  'Static websites with limited applicant engagement',
  'No institutional control or data ownership',
]

const unibuzzWayItems = [
  'One app for announcements, groups, and events',
  'Official announcements every student sees',
  'Verified student, faculty & admin identities',
  'Stronger applicant engagement and admissions pipeline',
  'Full admin control and institutional data ownership',
]

export default function FacultyLandingPageComparison() {
  return (
    <section className="bg-white py-24 px-4" id="comparison">
      <div className="mx-auto w-full max-width-allowed">
        <SectionHeader
          badge="Why universities need to switch"
          badgeVariant="indigo"
          title={
            <>
              Top universities are leaving <br /> <span className="text-[#B91C1C]">fragmented tools</span> behind
            </>
          }
          description="Campus life runs on a patchwork of consumer apps no institution can see or govern. Unibuzz replaces it with one verified space."
          descriptionClassName="max-w-[560px]"
        />

        <div className="mt-12 flex flex-col items-center justify-between gap-6 lg:mt-14 lg:flex-row lg:items-center lg:gap-6">
          <div className="w-full flex flex-col gap-5 flex-1 rounded-2xl border border-[#FDD2D2] bg-[#FFF8F8] p-6 shadow-lg ">
            <p className="font-inter text-2xs font-bold   text-[#DC3737]">The Current Way</p>
            <h3 className=" font-poppins text-lg-small font-bold text-[#DC3737] ">3+ tools</h3>
            <p className=" font-inter text-xs text-[#5B6477]">fragmented across your campus</p>

            <ul className="flex flex-col gap-4">
              {currentWayItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className=" flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFDADA]">
                    <X size={12} strokeWidth={3} className="text-[#DC3737]" />
                  </span>
                  <p className="font-inter text-xs  text-[#5B6477]">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9CA3AF] shadow-md">
              <ArrowRight size={20} className="rotate-90 text-white lg:rotate-0" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-5 flex-1 rounded-2xl border border-indigo-100 bg-[#F5F3FF] p-6 shadow-lg">
            <p className="font-inter text-2xs font-bold text-primary-500">The Unibuzz Way</p>
            <h3 className="font-poppins text-lg-small font-bold text-primary-500">1 platform</h3>
            <p className="font-inter text-xs text-[#5B6477]">for everything campus-wide</p>

            <ul className="flex flex-col gap-4">
              {unibuzzWayItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D7D0FF]">
                    <Check size={12} strokeWidth={3} className="text-primary-500" />
                  </span>
                  <p className="font-inter text-xs text-[#5B6477]">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
