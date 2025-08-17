'use client'

import React, { useState, useCallback, useMemo } from 'react'

import LikeHistory from './LikeHistory'

/**
 * Professional base component for modern card interactions
 * Provides consistent styling, animations, and user experience patterns
 */
export default function BaseCardComponent({
  items = [],
  onPass,
  onLike,
  onConnect,
  userRole = 'vc',
  emptyStateMessage = 'No items to display',
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

  // Enhanced action handler with visual feedback
  const handleAction = useCallback(async (actionType) => {
    if (!currentItem) return

    setIsTransitioning(true)
    setLastActionType(actionType)
    
    try {
      if (actionType === 'like' && onLike) {
        await onLike(currentItem.id)
      } else if (actionType === 'connect' && onConnect) {
        await onConnect(currentItem)
      }
      
      // Brief pause for visual feedback
      setTimeout(() => {
        setIsTransitioning(false)
        setLastActionType(null)
      }, 300)
    } catch (error) {
      console.error(`Error in handle${actionType}:`, error)
      setIsTransitioning(false)
      setLastActionType(null)
    }
  }, [currentItem, onLike, onConnect])

  // Modern item renderer with clean typography
  const renderItem = useCallback((item, showLikeHistory = true) => {
    if (!item) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse space-y-4 text-center w-full max-w-sm">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/2 mx-auto"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      )
    }

    return (
      <div className={`space-y-8 transition-all duration-300 ease-out ${
        isTransitioning ? 'scale-[0.98] opacity-60' : 'scale-100 opacity-100'
      }`}>
        {/* Header section */}
        <div className="space-y-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
            {item.idea_name || 'Untitled Idea'}
          </h2>
          
          {item.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {item.description}
            </p>
          )}
        </div>

        {/* Action section */}
        {(item?.creatorLinkedin || item?.vcLinkedin || item?.founderLinkedin) && (
          <div className="flex justify-center pt-2">
            <a
              href={item?.creatorLinkedin || item?.vcLinkedin || item?.founderLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 text-sm font-bold
                       text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600
                       hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700
                       rounded-xl transition-all duration-300 hover:scale-105 active:scale-95
                       border-2 border-blue-400 hover:border-blue-500
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              View LinkedIn Profile
            </a>
          </div>
        )}

        {/* Loading overlay */}
        {isTransitioning && lastActionType && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium shadow-lg ${
              lastActionType === 'like' 
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                : lastActionType === 'connect'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}>
              <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
              {lastActionType === 'like' && 'Processing like...'}
              {lastActionType === 'connect' && 'Initiating connection...'}
              {lastActionType === 'pass' && 'Moving to next...'}
            </div>
          </div>
        )}
      </div>
    )
  }, [isTransitioning, lastActionType])

  // Enhanced like history renderer
  const renderLikeHistory = useCallback((item, role = 'vc') => {
    return <LikeHistory item={item} userRole={role} />
  }, [])

  // Modern empty state with clean design
  const renderEmptyState = useCallback((message) => {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center shadow-sm">
            <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="space-y-3 max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            All caught up
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    )
  }, [])

  // Abstract method - must be implemented by child components
  const renderContent = useCallback(() => {
    throw new Error('renderContent method must be implemented by child components')
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="relative min-h-[200px] flex flex-col w-full max-w-2xl mx-auto py-8">
        {renderContent()}
        {currentItem && renderLikeHistory(currentItem, userRole)}
      </div>
    </div>
  )
}

// Component exported as default above
