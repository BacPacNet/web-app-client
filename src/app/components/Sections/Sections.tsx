'use client'

import './Sections.css'

import Image from 'next/image'

import applicantModel from '../../../assets/applicantModel.png'
import facultyModel from '../../../assets/facultyModel.png'
import sectionNumber from '../../../assets/Number Label.png'
import studentModel from '../../../assets/studentModel.png'

//interface SectionContentItem {
//  title: string
//  subTitle: string
//  desc: string
//  image: StaticImageData
//  className: string
//  subClass: string
//  animation: string[]
//  reverse: boolean
//}

const Sections: React.FC = () => {
  //  const sectionContent: SectionContentItem[] = [
  //    {
  //      title: 'Applicants',
  //      subTitle: 'Embark on your university journey with confidence',
  //      desc: 'Dive into a world of insider insights by engaging with current students and faculty, ensuring your choice aligns perfectly with your aspirations and needs. Gain exclusive tips on securing admission from those who’ve successfully navigated the process.',
  //      image: applicantModel,
  //      className: 'applicantModel',
  //      subClass: 'appSubClass',
  //      animation: ['fade-right', 'fade-up'],
  //      reverse: false,
  //    },
  //    {
  //      title: 'Students',
  //      subTitle: 'Facilitate meaningful engagement with your peers and faculty',
  //      desc: 'Connect seamlessly with other students and professors. Embrace the opportunity to evolve academically while maintaining a healthy balance with your personal life by keeping your academic interactions distinct and organized.',
  //      image: studentModel,
  //      className: 'studentModel',
  //      subClass: 'studntSubClass',
  //      animation: ['fade-left', 'fade-up'],
  //      reverse: true,
  //    },
  //    {
  //      title: 'Faculty',
  //      subTitle: 'Elevate your communication strategy – choose clarity and efficiency',
  //      desc: 'Transition from conventional third-party email systems to our advanced communication platform, designed for a professional and efficient academic interaction. Encourage sustained participation in academic discussions through our interface.',
  //      image: facultyModel,
  //      className: 'facultyModel',
  //      subClass: 'factSubClass',
  //      animation: ['fade-right', 'fade-up'],
  //      reverse: false,
  //    },
  //  ]
  return (
    <div className="w-full bg-secondary py-8">
      <div className="flex justify-center flex-col items-center my-6">
        <Image src={sectionNumber} alt="1" className="sec-1 w-14 h-10" />
        <h3 className="font-inter font-extrabold text-2xl lg:text-4xl leading-12 tracking-tight text-center text-[#171717] py-8">
          SEARCH YOUR INSTITUE
        </h3>
        <div className="flex flex-col lg:flex-row justify-center lg:justify-end my-8">
          <div className="w-[60%] md:w-[40%] lg:w-[25%] mx-auto lg:mr-16">
            <Image src={applicantModel} alt="applicant" className="w-full h-full object-contain" />
          </div>
          <div className="w-full lg:w-1/2 justify-center lg:justify-start text-center lg:text-left px-4 lg:py-0 lg:px-16">
            <h1 className="text-xl lg:text-2xl font-bold py-4">Applicants</h1>
            <p className="py-4 font-bold ">Embark on your university journey with confidence</p>
            <p className="w-full lg:w-3/4 text-[#404040] text-sm lg:text-base lg:text-justify">
              Dive into a world of insider insights by engaging with current students and faculty, ensuring your choice aligns perfectly with your
              aspirations and needs. Gain exclusive tips on securing admission from those who’ve successfully navigated the process.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-col items-center my-6">
        <div className="flex flex-col-reverse lg:flex-row justify-center lg:justify-end my-8">
          <div className="w-full lg:w-1/2 justify-center lg:justify-start text-center lg:text-left px-4 lg:py-0 lg:px-0">
            <div className="mx-auto lg:mr-0 lg:ml-auto w-full lg:w-[60%]">
              <h1 className="text-xl lg:text-2xl font-bold py-4">Faculty</h1>
              <p className="py-4 font-bold ">Facilitate meaningful engagement with your peers and faculty</p>
              <p className="w-full  text-[#404040] text-sm lg:text-base lg:text-justify">
                Connect seamlessly with other students and professors. Embrace the opportunity to evolve academically while maintaining a healthy
                balance with your personal life by keeping your academic interactions distinct and organized.
              </p>
            </div>
          </div>
          <div className="w-[60%] md:w-[40%] lg:w-[25%] mx-auto lg:ml-16">
            <Image src={studentModel} alt="applicant" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-col items-center my-6">
        <div className="flex flex-col lg:flex-row justify-center lg:justify-end my-8">
          <div className="w-[60%] md:w-[40%] lg:w-[25%] mx-auto lg:mr-16">
            <Image src={facultyModel} alt="applicant" className="w-full h-full object-contain" />
          </div>
          <div className="w-full lg:w-1/2 justify-center lg:justify-start text-center lg:text-left px-4 lg:py-0 lg:px-16">
            <h1 className="text-xl lg:text-2xl font-bold py-4">Applicants</h1>
            <p className="py-4 font-bold w-full lg:w-3/4 ">Elevate your communication strategy – choose clarity and efficiency</p>
            <p className="w-full lg:w-3/4 text-[#404040] text-sm lg:text-base lg:text-justify">
              Transition from conventional third-party email systems to our advanced communication platform, designed for a professional and efficient
              academic interaction. Encourage sustained participation in academic discussions through our interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sections
