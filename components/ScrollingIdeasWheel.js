'use client'

import { useEffect, useState } from 'react'

export default function ScrollingIdeasWheel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Array of 100 different startup ideas
  const startupIdeas = [
    "ai-powered personal chef that learns your taste preferences",
    "platform connecting local farmers with urban consumers",
    "app that gamifies learning a new language with friends",
    "subscription service for sustainable household products",
    "marketplace for local artists to sell custom home decor",
    "tool that automatically organizes your digital photos by memory",
    "service that connects busy parents with trusted local babysitters",
    "platform matching remote workers with local communities",
    "ai tool that writes emails in your personal voice",
    "app that helps you find the best local coffee shops",
    "platform connecting food waste from restaurants to local farms",
    "service that creates custom workout plans based on your goals",
    "app that helps you discover new music based on your mood",
    "platform connecting pet owners with local pet sitters",
    "tool that helps you track and reduce your carbon footprint",
    "service that creates personalized meal plans for families",
    "app that helps you find the best deals on local services",
    "platform connecting travelers with local tour guides",
    "tool that helps you declutter and organize your home",
    "service that creates custom skincare routines",
    "app that helps you find the best local restaurants",
    "platform connecting freelancers with project opportunities",
    "tool that helps you learn new skills in 5-minute sessions",
    "service that creates personalized travel itineraries",
    "app that helps you find the best local events",
    "platform connecting small businesses with local customers",
    "tool that helps you manage your personal finances",
    "service that creates custom gift recommendations",
    "app that helps you find the best local shopping",
    "platform connecting homeowners with local contractors",
    "tool that helps you track your daily habits",
    "service that creates personalized fitness challenges",
    "app that helps you discover new hobbies",
    "platform connecting students with local tutors",
    "tool that helps you plan and organize events",
    "service that creates custom home improvement plans",
    "app that helps you find the best local entertainment",
    "platform connecting pet owners with local veterinarians",
    "tool that helps you manage your time more effectively",
    "service that creates personalized learning paths",
    "app that helps you find the best local activities",
    "platform connecting small businesses with suppliers",
    "tool that helps you track your health metrics",
    "service that creates custom home organization plans",
    "app that helps you discover new local businesses",
    "platform connecting homeowners with local designers",
    "tool that helps you manage your personal projects",
    "service that creates personalized wellness plans",
    "app that helps you find the best local services",
    "platform connecting freelancers with clients",
    "tool that helps you track your personal growth",
    "service that creates custom home automation plans",
    "app that helps you discover new local attractions",
    "platform connecting small businesses with investors",
    "tool that helps you manage your daily tasks",
    "service that creates personalized career development plans",
    "app that helps you find the best local deals",
    "platform connecting homeowners with local landscapers",
    "tool that helps you track your financial goals",
    "service that creates custom home security plans",
    "app that helps you discover new local experiences",
    "platform connecting small businesses with mentors",
    "tool that helps you manage your personal relationships",
    "service that creates personalized investment plans",
    "app that helps you find the best local resources",
    "platform connecting homeowners with local electricians",
    "tool that helps you track your personal achievements",
    "service that creates custom home maintenance plans",
    "app that helps you discover new local opportunities",
    "platform connecting small businesses with consultants",
    "tool that helps you manage your personal development",
    "service that creates personalized business plans",
    "app that helps you find the best local support",
    "platform connecting homeowners with local plumbers",
    "tool that helps you track your personal goals",
    "service that creates custom home renovation plans",
    "app that helps you discover new local connections",
    "platform connecting small businesses with partners",
    "tool that helps you manage your personal success",
    "service that creates personalized growth plans",
    "app that helps you find the best local solutions",
    "platform connecting homeowners with local architects",
    "tool that helps you track your personal progress",
    "service that creates custom home design plans",
    "app that helps you discover new local possibilities",
    "platform connecting small businesses with customers",
    "tool that helps you manage your personal excellence",
    "service that creates personalized success plans",
    "app that helps you find the best local options",
    "platform connecting homeowners with local craftsmen",
    "tool that helps you track your personal milestones",
    "service that creates custom home improvement strategies",
    "app that helps you discover new local ventures",
    "platform connecting small businesses with opportunities",
    "tool that helps you manage your personal advancement",
    "service that creates personalized achievement plans",
    "app that helps you find the best local pathways",
    "platform connecting homeowners with local experts",
    "tool that helps you track your personal evolution",
    "service that creates custom home transformation plans",
    "app that helps you discover new local frontiers",
    "platform connecting small businesses with growth",
    "tool that helps you manage your personal transformation",
    "service that creates personalized breakthrough plans",
    "app that helps you find the best local innovations",
    "platform connecting homeowners with local visionaries",
    "tool that helps you track your personal revolution",
    "service that creates custom home innovation plans"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % startupIdeas.length)
        setIsAnimating(false)
      }, 300)
    }, 3000) // Change idea every 3 seconds

    return () => clearInterval(interval)
  }, [startupIdeas.length])

  return (
    <div className="w-full py-16 bg-gradient-to-t from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-amber-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-yellow-200/20 rounded-full animate-pulse"></div>
        
        {/* Moving lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-px h-32 bg-gradient-to-b from-transparent via-yellow-300 to-transparent animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
                 <div className="text-center mb-8">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4
                          bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent
                          animate-pulse">
             inspiration for your next big idea
           </h2>
           <p className="text-lg text-gray-600 dark:text-gray-400 animate-bounce">
             scroll through 100+ startup concepts to spark your creativity
           </p>
         </div>
        
        <div className="relative">
                     {/* Scrolling Ideas Container */}
           <div className="scrolling-container mx-auto max-w-4xl">
             <div className="text-center">
               <div className={`text-lg md:text-xl font-medium text-amber-700 dark:text-amber-300 
                              leading-relaxed px-8 py-6 bg-white/80 dark:bg-gray-800/80 
                              rounded-2xl shadow-lg border border-amber-200 dark:border-amber-700
                              backdrop-blur-sm max-w-5xl mx-auto transition-all duration-500 ease-out
                              ${isAnimating ? 'scale-95 opacity-50 transform -translate-y-2' : 'scale-100 opacity-100 transform translate-y-0'}
                              hover:scale-105 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500`}>
                 <span className={`inline-block transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                   "{startupIdeas[currentIndex]}"
                 </span>
               </div>
             </div>
           </div>
          
                     {/* Navigation Dots */}
           <div className="flex justify-center mt-8 space-x-2">
             {[...Array(10)].map((_, i) => (
               <button
                 key={i}
                 onClick={() => setCurrentIndex(i * 10)}
                 className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-150 ${
                   Math.floor(currentIndex / 10) === i
                     ? 'bg-amber-500 scale-125 animate-pulse'
                     : 'bg-amber-200 dark:bg-amber-700 hover:bg-amber-300 dark:hover:bg-amber-600'
                 }`}
               />
             ))}
           </div>
          
                     {/* Progress Bar */}
           <div className="mt-6 max-w-md mx-auto">
             <div className="w-full bg-amber-200 dark:bg-amber-700 rounded-full h-2 overflow-hidden">
               <div 
                 className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out
                            shadow-lg animate-pulse"
                 style={{ width: `${((currentIndex + 1) / startupIdeas.length) * 100}%` }}
               />
             </div>
             <div className="text-center mt-2 text-sm text-amber-600 dark:text-amber-400 animate-bounce">
               {currentIndex + 1} of {startupIdeas.length} ideas
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
