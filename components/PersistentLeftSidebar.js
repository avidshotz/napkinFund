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
  onSubmittedIdeasClick,
  className = '',
  showIdeasPopup = false
}) {
  const [activeButton, setActiveButton] = useState(null)

  const handleHomeClick = () => {
    // Redirect to home page
    window.location.href = '/'
  }

  const buttons = [
    {
      id: 'connections',
      label: 'matches',
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: onConnectionsClick,
      badge: connectionRequests?.length || 0
    },
    {
      id: 'submitted-ideas',
      label: 'liked ideas',
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      onClick: onSubmittedIdeasClick,
      badge: null
    },
    {
      id: 'legal-support',
      label: 'legal support',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      onClick: () => window.open('https://seedlegals.com/us/', '_blank'),
      badge: null
    },
    {
      id: 'banking',
      label: 'banking',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      onClick: () => window.open('https://www.rho.co/startups/?utm_medium=paid_search&utm_source=google&utm_campaign=brand&utm_ref=google&utm_content=Rho&utm_term=rho%20banking&hsa_acc=8680739601&hsa_cam=21959886913&hsa_grp=172822039562&hsa_ad=743571684374&hsa_src=g&hsa_tgt=kwd-902524884201&hsa_kw=rho%20banking&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=21959886913&gbraid=0AAAAACZqnmGn-nukiGLskQjbGqlRtmUC0&gclid=Cj0KCQjwnovFBhDnARIsAO4V7mAJdNYh8Md5CJwCrw1T1v2PBDCndwJJ3vacht6yIEyBSmswqYLZ9awaAsSTEALw_wcB', '_blank'),
      badge: null
    },
    {
      id: 'networking-events',
      label: 'networking events',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => window.open('https://lu.ma/creatorweek', '_blank'),
      badge: null
    },
    {
      id: 'marketing',
      label: 'marketing',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      onClick: () => window.open('https://mycliqk.com/', '_blank'),
      badge: null
    },
    {
      id: 'profile',
      label: 'profile',
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: onProfileClick,
      badge: null
    },
    {
      id: 'settings',
      label: 'settings',
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826-3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
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
                     border-r border-gray-200/60 dark:border-gray-700/60 shadow-xl z-40
                     flex flex-col items-center pt-20 pb-8 ${className}`}>
      
      {/* Logo/Brand - Clickable Home Button */}
      <div className="mb-8">
        <button
          onClick={handleHomeClick}
          className="w-12 h-12 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 
                     rounded-2xl flex items-center justify-center shadow-lg
                     hover:scale-110 transition-all duration-300 hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          title="Go to Home"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col space-y-4">
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
            {/* Ideas Popup Animation */}
            {button.id === 'submitted-ideas' && showIdeasPopup && (
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 
                             bg-gradient-to-r from-amber-500 to-yellow-500 text-white 
                             px-4 py-2 rounded-lg shadow-xl border-2 border-amber-400
                             animate-ideas-popup z-50 whitespace-nowrap min-w-max
                             pointer-events-none">
                <div className="text-sm font-bold">pop out from the ideas icon!</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1 -translate-y-1/2 
                               border-4 border-transparent border-t-amber-500"></div>
              </div>
            )}
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
