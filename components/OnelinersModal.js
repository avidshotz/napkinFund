'use client'

import React from 'react'
import NapkinModal from './NapkinModal'

export default function OnelinersModal({
  isOpen,
  onClose,
  oneliners,
  onEdit,
  onDelete
}) {
  if (!isOpen) return null

  return (
    <NapkinModal
      isOpen={isOpen}
      onClose={onClose}
      title="My Oneliners"
      description="Manage your submitted one-liner ideas."
      width={600}
      height={500}
    >
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {oneliners && oneliners.length > 0 ? (
          oneliners.map((item) => (
            <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-800 font-medium text-lg">{item.idea_name}</p>
                  {(item.creatorLinkedin || item.vcLinkedin || item.founderLinkedin) && (
                    <a
                      href={item.creatorLinkedin || item.vcLinkedin || item.founderLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs block mt-1"
                    >
                      LinkedIn
                    </a>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(item.id, item.idea_name)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No oneliners submitted yet.</p>
            <p className="text-sm">Submit your first one-liner idea to get started!</p>
          </div>
        )}
      </div>
    </NapkinModal>
  )
} 