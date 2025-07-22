'use client'

import NapkinCard from '../NapkinCard'

export default function LikesList({ 
  items, 
  onUnlike, 
  width = 400, 
  height = 300,
  emptyMessage = "No liked items yet.",
  title = "Likes",
  description = "Your liked ideas."
}) {
  return (
    <NapkinCard width={width} height={height}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <p className="mb-3">{description}</p>
      {items.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm flex-1">{item.idea_name}</span>
              <button 
                onClick={() => onUnlike(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors ml-2"
                title="Unlike this item"
              >
                💔
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </NapkinCard>
  )
} 