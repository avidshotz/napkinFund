'use client'

import { useState } from 'react'
import NapkinCard from './NapkinCard'

export default function SwipeNapkin({ 
  title, 
  description, 
  items, 
  onLike, 
  onPass, 
  width = 400, 
  height = 300,
  emptyMessage = "No items yet.",
  renderItem
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
    <NapkinCard width={width} height={height}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <p className="mb-3">{description}</p>
      {items.length > 0 ? (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="text-center mb-4">
            {renderItem
              ? renderItem(items[currentIndex])
              : (
                <>
                  <p className="text-sm font-medium">{items[currentIndex]?.idea_name || 'Loading...'}</p>
                  {(items[currentIndex]?.creatorLinkedin || items[currentIndex]?.vcLinkedin || items[currentIndex]?.founderLinkedin) && (
                    <a
                      href={items[currentIndex]?.creatorLinkedin || items[currentIndex]?.vcLinkedin || items[currentIndex]?.founderLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs block mt-1"
                    >
                      LinkedIn
                    </a>
                  )}
                </>
              )
            }
          </div>
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-xs text-gray-600">
              {currentIndex + 1} of {items.length}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title={title === "Likes" ? "Unlike this item" : "Like this item"}
            >
              {title === "Likes" ? '💔' : '👍'}
            </button>
            <button 
              onClick={handlePass}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={items.length === 0}
            >
              Pass
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </NapkinCard>
  )
} 