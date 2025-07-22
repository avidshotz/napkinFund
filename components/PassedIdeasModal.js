'use client'

import React from 'react'
import NapkinCard from '../NapkinCard'

export default function PassedIdeasModal({ 
  isOpen, 
  onClose, 
  passedIdeas, 
  onUnpass,
  role = 'vc'
}) {
  if (!isOpen) return null

  const handleUnpass = async (id) => {
    if (onUnpass) {
      await onUnpass(id)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <NapkinCard width="100%" height="auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Passed Ideas</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {passedIdeas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No passed ideas yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {passedIdeas.map((idea) => (
                <div key={idea.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {idea.idea_name}
                      </h3>
                      {idea.creatorName && (
                        <div className="flex items-center space-x-2 mb-2">
                          {idea.creatorPhoto && (
                            <img 
                              src={idea.creatorPhoto} 
                              alt={idea.creatorName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm text-gray-600">
                            by {idea.creatorName}
                          </span>
                          {(idea.creatorLinkedin || idea.vcLinkedin || idea.founderLinkedin) && (
                            <a 
                              href={idea.creatorLinkedin || idea.vcLinkedin || idea.founderLinkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-sm ml-2"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Passed on {new Date(idea.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnpass(idea.id)}
                      className="ml-4 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                      title="Unpass this idea"
                    >
                      Unpass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </NapkinCard>
      </div>
    </div>
  )
} 