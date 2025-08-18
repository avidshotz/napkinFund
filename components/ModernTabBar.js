'use client'

import React from 'react'

/**
 * Modern, sleek settings modal component for general app settings
 */
export default function ModernTabBar({ 
  isOpen, 
  onClose,
  className = ''
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 
                           bg-clip-text text-transparent">
              settings
            </h1>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                         flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                         transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 
                           rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              general settings
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              app settings and preferences
            </p>

            {/* Settings options can be added here in the future */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">theme</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  theme switching will be available soon
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  notification preferences coming soon
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">privacy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  privacy settings will be available soon
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                for account and connection management, use the profile button in the bottom bar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}