import React, { useState } from 'react'

interface TabItem {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  className?: string
  tabAlign?: 'left' | 'center' | 'right'
}

const Tabs: React.FC<TabsProps> = ({ tabs, className = '', tabAlign = 'left' }) => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <div className={`w-full ${className} `}>
      {/* Tabs List */}
      <div className={`border-gray-200 text-${tabAlign} px-4`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`py-2 px-4 text-xs font-medium focus:outline-none ${
              activeTab === index ? 'border-b-2 border-primary-500 text-primary-500' : 'text-neutral-500 hover:text-primary-500'
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
