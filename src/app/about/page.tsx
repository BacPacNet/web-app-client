'use client'
import { CiMail } from 'react-icons/ci'
import { IoFileTrayStackedOutline } from 'react-icons/io5'
import { HiOutlinePencil } from 'react-icons/hi'
import { PiRobotBold } from 'react-icons/pi'
import { IoIosSearch } from 'react-icons/io'
import { BsDiscord } from 'react-icons/bs'
import { HiMiniUserGroup } from 'react-icons/hi2'
import { RiMessage2Fill } from 'react-icons/ri'
import image1 from '@assets/image1.svg'
import image2 from '@assets/image2.svg'
import image3 from '@assets/image3.svg'
import image4 from '@assets/image4.svg'
import heroTabletBanner from '@assets/heroTabletBanner.svg'
import heroMobileBanner from '@assets/heroMobileBanner.svg'

import Image from 'next/image'
import useDeviceType from '@/hooks/useDeviceType'
import Buttons from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'

const features = [
  {
    title: 'Private and Group Messaging',
    description: 'Communicate one-on-one or within groups in a secure and user-friendly interface.',
    icon: <CiMail className="text-blue-600" />,
  },
  {
    title: 'LaTeX Editing',
    description: 'Communicate scientific and mathematical information directly within our platform.',
    icon: <HiOutlinePencil />,
  },
  {
    title: 'Large File Transfers',
    description: 'Transfer large files such as ebooks or research material based on your plan.',
    icon: <IoFileTrayStackedOutline />,
  },
  {
    title: 'AI Assistant',
    description: 'Ask anything related to your university to our AI Assistant.',
    icon: <PiRobotBold />,
  },
  {
    title: 'Smart Search and Filters',
    description: 'Instantly find your university, courses, clubs, circles, and people.',
    icon: <IoIosSearch />,
  },
  {
    title: 'Intuitive Organization',
    description: 'Have all your universities and groups organized neatly with our intuitive interface.',
    icon: <HiMiniUserGroup />,
  },
]

const team = [
  {
    name: 'Aryan Bansal',
    role: 'CEO',
    image:
      'https://s3-alpha-sig.figma.com/img/deda/eb3a/9c059325b17a935caace6784c9208d29?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Zp6uTPwl52LZIgu5jt9T9HhNuFYDGHxHVnwmSu8jSKRrH7Ur-9rYnZzRtrRGEP9bsskX~5UGXoROITOqXNge2W4vF6ylAef07NJBQTA-H3djvySWU1A4ejoKfgb48D8TL1XZiCqVX0523ImEtqsr7CnVhpNwg~AIifTdLeHjzVuUhh9MCE1ylWYutmVd-5dIAUpO24X1wYOZE4NbmUDPd~oIbAzbi2PNtCSdh3RTi6~PI0FrQyAj84Lpxc5C~rwqJM7QKGRz1HMwsC6ixsgz1TOA9QgeMCQqkc-vPdVYYg311iaTp0TmTAt4lNKYzjLRzkgaL61tl-S280sHFRBFBg__',
  },
  {
    name: 'Robin Park',
    role: 'CPO, Lead Designer',
    image:
      'https://s3-alpha-sig.figma.com/img/84fe/1187/e58bc3e17d6addbce52bf28c916f8812?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=HqWDLOfvXuokOdxvrbuOulACfku3rMbWVEgdVsGyKWVEbhUKuHN~0tVgXwuQhIrdUnII0PFqZlMYjV2hl~8JlUtfvqEdh3BN25V~nmRuvLQ-7LgFMRs9CJbnR3WIn~ZhdoYRDbyl84DyLb0554b74S8K3A20-NE6YwuUZmFPyjZGAmcd~51jY8uYwuRxVGcuJpblhQJ2oD5-h8Q~ylEaIkoynDS6D8ob3bfhInjYCdcPo-mm-AtHHtY77-WnjLsBjXg3UCe0TKoiqA-SPxNcHFBlkA-xDA2jz5M6hw6Sav52tcCsY09yvE4OXaDEFtp2MFCRzjmwthXUUAi7fHBZ3g__',
  },
  {
    name: 'Isha Gupta',
    role: 'CMO',
    image:
      'https://s3-alpha-sig.figma.com/img/0eb8/3b01/95a9ee1ce53a6a54a6ae32ff1d5c1952?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NcOvnMc97FyBZrebBvOFUg1qsussnPLRn6HZ3dPFmzhE5MokFCnKYYRBwvtSBuZ1aKivHHCOUf7QUVwgQuZXuDbVUvMLkExo92MMimEKMMNZF7cBKRPmkJaN9iHn4dPZehDuU2CfH6VeGyaMZv1jzgC~1efrGAe9PdFpeXgK~xHT~Hg~ZcC9sFxVZBfaZ7LyJzk~IahCkkaIbdtMT0uGg~O83KY5bamSxJtZMQlTOWDu5KN4UdB1VOefx8BlEITfhWDfEG2nhcTUkMYoFPbj3uLJ5oCaa2qEhbzmQwjsgJTQH1PM2rAEBCitPovVydwGTjeAXqRcSFBcyOhgZGLf8w__',
  },
  {
    name: 'Pratik Yadav',
    role: 'CTO, Lead Developer',
    image:
      'https://s3-alpha-sig.figma.com/img/30b8/5d23/ac61e3512454831c7b23b26ad6951684?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=aQMIAl~rPtoWvUfZMj0DmpK4OgfzpG1JK7HfUxWWV0vEzcNOcrJv~Dc4TP53ENtNx45goxhtcNq80P182GeRLv865ZgDEDvi46kavBUEdUgQSVW0YcgqIa9VE-auwhzLyfR7YD9-zXLXifi2461oATklkPg0kXu9GigMa4XCPbWxSil~ECcrrKv-w~JAYJ1p11qTlAm7Va3OeP2ZXNOCBmfGvMD86uy5XJgd2I9jvDc39tpak-S4lEl9-GjoQVo39a6QFLodZZxU~2k0NUiQYUzjBC72hkT3JpxOGzXNqX8zdesV3vW5~ekcoMYcg-ExM1oAFImy9X4FNwFBMgtzgA__',
  },
  {
    name: 'Aamil',
    role: 'Full-Stack Engineer',
    image:
      'https://s3-alpha-sig.figma.com/img/52db/3fc2/365f7ffeb1b997dcc6c4d877bb9e2d7e?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=DmxcMRV~KZ1Ogv2gGNHupKrcWfvDQBvKbcHQJy8ZYFTp12pu4H52jMw5oCYdupY4iymdG7cnt6Q6pdY3sGUGKG7TmhSx4gPdEb6uAtolF23w5dWqUJgSZITp9LKyTtB9ydfO8TrdHCZthkCS~Xg3CBaYSjx8YcHU7q2FA3uLwHChOtTQ3N2UeQAVNixA8fjB5j4zQbwkchR60lowWSb0KKq6MHoSVGCXQMxpo69Ia3JoWHBuBXO6d4JT-gd6UcZhxjkNs~uAKKXN50cZGnxtQPhyV6gR0dtm1pflsKxPe4RSXUEyUe6cny2x~PGrwm-HdlPPiB3W8FbiWDIzpe3Bjw__',
  },
]
const About = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceType()
  return (
    <>
      <div className="md:px-6 sm:px-8 px-4 md:pt-32 pt-16 ">
        <main className="flex flex-col items-center justify-center md:gap-28 gap-16">
          {/* JOin UNiversity Section */}
          <section className="flex md:flex-row flex-col justify-between items-center gap-20 w-full max-w-6xl">
            <div className="md:max-w-xl md:text-left text-center">
              <h3 className=" text-primary-500 font-semibold uppercase font-poppins">Join Your University Community</h3>
              <h1 className="md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3 font-poppins">All-in-one university network</h1>
              <SupportingText className="mt-6">The premier social network platform made entirely for university students and faculty.</SupportingText>
            </div>
            <Image
              src={
                isMobile
                  ? heroMobileBanner
                  : isTablet
                  ? heroTabletBanner
                  : 'https://s3-alpha-sig.figma.com/img/82ea/05b8/55c309cd7efcc592e38afbb8d182e760?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=qVfkZoQBZsxYy9peij3rb0o89dT42jgBCCPXL9q-8DsrHUYPiIM97wZPiD45a16xemxyG3jwFJwvOEF6IZM~4ZWIdVI7H2IsqYV~A~WcMhlT2NZIdVwpjpW71IWArHT-OCPaLAPCRKJZCXwjyamiYSM29ruiGA59IzXwed8HL4TJJ~xEGWGSNhCx3rLwSiKfvbAc8c0rEvaXZq5HTXQRMQiucAo9SjieA4srjwWHf1Dxd9bAw8SAeLkl2ePCU76zd7e5qzG0lPubHoBu9~UO1XS9MdNC7qaDcUwU2ib4rcEDiptyOS8a1uO8WNw78FRHHpYYiAHQCKZ5eHCPY271qA__'
              }
              alt="Mobile UI"
              width={500}
              height={100}
            />
          </section>

          {/* Welcome Unibuzz Section */}
          <section className="flex md:flex-row flex-col justify-between md:gap-20 gap-10 items-center w-full max-w-6xl">
            <Image src={image1} alt="Welcome Unibuzz" width={507} height={314} />
            <div className="max-w-xl md:text-left text-center">
              <h1 className="font-poppins md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3">Welcome to Unibuzz!</h1>
              <SupportingText className="mt-4">
                Welcome to Unibuzz, the global university network that caters to your university needs.
              </SupportingText>
            </div>
          </section>

          {/* Search University Section */}
          <section className="flex md:flex-row flex-col-reverse justify-between md:gap-20 gap-10 items-center max-w-6xl space-x-4">
            <div className="md:text-left text-center">
              <h1 className="font-poppins md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3">First, search your university.</h1>
              <SupportingText className="mt-4">
                Find your university from our database and get ready to join the vibrant community within it!
              </SupportingText>
            </div>
            <Image src={image2} alt="Search University" width={549} height={220} />
          </section>

          {/* Join University Section */}
          <section className="flex md:flex-row flex-col justify-between md:gap-20 gap-10 items-center max-w-6xl">
            <Image src={image3} alt="Join University" width={523} height={202} />
            <div className="md:text-left text-center">
              <h1 className="font-poppins md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3">Join your university community.</h1>
              <p className=" md:max-w-md max-w-2xl text-neutral-500 mt-4">
                Gain access to the university community to communicate with current, past, and future students!
              </p>
            </div>
          </section>

          {/* Enjoy Features Section */}
          <section className="flex md:flex-row flex-col-reverse justify-between md:gap-20 gap-10 items-center max-w-6xl">
            <div className="md:text-left text-center">
              <h1 className="font-poppins md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3">Lastly, enjoy the features</h1>
              <p className=" md:max-w-md max-w-2xl text-neutral-500 mt-4">
                With a wide range of social networking features, messaging, and an AI powered assistant, we will make your university life a blast.
                Download our mobile app for syncing!
              </p>
            </div>
            <Image src={image4} alt="Join University" width={466} height={374} />
          </section>
        </main>

        {/* UNiversity features cards section */}
        <section className="bg-surface-neutral-100 flex flex-col items-center gap-6 md:pt-24 sm:pt-16 pt-12 px-8 md:pb-32 sm:pb-20 pb-14 mt-10">
          <h2 className="font-poppins md:text-4xl sm:text-3xl text-2xl max-w-lg font-bold text-neutral-700 text-center">
            Features made for everything university related.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:mt-8 sm:mt-6 mt-4 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-start bg-white py-6 px-4 rounded-sm shadow-lg text-left gap-3">
                <div className="xs:p-3 p-2 md:text-2xl xs:text-xl text-lg bg-[#F3F2FF] text-primary-500 rounded-full">{feature.icon}</div>
                <h3 className="font-poppins text-md font-semibold text-neutral-700">{feature.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        {/* TEam section */}
        <section className="md:py-24 py-16 px-8 text-center">
          <h2 className="font-poppins md:text-4xl sm:text-3xl text-2xl font-bold text-neutral-700">Meet our team</h2>
          <p className="text-gray-500 font-medium mt-4">The Unibuzz team is here to help you with your university life</p>
          <div className="flex flex-wrap justify-center md:gap-24 sm:gap-20 gap-10 mt-8">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="w-[112px] h-[112px] md:w-[150px] md:h-[150px]  md:min-h-[150px] object-cover rounded-full"
                />
                <h3 className="font-poppins mt-4 font-medium text-neutral-700">{member.name}</h3>
                <p className="text-sm text-neutral-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Bottom contact cards */}
        <section className="md:py-24 py-10 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-10">
            {/* Discord Community Card */}
            <div className="bg-[#F9FAFB] py-10 md:px-16 sm:px-10 px-6 rounded-sm items-center flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="p-4 bg-[#F3F2FF] rounded-full">
                  <BsDiscord size={25} className="text-[#6744FF]" />
                </div>
              </div>
              <h3 className="font-poppins md:text-md text-sm text-center font-semibold text-neutral-700">Join our Discord Community</h3>
              <p className="sm:text-sm text-xs text-neutral-700  text-center">
                Keep up with the latest updates, send us your thoughts or personal feedback, and take part in the development process.
              </p>
              <Buttons variant="primary">Join Discord</Buttons>
            </div>

            {/* Contact Support Card */}
            <div className="bg-[#F9FAFB] py-10 md:px-16 sm:px-10 px-6 rounded-sm items-center flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="p-4 bg-[#F3F2FF] rounded-full">
                  <RiMessage2Fill size={25} className="text-[#6744FF]" />
                </div>
              </div>
              <h3 className="font-poppins md:text-md text-sm font-semibold text-neutral-700 text-center">Contact customer support</h3>
              <p className="sm:text-sm text-xs text-neutral-700  text-center">
                Do you have any issues while using Unibuzz? Contact us through customer support and we will get back to you asap.
              </p>
              <Buttons variant="primary">Contact Support</Buttons>
            </div>
          </div>
        </section>
        {/* Team section */}
      </div>
    </>
  )
}

export default About
