'use client'

import NapkinModal from './NapkinModal'
import ModalItem from './ModalItem'

export default function SubmittedIdeasModal({ 
  isOpen, 
  onClose, 
  items, 
  onUnlike 
}) {
  const deleteIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  return (
    <NapkinModal
      isOpen={isOpen}
      onClose={onClose}
      title="Your Submitted Ideas"
      description="Ideas you've submitted for VCs to see."
      width={600}
      height={500}
    >
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <ModalItem
              key={item.id}
              item={item}
              onAction={onUnlike}
              actionIcon={deleteIcon}
              actionTitle="Delete this idea"
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-center">No submitted ideas yet.</p>
        </div>
      )}
    </NapkinModal>
  )
} 