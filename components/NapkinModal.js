'use client'

import { useState } from 'react'

export default function NapkinModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children,
  width = 600,
  height = 400,
  customHeader
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div 
        className="bg-white border-2 border-gray-200 shadow-xl relative rounded-3xl"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`
        }}
      >
        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-gray-400"></div>
        
        {/* Content container */}
        <div className="p-6 h-full overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            {customHeader ? (
              customHeader
            ) : (
              <div className="flex-1 text-center">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none ml-4"
            >
              ×
            </button>
          </div>
          
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 