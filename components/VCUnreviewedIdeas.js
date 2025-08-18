'use client'

import React, { useState, useCallback, useMemo } from 'react'
import LikeHistory from './LikeHistory'

export default function VCUnreviewedIdeas({ 
  title = "ideas to review", 
  description = "new ideas waiting for your review.", 
  items = [],
  emptyMessage = "no new ideas to review.",
  onPass,
  onLike,
  onConnect,
  className = '',
  ...props
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lastActionType, setLastActionType] = useState(null)

  // Memoized current item for performance
  const currentItem = useMemo(() => items[currentIndex], [items, currentIndex])

  // Enhanced pass handler with smooth transitions
  const handlePass = useCallback(async (index) => {
    if (items.length === 0 || !onPass) return

    setIsTransitioning(true)
    setLastActionType('pass')
    
    try {
      await onPass(index)
      
      // Smooth index transition
      setTimeout(() => {
        if (items.length === 1) {
          setCurrentIndex(0)
        } else {
          setCurrentIndex(prev => Math.min(prev, items.length - 2))
        }
        setIsTransitioning(false)
        setLastActionType(null)
      }, 200)
    } catch (error) {
      console.error('Error in handlePass:', error)
      setIsTransitioning(false)
      setLastActionType(null)
    }
  }, [items.length, onPass])

  // Enhanced action handler with feedback
  const handleAction = useCallback(async (actionType) => {
    if (items.length === 0) return

    const handlers = {
      like: onLike,
      connect: onConnect
    }

    const handler = handlers[actionType]
    if (!handler) return

    setIsTransitioning(true)
    setLastActionType(actionType)

    try {
      await handler(currentIndex)
      
      // Smooth transition to next item
      setTimeout(() => {
        if (items.length === 1) {
          setCurrentIndex(0)
        } else {
          setCurrentIndex(prev => Math.min(prev, items.length - 2))
        }
        setIsTransitioning(false)
        setLastActionType(null)
      }, 200)
    } catch (error) {
      console.error(`Error in handle${actionType}:`, error)
      setIsTransitioning(false)
      setLastActionType(null)
    }
  }, [items.length, currentIndex, onLike, onConnect])

  // Clean and readable item renderer
  const renderItem = useCallback((item, userRole) => {
    if (!item) return null
    
    return (
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="text-center space-y-6">
          {/* Idea Title */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {item.idea_name?.toLowerCase() || 'untitled idea'}
            </h3>
          </div>
          
          {/* Idea Description */}
          {item.idea_description && (
            <div>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {item.idea_description.toLowerCase()}
              </p>
            </div>
          )}
          
                     {/* Founder Info */}
           {item.founder_name && (
             <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 px-6 py-3 rounded-full border border-blue-200 dark:border-blue-700">
               {/* Profile Picture */}
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                 {item.founder_profile_picture ? (
                   <img 
                     src={item.founder_profile_picture} 
                     alt={`${item.founder_name}'s profile`}
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   item.founder_name.charAt(0).toUpperCase()
                 )}
               </div>
               <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                 by {item.founder_name.toLowerCase()}
               </span>
             </div>
           )}
        </div>
      </div>
    )
  }, [isTransitioning])

  // Clean and informative empty state
  const renderEmptyState = useCallback(() => {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {emptyMessage}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg">
            all caught up! new ideas will appear here as founders submit them.
          </p>
        </div>
      </div>
    )
  }, [emptyMessage])

  const renderLikeHistory = useCallback((item, userRole) => {
    if (!item?.like_history || !Array.isArray(item.like_history) || item.like_history.length === 0) {
      return null
    }

    return (
      <div className="mt-8">
        <LikeHistory likeHistory={item.like_history} userRole={userRole} />
      </div>
    )
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        
        {/* Content Area */}
        <div className="relative min-h-[300px]">
          {items.length > 0 ? (
            <div className="space-y-6">
              {/* Idea Display */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200/60 dark:border-gray-700/60">
                {renderItem(currentItem, 'vc')}
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-center">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-48">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {currentIndex + 1} of {items.length}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-6">
                                 <button 
                   onClick={() => handleAction('like')}
                   className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 
                              hover:from-amber-600 hover:to-yellow-700 text-white 
                              rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95
                              shadow-lg hover:shadow-xl transform hover:-translate-y-1
                              border-2 border-amber-400"
                   title="Like this idea"
                 >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  like idea
                </button>
                
                <button 
                  onClick={() => handlePass(currentIndex)}
                  className="px-10 py-4 bg-gradient-to-r from-gray-500 to-gray-600 
                             hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl font-bold text-lg
                             transition-all duration-300 hover:scale-105 active:scale-95
                             shadow-lg hover:shadow-xl transform hover:-translate-y-1
                             disabled:opacity-50 disabled:cursor-not-allowed
                             border-2 border-gray-400"
                  disabled={items.length === 0}
                >
                  pass
                </button>
              </div>
            </div>
          ) : (
            renderEmptyState()
          )}
          
          {/* Like History */}
          {currentItem && renderLikeHistory(currentItem, 'vc')}
        </div>
      </div>
    </div>
  )
}
