'use client'

import React, { useState, useCallback, useMemo } from 'react'
import LikeHistory from './LikeHistory'

export default function VCMatchedIdeas({ 
  title = "matches", 
  description = "ideas where both you and the founder have shown interest.", 
  items = [],
  emptyMessage = "no matches yet.",
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
              <div className="inline-flex items-center gap-3 bg-amber-50 dark:bg-amber-900/30 px-6 py-3 rounded-full border border-amber-200 dark:border-amber-700">
                {/* Profile Picture */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
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
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
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
        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {emptyMessage}
          </h3>
          <p className="text-md text-gray-600 dark:text-gray-400 max-w-md text-lg">
            when you like an idea and the founder likes you back, it will appear here as a potential match.
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
                     className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
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
                  onClick={() => handleAction('connect')}
                  className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 
                             hover:from-purple-600 hover:to-pink-700 text-white 
                             rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95
                             shadow-lg hover:shadow-xl transform hover:-translate-y-1
                             border-2 border-purple-400"
                  title="Send connection request"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  connect
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
