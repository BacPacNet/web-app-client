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

const PillTabs: React.FC<TabsProps> = ({ tabs, className = '', tabAlign = 'left', labelSize = 'medium' }) => {
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
    <div className={`w-full ${className}`}>
      {/* Buttons List */}
      <div className={`flex justify-${tabAlign} px-6 gap-2 overflow-x-auto custom-scrollbar`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`h-10 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${fontSize[labelSize]} ${
              activeTab === index ? 'bg-primary-500 text-white' : 'bg-[#F3F2FF] border border-[#E9E8FF] text-primary-500 '
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="mt-4 bg-white rounded-md flex flex-col h-[95%]">{tabs[activeTab].content}</div>
    </div>
  )
}

export default PillTabs
