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

  // Professional item renderer with enhanced typography
  const renderItem = useCallback((item, userRole) => {
    if (!item) return null

    const gradientText = "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent dark:from-gray-100 dark:via-white dark:to-gray-100"
    
    return (
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <h3 className={`text-2xl font-bold leading-tight ${gradientText} animate-text-fade`}>
              {item.idea_name?.toLowerCase() || 'untitled idea'}
            </h3>
            
            {item.idea_description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium animate-text-slide delay-100">
                {item.idea_description.toLowerCase()}
              </p>
            )}
            
            {item.founder_name && (
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  by {item.founder_name.toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }, [isTransitioning])

  // Enhanced empty state with professional styling
  const renderEmptyState = useCallback(() => {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {emptyMessage}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            mutual connections will appear here when both you and founders show interest in each other.
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
      <div className="flex flex-col items-center justify-center space-y-6 w-full">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 
                         bg-clip-text text-transparent animate-text-glow">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium animate-text-fade delay-200">{description}</p>
        </div>
        
        <div className="relative min-h-[200px] flex flex-col w-full max-w-2xl mx-auto py-8">
          {items.length > 0 ? (
            <div className="flex flex-col items-center justify-center space-y-6 w-full">
              <div className="text-center w-full">
                {renderItem(currentItem, 'vc')}
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {currentIndex + 1} of {items.length}
                </span>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => handleAction('connect')}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 
                               hover:from-amber-700 hover:via-orange-600 hover:to-amber-800 text-white 
                               rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95
                               focus:ring-4 focus:ring-amber-500/50 focus:ring-offset-2
                               shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5
                               border-2 border-amber-500"
                    title="Send connection request"
                  >
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    connect
                  </button>
                  <button 
                    onClick={() => handlePass(currentIndex)}
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
            </div>
          ) : (
            renderEmptyState()
          )}
          {currentItem && renderLikeHistory(currentItem, 'vc')}
        </div>
      </div>
    </div>
  )
}
