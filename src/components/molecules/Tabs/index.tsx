import React, { useState } from 'react'

interface TabItem {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <div className="w-full mt-8 px-2">
      {/* Tabs List */}
      <div className="flex justify-center  border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`py-2 px-4 text-xs font-medium focus:outline-none ${
              activeTab === index ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500 hover:text-primary-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md">{tabs[activeTab].content}</div>
    </div>
  )
}

export default Tabs
