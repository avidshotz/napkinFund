'use client'

import Image from 'next/image'
import NapkinModal from './NapkinModal'

export default function VCLikesModal({ 
  isOpen, 
  onClose, 
  vcsWithLikedIdeas, 
  vcLikedIdeas = [],
  onLikeVC 
}) {
  // Determine if this is showing VC's own liked ideas or VCs who liked user's ideas
  // If vcLikedIdeas is provided (even if empty), we're in VC mode showing liked ideas
  // If vcLikedIdeas is not provided, we're showing VCs who liked user's ideas
  const isShowingVCLikedIdeas = vcLikedIdeas !== undefined
  
  return (
    <NapkinModal
      isOpen={isOpen}
      onClose={onClose}
      title={isShowingVCLikedIdeas ? "liked ideas" : "likes"}
      description={isShowingVCLikedIdeas ? "ideas you've liked as a VC." : "VCs who liked your ideas."}
      width={600}
      height={500}
    >
             {isShowingVCLikedIdeas ? (
         // Show VC's own liked ideas
         vcLikedIdeas.length > 0 ? (
           <div className="space-y-6">
             {vcLikedIdeas.map((idea) => (
               <div key={idea.id} className="p-6 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200">
                 <div className="space-y-4">
                   {/* Idea Title */}
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                     {idea.idea_name || 'untitled idea'}
                   </h3>
                   
                   {/* Idea Description */}
                   {idea.idea_description && (
                     <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed text-center">
                       {idea.idea_description}
                     </p>
                   )}
                   
                   {/* Founder Info */}
                   {idea.creatorName && (
                     <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                         {idea.creatorPhoto ? (
                           <img 
                             src={idea.creatorPhoto} 
                             alt={`${idea.creatorName}'s profile`}
                             className="w-full h-full object-cover rounded-full"
                           />
                         ) : (
                           idea.creatorName.charAt(0).toUpperCase()
                         )}
                       </div>
                       <div className="text-center">
                         <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                           by {idea.creatorName}
                         </p>
                         {idea.creatorLinkedin && (
                           <a 
                             href={idea.creatorLinkedin} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                           >
                             view linkedin
                           </a>
                         )}
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center py-16 space-y-6">
             <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
               <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
             </div>
             <div className="text-center space-y-3">
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">no liked ideas yet</h3>
               <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                 start reviewing ideas and like the ones that interest you
               </p>
             </div>
           </div>
         )
       ) : (
         // Show VCs who liked user's ideas (original functionality)
         vcsWithLikedIdeas.length > 0 ? (
           <div className="space-y-3">
             {vcsWithLikedIdeas.map((vc) => (
               <div key={vc.vcId} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center">
                     {vc.vcPhoto && (
                       <Image src={vc.vcPhoto} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-gray-300 mr-2" />
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
         )
       )}
    </NapkinModal>
  )
} 