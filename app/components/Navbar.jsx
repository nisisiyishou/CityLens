'use client'

import { useState } from 'react'
import Link from 'next/link'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="backdrop-blur-xs absolute top-0 left-0 right-0 bg-gradient-to-r from-gray-800/50 to-gray-900/20 shadow-lg z-50">
      <div className="max-w-7xl mx-auto z-30">
        <div className="flex justify-between items-center h-13 px-4">
          {/* Hamburger menu button - top left */}
          <div>
            <button
              onClick={toggleMenu}
              className="inline-flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-700 focus:outline-none transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open menu</span>
              {/* Three white lines */}
              <div className="w-5 flex flex-col space-y-1">
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'translate-y-1' : ''
                  }`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''
                  }`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? ' -translate-y-1' : ''
                  }`}></div>
              </div>
            </button>
          </div>

          {/* Title on the right*/}
          <div className="flex-shrink-0">
            <span className="text-xl font-semibold text-white">City Lens</span>
          </div>
        </div>

        {/* Dropdown menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} bg-gray-800/80 shadow-2xl border-t border-gray-700 z-40`}>
          <div className="">
            {/* User info section */}
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-full flex items-center justify-center">
                  <span className="text-white/70 font-semibold text-lg">U</span>
                </div>
                <div>
                  <p className="text-white font-semibold">User</p>
                  <p className="text-gray-300 text-sm">member@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu items - row by row, no icons */}
            <div className="">
              <Link
                href="/checkins"
                className="block px-6 py-2.5 text-white hover:bg-gray-700 hover:text-green-400 border-b border-gray-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-gray-300 font-medium">My Check-ins</span>
              </Link>

              <Link
                href="/collection"
                className="block px-6 py-2.5 text-white hover:bg-gray-700 hover:text-green-400 border-b border-gray-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-gray-300 font-medium">Collection</span>
              </Link>

              <Link
                href="/missions"
                className="block px-6 py-2.5 text-white hover:bg-gray-700 hover:text-green-400 border-b border-gray-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-gray-300 font-medium">Missions</span>
              </Link>

              <Link
                href="/settings"
                className="block px-6 py-2.5 text-white hover:bg-gray-700 hover:text-green-400 border-b border-gray-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-gray-300 font-medium">Settings</span>
              </Link>

              {/* Logout button */}
              <button
                className="block w-full text-left px-6 py-2.5 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                onClick={() => {
                  setIsMenuOpen(false)
                  alert('Logout function')
                }}
              >
                <span className="font-medium">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed bg-black bg-opacity-30 z-20"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  )
}

export default Navbar