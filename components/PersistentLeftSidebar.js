'use client'

import React, { useState } from 'react'

/**
 * Persistent left sidebar with Profile, Settings, and Connections buttons
 */
export default function PersistentLeftSidebar({ 
  connectionRequests = [],
  onProfileClick,
  onSettingsClick,
  onConnectionsClick,
  className = ''
}) {
  const [activeButton, setActiveButton] = useState(null)

  const buttons = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: onProfileClick,
      badge: null
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: onConnectionsClick,
      badge: connectionRequests?.length || 0
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: onSettingsClick,
      badge: null
    }
  ]

  const handleButtonClick = (button) => {
    setActiveButton(button.id)
    button.onClick()
    // Reset active state after a short delay for visual feedback
    setTimeout(() => setActiveButton(null), 200)
  }

  return (
    <div className={`fixed top-0 left-0 h-full w-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg
                     border-r border-gray-200/60 dark:border-gray-700/60 shadow-xl z-30
                     flex flex-col items-center py-8 ${className}`}>
      
      {/* Logo/Brand */}
      <div className="mb-12">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 
                       rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col space-y-6">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button)}
            className={`relative group flex items-center justify-center w-14 h-14 rounded-2xl
                       transition-all duration-300 hover:scale-110 active:scale-95
                       ${activeButton === button.id 
                         ? 'bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-white shadow-xl border-2 border-amber-400' 
                         : 'bg-gray-100 hover:bg-gradient-to-br hover:from-amber-100 hover:to-yellow-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-300'
                       }`}
            title={button.label}
          >
            {button.icon}
            
            {/* Badge for notifications */}
            {button.badge > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 
                             text-white text-xs font-bold rounded-full flex items-center justify-center
                             shadow-lg border-2 border-white animate-pulse">
                {button.badge > 9 ? '9+' : button.badge}
              </span>
            )}
            
            {/* Tooltip */}
            <div className="absolute left-20 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium 
                           px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 
                           transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {button.label}
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 
                             border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom spacer */}
      <div className="flex-1"></div>
      
      {/* Optional bottom accent */}
      <div className="mb-4">
        <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"></div>
      </div>
    </div>
  )
}
