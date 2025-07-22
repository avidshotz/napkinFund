'use client'

import NapkinModal from './NapkinModal'

export default function VCLikesModal({ 
  isOpen, 
  onClose, 
  vcsWithLikedIdeas, 
  onLikeVC 
}) {
  return (
    <NapkinModal
      isOpen={isOpen}
      onClose={onClose}
      title="Likes"
      description="VCs who liked your ideas."
      width={600}
      height={500}
    >
      {vcsWithLikedIdeas.length > 0 ? (
        <div className="space-y-3">
          {vcsWithLikedIdeas.map((vc) => (
            <div key={vc.vcId} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {vc.vcPhoto && (
                    <img src={vc.vcPhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-300 mr-2" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{vc.vcName}</span>
                    {vc.vcLinkedin && (
                      <a href={vc.vcLinkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">LinkedIn</a>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => onLikeVC(vc.vcId, vc.vcName, vc.likedIdeas[0]?.id)}
                  className="text-blue-500 hover:text-blue-700 transition-colors ml-3 p-1"
                  title="Like this VC"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-600 text-center">
                {vc.likedIdeas.map(idea => (
                  <p key={idea.id}>Liked: {idea.idea_name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-center">No VCs have liked your ideas yet.</p>
        </div>
      )}
    </NapkinModal>
  )
} 