'use client'

import React from 'react';

export default function ModernCard({ 
  children, 
  width = 500, 
  height = 500,
  className = '',
  variant = 'default',
  hover = true
}) {
  const variants = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60',
    elevated: 'bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-lg',
    glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30',
    minimal: 'bg-gray-50 dark:bg-gray-800 border-0'
  }

  const hoverEffect = hover 
    ? 'hover:shadow-xl hover:scale-[1.02] hover:border-gray-300/80 dark:hover:border-gray-600/80' 
    : ''

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[320px] w-full px-4 sm:px-6 lg:px-8">
      <div 
        style={{ maxWidth: 700, width: '100%', minHeight: 300, height: 'auto' }}
        className={`
          relative rounded-3xl p-8 sm:p-10 lg:p-12 flex flex-col 
          transition-all duration-300 ease-out mx-auto
          ${variants[variant]}
          ${hoverEffect}
          ${className}
        `}
      >
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-transparent to-gray-50/30 dark:to-gray-800/30 pointer-events-none" />
        
        {/* Content container with proper typography styling and centering */}
        <div className="relative z-10 text-gray-900 dark:text-gray-100 leading-relaxed text-center">
          {children}
        </div>
      </div>
    </div>
  )
} 