'use client'
import React from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import image1 from '@assets/image1.svg'
import image2 from '@assets/image2.svg'
import image3 from '@assets/image3.svg'
import image4 from '@assets/image4.svg'
import './index.css'
import Title from '../Title'
import Text from '../Text'

export default function OnboardingSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,

    customPaging: () => (
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: '#D1D5DB',
        }}
      ></div>
    ),
  }
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="w-[100%] mx-auto overflow-hidden">
        <Slider {...settings}>
          <>
            <div className="!flex justify-center h-[343px]">
              <Image className="px-8" src={image1} alt="onboarding1" width={555} />
            </div>
            <div className="text-center ">
              <Title className="mt-8 mb-4">Welcome to Unibuzz!</Title>
              <Text>Welcome to Unibuzz, the global university network that caters to your university needs. </Text>
            </div>
          </>
          <>
            <div className="!flex justify-center h-[343px]">
              <Image className="px-8" src={image2} alt="onboarding1" width={695} />
            </div>
            <div className="text-center">
              <Title className="mt-8 mb-4">First, search your university</Title>
              <Text>Find your university from our database and get ready to join the vibrant community within it!</Text>
            </div>
          </>
          <>
            <div className="!flex justify-center h-[343px]">
              <Image className="px-8" src={image3} alt="onboarding1" width={767} />
            </div>
            <div className="text-center">
              <Title className="mt-8 mb-4"> Join university community</Title>
              <Text>Gain access to the university community to communicate with current, past, and future students!</Text>
              {/*<Text>Exchange valuable information and connections or use our AI powered chatbot! </Text>*/}
            </div>
          </>
          <>
            <div className="!flex justify-center h-[343px]">
              <Image className="px-8" src={image4} alt="onboarding1" width={550} />
            </div>
            <div className="text-center">
              <Title className="mt-8 mb-4">Lastly, enjoy the features</Title>
              <Text>With a wide range of social networking features, messaging, and an AI powered assistant,</Text>
              {/*<Text> we will make your university life a blast. Download our mobile app for syncing! </Text>*/}
            </div>
          </>
        </Slider>
        <Text className="text-center text-primary-500 text-sm cursor-pointer my-6">Skip Onboarding</Text>
      </div>
    </div>
  )
}
