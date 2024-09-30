'use client'
import LeftNavbar from '@/components/organisms/LeftNavbar'
import React, { useState, ReactElement } from 'react'

interface ChildComponentProps {
  currSelectedGroup: any // Update the type of currSelectedGroup as per your state
}

interface WrapperProps {
  children: React.ReactNode
}

const LeftNavWrapper: React.FC<WrapperProps> = ({ children }) => {
  const [currSelectedGroup, setCurrSelectedGroup] = useState(null)

  return (
    <div className="flex h-screen gap-8 py-8">
      <div className="w-1/5 hidden md:block">
        <LeftNavbar setCurrSelectedGroup={setCurrSelectedGroup} currSelectedGroup={currSelectedGroup} />
      </div>
      <div className="w-3/5">
        {' '}
        {React.Children.map(children, (child) => {
          if (React.isValidElement<ChildComponentProps>(child)) {
            return React.cloneElement(child, { currSelectedGroup })
          }
          return child
        })}
      </div>
      <div className="w-1/5 rounded-2xl shadow-2xl bg-white hidden lg:block"></div>
    </div>
  )
}

export default LeftNavWrapper
