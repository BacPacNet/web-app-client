'use client'
import React from 'react'
import { motion } from 'framer-motion'

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
        <motion.p
          onClick={() => onNavigate(menu.path)}
          key={index}
          className={`text-neutral-800 text-xs cursor-pointer ${currentPath === menu.path ? 'font-extrabold' : ''}`}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2, ease: 'easeInOut' },
          }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.1 },
          }}
        >
          {menu.name}
        </motion.p>
      ))}
    </div>
  )
}

export default NavigationMenu
