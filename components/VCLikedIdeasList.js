'use client'

import NapkinCard from '../NapkinCard'

export default function VCLikedIdeasList({ 
  vcsWithLikedIdeas, 
  width = 600, 
  height = 400,
  emptyMessage = "No VCs have liked any ideas yet.",
  onLikeVC = null
}) {
  if (!vcsWithLikedIdeas || vcsWithLikedIdeas.length === 0) {
    return (
      <NapkinCard width={width} height={height}>
        <h2 className="text-lg font-semibold mb-4">VC Liked Ideas</h2>
        <p className="mb-3">Ideas that VCs have liked, organized by VC.</p>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-center">{emptyMessage}</p>
        </div>
      </NapkinCard>
    )
  }

  return (
    <NapkinCard width={width} height={height}>
      <h2 className="text-lg font-semibold mb-4">VC Liked Ideas</h2>
      <p className="mb-3">Ideas that VCs have liked, organized by VC.</p>
      
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {vcsWithLikedIdeas.map((vc) => (
          <div key={vc.vcId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-blue-600 mb-1">
                    {vc.vcName}
                  </h3>
                  {vc.vcLinkedin && (
                    <p className="text-sm text-gray-600 mb-1">
                      LinkedIn: {vc.vcLinkedin}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Liked {vc.likedIdeas.length} idea{vc.likedIdeas.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {onLikeVC && (
                  <button
                    onClick={() => onLikeVC(vc.vcId, vc.vcName, vc.likedIdeas[0]?.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Like VC</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {vc.likedIdeas.map((idea) => (
                <div key={idea.id} className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm font-medium text-gray-800">
                    &ldquo;{idea.idea_name}&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(idea.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </NapkinCard>
  )
} 