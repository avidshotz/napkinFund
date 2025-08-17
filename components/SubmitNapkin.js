'use client'

import { useState, useEffect } from 'react'
export default function SubmitNapkin({ onSubmit, oneLiner, setOneLiner }) {

  const [showEncouragement, setShowEncouragement] = useState(false)
  const [encouragementText, setEncouragementText] = useState('')
  const [placeholderText, setPlaceholderText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [currentOnelinerIndex, setCurrentOnelinerIndex] = useState(0)

  const fullPlaceholderText = "type your one liner and match with investors"
  
  const sampleOneLiners = [
    "ai-powered fitness coach that adapts to your mood and energy levels",
    "blockchain-based carbon credit marketplace for small businesses",
    "virtual reality therapy platform for treating phobias and anxiety",
    "smart mirror that provides personalized skincare recommendations",
    "drone delivery service for emergency medical supplies in rural areas",
    "app that translates pet behavior into human language using ml",
    "sustainable packaging made from agricultural waste",
    "social platform connecting mentors with underprivileged students",
    "voice-controlled smart home for elderly and disabled individuals",
    "subscription service for locally-sourced, zero-waste groceries",
    "ar shopping assistant that finds the best deals in real-time",
    "peer-to-peer renewable energy trading platform",
    "ai nutritionist that creates meal plans based on your genetics",
    "virtual coworking space with gamified productivity features",
    "smart water bottle that tracks hydration and reminds you to drink",
    "platform connecting food waste from restaurants to local farms",
    "wearable device that monitors stress and suggests breathing exercises",
    "app that turns everyday activities into charitable donations",
    "3d-printed prosthetics customized using smartphone cameras",
    "ai-powered personal finance advisor for gen z",
    "vertical farming kits for urban apartment dwellers",
    "mental health chatbot trained on cognitive behavioral therapy",
    "smart contact lenses that monitor glucose levels for diabetics",
    "platform for sharing and monetizing idle computing power",
    "ar language learning through real-world object recognition",
    "biodegradable phone cases that grow into plants when composted",
    "social network for organizing local community volunteer projects",
    "ai stylist that curates outfits from your existing wardrobe",
    "smart parking system that reserves spots via mobile app",
    "marketplace for renting professional equipment by the hour",
    "virtual interior designer using ar and user preferences",
    "app that matches roommates based on lifestyle compatibility",
    "automated greenhouse system for urban food production",
    "platform connecting freelance teachers with homeschooling families",
    "smart jewelry that discreetly alerts emergency contacts",
    "ai-powered dating app based on conversation compatibility",
    "subscription box for eco-friendly household products",
    "virtual reality platform for remote team building activities",
    "app that gamifies learning new languages through daily challenges",
    "smart luggage that follows you and charges your devices",
    "platform for booking private workspaces in cafes and libraries",
    "ai investment advisor specifically designed for millennials",
    "wearable air quality monitor with personalized health insights",
    "app that connects travelers with local cooking classes",
    "smart pill dispenser that reminds and tracks medication",
    "platform for trading skills and services without money",
    "ai-powered resume builder that optimizes for specific job postings",
    "virtual reality meditation experiences in exotic locations",
    "smart garden system that grows herbs indoors year-round",
    "app that connects pet owners for playdates and pet-sitting"
  ]
  
  const encouragingMessages = [
    "your idea could change everything",
    "the next big thing starts here",
    "every great startup began with one idea",
    "share your vision with the world",
    "vcs are waiting to discover you",
    "turn your dream into reality",
    "your breakthrough moment awaits",
    "innovation starts with sharing",
    "your idea deserves to be seen",
    "the spotlight is ready for you",
    "this could be your million-dollar moment",
    "great ideas need to be shared",
    "your creativity matters"
  ]

  useEffect(() => {
    // Typewriter effect for placeholder
    let index = 0
    const typewriterInterval = setInterval(() => {
      if (index <= fullPlaceholderText.length) {
        setPlaceholderText(fullPlaceholderText.slice(0, index))
        index++
      } else {
        // Pause for 2 seconds, then restart
        setTimeout(() => {
          index = 0
          setPlaceholderText('')
        }, 2000)
      }
    }, 80) // Typing speed

    // Cycling through one-liners every 4 seconds
    const onelinerInterval = setInterval(() => {
      setCurrentOnelinerIndex((prevIndex) => (prevIndex + 1) % sampleOneLiners.length)
    }, 4000)

    // Encouraging messages every 8 seconds
    const encouragementInterval = setInterval(() => {
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
      setEncouragementText(randomMessage)
      setShowEncouragement(true)
      setTimeout(() => setShowEncouragement(false), 3000)
    }, 8000)

    return () => {
      clearInterval(typewriterInterval)
      clearInterval(onelinerInterval)
      clearInterval(encouragementInterval)
    }
  }, [])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  const handleSubmit = () => {
    onSubmit()
  }

  return (
    <div className="relative flex flex-col items-center justify-center space-y-8 w-full max-w-lg mx-auto py-8">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-amber-400 rounded-full animate-bounce opacity-60" 
               style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-8 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-50" 
               style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute -bottom-2 left-8 w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce opacity-40" 
               style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
          <div className="absolute bottom-12 -right-3 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce opacity-60" 
               style={{ animationDelay: '0.5s', animationDuration: '2.8s' }}></div>
        </div>

        {/* Top motivation text */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-text-fade">
            join thousands of innovators sharing their ideas
          </p>
        </div>

        {/* Header with animated elements */}
        <div className="text-center space-y-4 relative">
          <div className="relative">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 
                           bg-clip-text text-transparent animate-text-glow delay-200">
              share your brilliant idea
            </h2>
            {/* Subtle glow effects */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-50" 
                 style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium animate-text-fade delay-300">
            you are one sentence away from a billion dollar investment
          </p>

          {/* Professional encouraging message popup */}
          {showEncouragement && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20
                            bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-3 rounded-lg
                            animate-fadeInUp shadow-2xl text-sm font-semibold whitespace-nowrap
                            border border-slate-700">
              {encouragementText}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full
                              w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
            </div>
          )}
        </div>
        
        {/* Premium input field with gold loading animation */}
        <div className="w-full space-y-6 relative">
          <div className="relative">
            {/* Heavy shadow for weight */}
            <div className="absolute inset-0 rounded-xl bg-black/20 blur-xl transform translate-y-2"></div>
            
            {/* Clean border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"
                 style={{ padding: '3px' }}>
              <div className="relative h-full w-full rounded-xl bg-white dark:bg-gray-900"></div>
            </div>
            
      <input 
        type="text" 
              placeholder={placeholderText} 
              className="relative z-20 w-full px-8 py-6 border-0 rounded-xl m-[3px]
                         bg-transparent text-gray-900 dark:text-white text-lg font-medium
                         focus:outline-none focus:ring-0
                         transition-all duration-300 text-center placeholder:text-center
                         placeholder:text-gray-500 dark:placeholder:text-gray-400
                         shadow-inner"
        value={oneLiner}
        onChange={(e) => setOneLiner(e.target.value)}
        onKeyPress={handleKeyPress}

      />
          </div>


          
          {/* Premium submit button with weight */}
      <button 
            className="relative w-full px-8 py-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 
                       hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700
                       text-white font-bold text-lg rounded-xl
                       transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                       focus:ring-4 focus:ring-amber-500/50 focus:ring-offset-2
                       shadow-2xl hover:shadow-3xl transform hover:-translate-y-1
                       overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
                       border-2 border-amber-400"
            onClick={handleSubmit}
            disabled={!oneLiner.trim()}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                            transform -skew-x-12 -translate-x-full group-hover:translate-x-full
                            transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex flex-col items-center justify-center animate-text-fade delay-600">
              <div className="flex items-center justify-center gap-3">
                launch your idea
                <span className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></span>
              </div>
              <span className={`text-xs mt-1 transition-colors duration-200 ${
                oneLiner.length === 0 
                  ? 'text-white/70'
                  : oneLiner.length < 10
                  ? 'text-white/80'
                  : oneLiner.length < 30
                  ? 'text-white/90'
                  : oneLiner.length < 50
                  ? 'text-white'
                  : oneLiner.length > 80
                  ? 'text-white/60'
                  : 'text-white'
              }`}>
                {oneLiner.length === 0 
                  ? 'start typing your brilliant idea...'
                  : oneLiner.length < 10
                  ? 'great start! keep going...'
                  : oneLiner.length < 30
                  ? 'you\'re onto something!'
                  : oneLiner.length < 50
                  ? 'looking fantastic!'
                  : oneLiner.length > 80
                  ? 'keep it concise for impact'
                  : 'perfect length - investors will love this!'
                }
              </span>
            </span>
      </button>

          {/* Character counter */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 animate-text-fade delay-700">
              {oneLiner.length}/100 characters
            </p>
          </div>

        </div>

        {/* Scrolling one-liners animation */}
        <div className="w-full max-w-md mx-auto py-4">
          <div className="scrolling-container">
            <div 
              key={currentOnelinerIndex}
              className="animate-scroll-up text-center px-4"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                "{sampleOneLiners[currentOnelinerIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* Bottom animation dots */}
        <div className="text-center">
          <div className="flex justify-center space-x-3">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
    </div>
  )
} 