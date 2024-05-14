import './Section3.css'

import Image from 'next/image'
import Slider from '../Slider/Slider'
import number3 from '@assets/number3.png'

const Section3: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center bg-secondary py-10 lg:my-6">
      <div className="heading-3 text-2xl lg:text-4xl flex flex-col center-v gap-6 my-6 lg:my-12">
        <Image src={number3} alt="3" />
        <h3>Enjoy the features</h3>
      </div>
      <div className="w-full pt-4">
        <Slider />
      </div>
    </div>
  )
}

export default Section3
