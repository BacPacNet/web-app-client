import Image from 'next/image'
import { Check } from 'lucide-react'
import SectionHeader from '@/components/atoms/SectionHeader'
import slackIcon from '@/assets/facultyLanding/slackicon.svg'
import unibuddyIcon from '@/assets/facultyLanding/unibuddyicon.svg'
import chatbotdevIcon from '@/assets/facultyLanding/chatbotdevicon.svg'
import campusIcon from '@/assets/facultyLanding/campusicon.svg'

const competitors = [
  {
    name: 'Slack EDU',
    description: 'Team messaging platform',
    price: '₹300–₹500 / student',
    icon: slackIcon,
  },
  {
    name: 'Campus Groups',
    description: 'Campus engagement suite',
    price: '₹200–₹400 / student',
    icon: campusIcon,
  },
  {
    name: 'UniBuddy',
    description: 'Student connection platform',
    price: '₹300–₹800 / student',
    icon: unibuddyIcon,
  },
  {
    name: 'Custom Chatbot Dev',
    description: 'Bespoke AI development',
    price: '₹100–₹300 / student',
    icon: chatbotdevIcon,
  },
]

const unibuzzFeatures = ['Cost scales naturally with institution size', 'No large upfront investment', 'Accessible and easy to adopt']

export default function FacultyLandingPagePricing() {
  return (
    <section className="bg-white px-4 py-16 sm:py-20 lg:py-[100px]" id="pricing">
      <div className="mx-auto w-full max-width-allowed">
        <SectionHeader
          badge="Pricing"
          badgeVariant="indigo"
          title="Predictable plans built for "
          highlight="campus scale"
          description="Compare side-by-side and see how UniBuzz simplifies your communication stack while saving your institution's budget."
          descriptionClassName="max-w-[660px]"
        />

        <div className="mt-12 flex justify-center lg:mt-14">
          <div className="flex w-full max-w-[398px] flex-col overflow-hidden rounded-2xl border border-[#D1D5DB] shadow-xl lg:max-w-none lg:w-auto lg:flex-row lg:overflow-visible lg:rounded-none lg:border-0 lg:shadow-none">
            <div className="flex w-full flex-col gap-4 bg-white p-6 sm:p-8 lg:w-[398px] lg:rounded-2xl lg:rounded-r-none lg:border lg:border-r-0 lg:border-[#D1D5DB] lg:shadow-xl">
              <h3 className="font-poppins text-md-big font-bold text-[#131A2B]">Current Competitors</h3>

              <ul className="flex flex-col gap-3">
                {competitors.map((competitor) => (
                  <li key={competitor.name} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                      <Image src={competitor.icon} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="font-inter text-[15px] font-semibold text-neutral-900">{competitor.name}</p>
                      <p className="font-inter text-[13px] text-[#5B6477]">{competitor.description}</p>
                      <p className="w-max rounded-full bg-[#EEF0F4] px-2.5 py-1 text-center font-inter text-2xs font-semibold text-neutral-700">
                        {competitor.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full flex-col gap-5 bg-[#F5F3FF] p-6 sm:p-8 lg:w-[398px] lg:min-h-0 h-[604px] lg:gap-5 lg:rounded-2xl lg:rounded-l-none lg:border lg:border-l-0 lg:border-[#D1D5DB] lg:p-10 lg:shadow-xl">
              <h3 className="font-poppins text-md-big font-bold text-primary-500">UniBuzz</h3>

              <div className="flex items-center justify-start rounded-xl border-2 border-primary-500 bg-white p-5 sm:p-6">
                <p className="flex items-baseline gap-2 font-poppins text-[32px] font-extrabold text-primary-500">
                  ₹10 <span className="text-sm font-semibold text-[#5B6477]">per student</span>
                </p>
              </div>

              <div>
                <p className="font-poppins text-[20px] font-semibold text-[#131A2B]">Per-Student Pricing</p>
                <p className="mt-1 font-inter text-xs text-[#5B6477]">
                  Monthly or annual plans with flexibility to match your institution&apos;s needs
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {unibuzzFeatures.map((feature) => (
                  <li key={feature} className="flex items-center justify-start gap-3">
                    <Check size={14} strokeWidth={3} className="shrink-0 text-primary-500" />
                    <p className="font-inter text-xs font-medium text-neutral-700">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
