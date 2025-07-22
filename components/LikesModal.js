'use client'

import NapkinModal from './NapkinModal'
import ModalItem from './ModalItem'

export default function LikesModal({ 
  isOpen, 
  onClose, 
  items, 
  onUnlike 
}) {
  // Debug: log items to see their structure
  console.log('LikesModal items:', items)
  const unlikeIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  return (
    <NapkinModal
      isOpen={isOpen}
      onClose={onClose}
      title="Likes"
      description="Your liked ideas."
      width={600}
      height={500}
    >
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <ModalItem
              key={item.id || item.connectionId || `item-${index}`}
              item={item}
              onAction={onUnlike}
              actionIcon={unlikeIcon}
              actionTitle="Unlike this item"
              showProfile
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-center">No liked ideas yet.</p>
        </div>
      )}
    </NapkinModal>
  )
} 