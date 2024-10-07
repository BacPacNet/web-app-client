import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      {/* Hamburger Icon (Visible only on mobile) */}
      <div className="lg:hidden flex items-center">
        <button onClick={toggleMenu} className="flex flex-col justify-evenly h-8 w-8 focus:outline-none" aria-label="Toggle menu">
          {/* Three horizontal lines */}
          <span className={`block h-0.5 w-full bg-black transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-full bg-black transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-full bg-black transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Sidebar Menu (Visible on mobile when open) */}
      <div
        className={`fixed top-0 right-0 h-full w-2/5 bg-white transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden`}
      >
        <button onClick={toggleMenu} className="p-4 text-black focus:outline-none absolute right-0 top-2">
          {/* X Icon for Close */}
          <div className="rotate-45 w-6 h-0.5 bg-black "></div>
          <div className="-rotate-45 w-6 h-0.5 bg-black mb-[1px]"></div>
        </button>
        <div className="px-4 py-8">
          <a href="/discover" className="block py-2 text-black">
            Discover
          </a>
          <a href="/timeline" className="block py-2 text-black">
            Community
          </a>
          <a href="/about" className="block py-2 text-black">
            About Us
          </a>
          <a href="/upgrade" className="block py-2 text-black">
            Upgrade
          </a>
        </div>
      </div>
    </div>
  )
}
