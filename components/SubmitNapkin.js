'use client'

import { useState, useEffect } from 'react'

export default function SubmitNapkin({ onSubmit, oneLiner, setOneLiner, onLaunchSuccess, isAnimating = false, isRestoring = false }) {
  const [isLaunching, setIsLaunching] = useState(false)
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  
  // Array of startup idea examples to cycle through
  const placeholderIdeas = [
    "ex: platform connecting food waste from restaurants to local farms",
    "ex: ai-powered tool that writes your emails in your voice",
    "ex: marketplace for local artists to sell custom home decor",
    "ex: app that gamifies learning a new language with friends",
    "ex: subscription service for sustainable household products",
    "ex: platform that matches remote workers with local communities",
    "ex: tool that automatically organizes your digital photos by memory",
    "ex: service that connects busy parents with trusted local babysitters"
  ]
  
  // Animate placeholder text when input is empty
  useEffect(() => {
    if (oneLiner.length === 0) {
      const interval = setInterval(() => {
        setCurrentPlaceholderIndex((prevIndex) => 
          (prevIndex + 1) % placeholderIdeas.length
        )
      }, 3000) // Change every 3 seconds
      
      return () => clearInterval(interval)
    }
  }, [oneLiner.length, placeholderIdeas.length])

  const handleSubmit = async () => {
    if (oneLiner.trim()) {
      setIsLaunching(true)
      
      // Launch animation delay
      setTimeout(() => {
        setIsLaunching(false)
        onSubmit()
        // Trigger confetti and success callback
        if (onLaunchSuccess) {
          onLaunchSuccess()
        }
      }, 800)
    }
  }

  return (
    <div className="w-full flex justify-center">
      {/* Main Card Container - Centered */}
      <div className="w-full max-w-4xl relative z-10">
        {/* Card with Playful Napkin Aesthetic - Centered */}
        <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-600 p-8 md:p-10
                       transform rotate-1 hover:rotate-0 transition-all duration-500 ease-out
                       ${isAnimating ? 'animate-crumple' : ''} ${isRestoring ? 'animate-restore' : ''}`}
                       style={isAnimating ? {
                         transform: 'scale(0.8) rotate(15deg) translateX(-100px)',
                         opacity: 0.6
                       } : {}}>
          


          {/* Header with Playful Typography - Centered Layout */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center shadow-xl
                             transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white
                             bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent
                             transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                napkin pitch
              </h1>
        </div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium">
              describe your startup idea in one sentence
            </p>
            </div>
            
          {/* Full-Width Text Area - Tall and Comfortable */}
          <div className="mb-8">
            <textarea
        value={oneLiner}
        onChange={(e) => setOneLiner(e.target.value)}
              placeholder={placeholderIdeas[currentPlaceholderIndex]}
              className="w-full px-8 py-8 text-xl md:text-2xl border-3 border-gray-300 dark:border-gray-500 
                         rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-4 focus:ring-amber-400/30 focus:border-amber-500
                         transition-all duration-300 resize-none shadow-lg
                         placeholder-gray-400 dark:placeholder-gray-500
                         hover:shadow-xl focus:shadow-2xl
                         font-medium leading-relaxed"
              rows={4}
              maxLength={100}
      />
          </div>

          {/* Character Counter - Clear and Prominent */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {oneLiner.length}/100
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                characters
            </span>
            </div>
          </div>

          {/* Dynamic Feedback & Tips */}
          <div className="text-center mb-10">
            {oneLiner.length === 0 && (
              <p className="text-amber-600 dark:text-amber-400 text-lg font-medium">
                start typing! investors love detailed, specific ideas
              </p>
            )}
            {oneLiner.length > 0 && oneLiner.length < 30 && (
              <p className="text-amber-600 dark:text-amber-400 text-lg font-medium">
                ✨ good start! add more context about who this helps
              </p>
            )}
            {oneLiner.length >= 30 && oneLiner.length < 60 && (
              <p className="text-yellow-600 dark:text-yellow-400 text-lg font-medium">
                🚀 getting stronger! explain the problem you're solving
              </p>
            )}
            {oneLiner.length >= 60 && oneLiner.length < 90 && (
              <p className="text-amber-600 dark:text-amber-400 text-lg font-medium">
                🎯 almost there! add a unique angle or competitive advantage
              </p>
            )}
            {oneLiner.length >= 90 && (
              <p className="text-amber-600 dark:text-amber-400 text-lg font-medium">
                🎉 perfect! investors will love this level of detail
              </p>
            )}
        </div>

          {/* Launch Button - Bold and Playful */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!oneLiner.trim() || isLaunching}
              className="w-full py-6 px-8 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 
                        hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-white font-bold text-xl rounded-2xl 
                        transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
                        focus:ring-4 focus:ring-amber-500/30 focus:outline-none
                        flex items-center justify-center gap-4 relative overflow-hidden
                        shadow-xl hover:shadow-3xl
                        border-2 border-amber-400/50"
            >
              {isLaunching ? (
                <>
                  <span className="animate-pulse text-xl">launching...</span>
                  <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              ) : (
                <>
                  <span className="text-xl">launch & match</span>
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
            </div>
                </>
              )}
            </button>
        </div>

          </div>
        </div>
    </div>
  )
} 