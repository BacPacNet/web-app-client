import React from 'react'

interface NavbarProps {
  activeTab: string
  onTabClick: (tab: string) => void
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabClick }) => {
  const tabs = ['Timeline', 'Profile', 'Notifications', 'Messages', 'Connections', 'University Community', 'Chatbot']

  return (
    <nav className="bg-primary text-white flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 mx-6 py-2 rounded-md ${
              activeTab === tab ? 'bg-[#501EE3]' : 'hover:bg-[#4f1ee3b3]'
            } transition-colors duration-300 text-xs`}
            onClick={() => onTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div></div>
    </nav>
  )
}

export default Navbar
