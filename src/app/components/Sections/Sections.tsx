'use client'

import './Sections.css'

import Image from 'next/image'
import { Parallax } from 'react-parallax'
import SectionsInfo from './SectionsInfo'
import applicantModel from '../../../assets/applicantModel.png'
import facultyModel from '../../../assets/facultyModel.png'
import sectionNumber from '../../../assets/Number Label.png'
import studentModel from '../../../assets/studentModel.png'

function Sections() {
  const sectionContent = [
    {
      title: 'Applicants',
      subTitle: 'Embark on your university journey with confidence',
      desc: 'Dive into a world of insider insights by engaging with current students and faculty, ensuring your choice aligns perfectly with your aspirations and needs. Gain exclusive tips on securing admission from those who’ve successfully navigated the process.',
      image: applicantModel,
      className: 'applicantModel',
      subClass: 'appSubClass',
      animation: ['fade-right', 'fade-up'],
      reverse: false,
    },
    {
      title: 'Students',
      subTitle: 'Facilitate meaningful engagement with your peers and faculty',
      desc: 'Connect seamlessly with other students and professors. Embrace the opportunity to evolve academically while maintaining a healthy balance with your personal life by keeping your academic interactions distinct and organized.',
      image: studentModel,
      className: 'studentModel',
      subClass: 'studntSubClass',
      animation: ['fade-left', 'fade-up'],
      reverse: true,
    },
    {
      title: 'Faculty',
      subTitle: 'Elevate your communication strategy – choose clarity and efficiency',
      desc: 'Transition from conventional third-party email systems to our advanced communication platform, designed for a professional and efficient academic interaction. Encourage sustained participation in academic discussions through our interface.',
      image: facultyModel,
      className: 'facultyModel',
      subClass: 'factSubClass',
      animation: ['fade-right', 'fade-up'],
      reverse: false,
    },
  ]
  return (
    <Parallax strength={600}>
      <div className="section-1 bg-[#F3F2FF] flex flex-col items-center">
        <div className="heading flex justify-center flex-col items-center">
          <Image src={sectionNumber} alt="1" className="sec-1 w-14 h-10" />
          <h3 className="h-section-1 font-inter flex justify-center font-extrabold text-4xl leading-12 tracking-tight text-center text-[#171717]">
            Search your institute
          </h3>
        </div>
        <div className="part-info">
          {sectionContent.map((item, index) => (
            <SectionsInfo item={item} key={index} />
          ))}
        </div>
      </div>
    </Parallax>
  )
}

export default Sections
