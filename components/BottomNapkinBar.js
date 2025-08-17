import React from 'react';

export default function ModernButtonBar({ buttons }) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg 
                      border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-3 shadow-xl">
        {buttons.map((button, i) => (
          <button
            key={button.label}
            onClick={button.onClick}
            className="relative flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm
                       bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900
                       hover:from-slate-800 hover:via-slate-900 hover:to-slate-700
                       text-white transition-all duration-300 hover:scale-105 active:scale-95
                       shadow-xl hover:shadow-2xl transform hover:-translate-y-1
                       border-2 border-slate-600 hover:border-slate-500
                       focus:ring-4 focus:ring-slate-500/50 focus:ring-offset-2"
          >
            {/* Icon */}
            {button.label === 'Profile' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {button.label === 'Settings' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span>{button.label}</span>
            {button.count > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold
                               bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full
                               shadow-lg border-2 border-white">
                {button.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 