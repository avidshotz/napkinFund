'use client'

import React from 'react';

export default function NapkinCard({ children, width = 500, height = 500 }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[300px] w-full px-2 sm:px-4 md:px-8">
      {/* Bar napkin twist: 3 extra napkins under main, rounded */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <div className="absolute w-full h-full rounded-3xl bg-white border-2 border-gray-200 shadow-md" style={{ transform: 'rotate(-5deg) scale(0.98)', zIndex: 1, top: '10px', left: '8px', opacity: 0.85 }} />
        <div className="absolute w-full h-full rounded-3xl bg-white border-2 border-gray-200 shadow-md" style={{ transform: 'rotate(0deg) scale(0.96)', zIndex: 2, top: '18px', left: '0px', opacity: 0.8 }} />
        <div className="absolute w-full h-full rounded-3xl bg-white border-2 border-gray-200 shadow-md" style={{ transform: 'rotate(5deg) scale(0.94)', zIndex: 3, top: '26px', left: '12px', opacity: 0.75 }} />
      </div>
      {/* Main napkin card, rounded, with diamond pattern */}
      <div 
        style={{ maxWidth: 600, width: '100%', minHeight: 220, height: 'auto' }}
        className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 flex flex-col backdrop-blur-sm overflow-hidden z-10"
      >
        {/* Napkin diamond pattern center */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="napkin-diamond" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect x="18" y="0" width="4" height="40" fill="#d1d5db" fillOpacity="0.10" />
              <rect x="0" y="18" width="40" height="4" fill="#d1d5db" fillOpacity="0.10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#napkin-diamond)" />
        </svg>
        {/* Napkin creases: top edge */}
        <svg className="absolute top-0 left-0 w-full h-[100px] pointer-events-none select-none" viewBox="0 0 600 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,100 Q30,60 60,100 Q90,60 120,100 Q150,60 180,100 Q210,60 240,100 Q270,60 300,100 Q330,60 360,100 Q390,60 420,100 Q450,60 480,100 Q510,60 540,100 Q570,60 600,100 L600,0 L0,0 Z" fill="#f7fafc" fillOpacity="0.85" />
        </svg>
        {/* Napkin creases: right edge */}
        <svg className="absolute top-0 right-0 h-full w-[100px] pointer-events-none select-none" viewBox="0 0 100 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,0 Q40,30 0,60 Q40,90 0,120 Q40,150 0,180 Q40,210 0,240 Q40,270 0,300 Q40,330 0,360 Q40,390 0,420 Q40,450 0,480 Q40,510 0,540 Q40,570 0,600 L100,600 L100,0 Z" fill="#f7fafc" fillOpacity="0.85" />
        </svg>
        <div className="relative z-10 text-xs text-amber-700 dark:text-amber-300">
          {children}
        </div>
      </div>
    </div>
  )
} 