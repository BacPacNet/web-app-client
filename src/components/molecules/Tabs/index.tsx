import React, { useState } from 'react'

interface TabItem {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  className?: string
  tabAlign?: 'left' | 'center' | 'right'
  labelSize?: 'small' | 'medium' | 'large'
}

const Tabs: React.FC<TabsProps> = ({ tabs, className = '', tabAlign = 'left', labelSize = 'medium' }) => {
  const fontSize = {
    small: 'text-2xs',
    medium: 'text-xs',
    large: 'text-sm',
  }
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <div className={`w-full ${className} `}>
      {/* Tabs List */}
      <div className={`border-gray-200 text-${tabAlign} flex`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`py-2 flex-1 ${fontSize[labelSize]} font-extrabold focus:outline-none ${
              activeTab === index ? 'border-b-2 border-primary-500 text-primary-700 ' : 'text-neutral-400 hover:text-primary-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}

      <div style={{ height: '-webkit-fill-available' }} className="mt-4 bg-white rounded-md">
        {tabs[activeTab].content}
      </div>
    </div>
  )
}

export default Tabs
