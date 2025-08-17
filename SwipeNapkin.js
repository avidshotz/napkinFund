'use client'

import { useState } from 'react'

import LikeHistory from './components/LikeHistory'

export default function SwipeNapkin({ 
  title, 
  description, 
  items, 
  onLike, 
  onPass,
  emptyMessage = "No items yet.",
  renderItem,
  showLikeHistory = true
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePass = () => {
    if (items.length > 0 && onPass) {
      onPass(currentIndex)
      // Reset to 0 if this was the last item, otherwise stay on same index
      if (items.length === 1) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(Math.min(currentIndex, items.length - 2))
      }
    }
  }

  const handleLike = () => {
    if (onLike && items[currentIndex]) {
      onLike(items[currentIndex].id)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 w-full max-w-2xl mx-auto py-8">
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-amber-300/30 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-20 right-16 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-32 left-20 w-2.5 h-2.5 bg-amber-200/25 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        <div className="absolute bottom-16 right-12 w-1 h-1 bg-yellow-300/35 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
        <div className="absolute top-32 left-1/2 w-1.5 h-1.5 bg-amber-400/20 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4.5s'}}></div>
      </div>
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 
                         bg-clip-text text-transparent animate-text-glow">{title.toLowerCase()}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium animate-text-fade delay-200">{description.toLowerCase()}</p>
        </div>
        
        {items.length > 0 ? (
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className="text-center w-full">
              {renderItem
                ? renderItem(items[currentIndex])
                : (
                  <div className="animate-text-fade delay-300">
                    {/* Napkin-style card for VC info */}
                    <div className="relative max-w-md mx-auto">
                      {/* Main napkin */}
                      <div className="relative bg-white dark:bg-amber-50 rounded-lg shadow-lg border-2 border-amber-200 
                                     transform rotate-1 transition-all duration-300 hover:rotate-0 hover:scale-105">
                        {/* Napkin texture and wrinkles */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-4 left-4 w-16 h-0.5 bg-amber-300 transform -rotate-12"></div>
                          <div className="absolute top-8 right-6 w-12 h-0.5 bg-amber-300 transform rotate-6"></div>
                          <div className="absolute bottom-6 left-8 w-20 h-0.5 bg-amber-300 transform -rotate-3"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative p-6 space-y-4">
                          <div className="text-center">
                            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-800 mb-2">
                              {items[currentIndex]?.idea_name?.toLowerCase() || 'loading...'}
                            </h3>
                            
                            {/* VC details */}
                            {items[currentIndex]?.vcName && (
                              <div className="space-y-2 text-sm text-amber-800 dark:text-amber-700">
                                <p className="font-semibold">
                                  vc: {items[currentIndex].vcName.toLowerCase()}
                                </p>
                                {items[currentIndex]?.vcFirm && (
                                  <p>firm: {items[currentIndex].vcFirm.toLowerCase()}</p>
                                )}
                                {items[currentIndex]?.vcFocus && (
                                  <p>focus: {items[currentIndex].vcFocus.toLowerCase()}</p>
                                )}
                              </div>
                            )}
                            

                          </div>
                        </div>
                        
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-6 h-6 bg-amber-100 dark:bg-amber-200 
                                       border-l border-b border-amber-300 transform rotate-45 translate-x-3 -translate-y-3"></div>
                      </div>
                      
                      {/* Shadow napkin behind */}
                      <div className="absolute inset-0 bg-amber-100 dark:bg-amber-200 rounded-lg 
                                     transform rotate-2 -translate-x-1 translate-y-1 -z-10 opacity-60"></div>
                    </div>
                  </div>
                )
              }
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {currentIndex + 1} of {items.length}
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-4 animate-text-slide delay-500">
              <button 
                onClick={handleLike}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 
                           hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white 
                           rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95
                           focus:ring-4 focus:ring-amber-500/50 focus:ring-offset-2
                           shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5
                           border-2 border-amber-400"
                title={title === "likes" ? "unlike this item" : "like this item"}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {title === "likes" ? 'unlike' : 'like'}
              </button>
              <button 
                onClick={handlePass}
                className="px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 
                           hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-bold text-lg
                           transition-all duration-300 hover:scale-105 active:scale-95
                           shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed
                           border-2 border-slate-500"
                disabled={items.length === 0}
              >
                ghost
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 animate-text-fade">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
                           rounded-full flex items-center justify-center mb-4 animate-pulse">
              <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {emptyMessage.toLowerCase()}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              check back later for updates.
            </p>
          </div>
        )}
        
        {/* LikeHistory positioned relative to the full card */}
        {showLikeHistory && items.length > 0 && (
          <LikeHistory 
            item={items[currentIndex]} 
            userRole={title === "VCs Interested In You" ? "founder" : "vc"} 
          />
        )}
    </div>
  )
} 