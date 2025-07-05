'use client'
import React from 'react'

interface MenuItem {
  name: string
  path: string
}

interface NavigationMenuProps {
  menuList: MenuItem[]
  currentPath: string
  onNavigate: (path: string) => void
}

const NavigationMenu = ({ menuList, currentPath, onNavigate }: NavigationMenuProps) => {
  return (
    <div className="flex gap-6 px-4">
      {menuList.map((menu, index) => (
        <p
          onClick={() => onNavigate(menu.path)}
          key={index}
          className={`text-neutral-800 text-xs cursor-pointer ${currentPath === menu.path ? 'font-extrabold' : ''}`}
        >
          {menu.name}
        </p>
      ))}
    </div>
  )
}

export default NavigationMenu
