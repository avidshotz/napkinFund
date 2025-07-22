'use client'

import { useState } from 'react'
import NapkinCard from '../NapkinCard'

export default function MatchesNapkin({ 
  matches, 
  width = 400, 
  height = 300, 
  role = 'vc',
  onSendConnectionRequest 
}) {
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const openConnectionModal = (match) => {
    setSelectedMatch(match)
    setIsModalOpen(true)
    setMessage('')
  }

  const closeConnectionModal = () => {
    setIsModalOpen(false)
    setSelectedMatch(null)
    setMessage('')
  }

  const handleSendConnection = async () => {
    if (!message.trim() || !selectedMatch || !onSendConnectionRequest) return
    
    setIsSending(true)
    try {
      await onSendConnectionRequest(selectedMatch.user_id, message.trim())
      closeConnectionModal()
    } catch (error) {
      console.error('Error sending connection request:', error)
      alert('Failed to send connection request. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const getQuickMessageTemplate = (type) => {
    switch (type) {
      case 'email':
        return 'Hi! I loved your idea. Would you be interested in discussing this further? My email is [your-email@example.com]'
      case 'luma':
        return 'Hi! I loved your idea. Let\'s schedule a call to discuss this further. Here\'s my Luma link: [your-luma-link]'
      case 'meet':
        return 'Hi! I loved your idea. Let\'s schedule a meeting to discuss this further. Here\'s my Google Meet link: [your-meet-link]'
      case 'linkedin':
        return 'Hi! I loved your idea. Would you be interested in connecting on LinkedIn to discuss this further? Please DM me at [your-linkedin-profile]'
      default:
        return ''
    }
  }

  return (
    <>
      <NapkinCard width={width} height={height}>
        <h2 className="text-lg font-semibold mb-4">
          {role === 'vc' ? 'Matches' : 'Connection Requests'}
        </h2>
        <p className="mb-3">
          {role === 'vc' 
            ? 'Ideas liked by both VCs and founders.' 
            : 'VCs who want to connect with you.'
          }
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {matches.length > 0 ? (
            matches.map(match => (
              <div key={match.id} className="p-2 bg-green-50 rounded border border-green-200">
                <p className="text-sm">{match.idea_name}</p>
                {role === 'vc' && (
                  <button
                    onClick={() => openConnectionModal(match)}
                    className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors flex items-center space-x-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Connect</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">
                {role === 'vc' ? 'No matches yet.' : 'No connection requests yet.'}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {role === 'vc' 
                  ? 'Like ideas in both sections to create matches!' 
                  : 'VCs will send you connection requests when they like your ideas.'
                }
              </p>
            </div>
          )}
        </div>
      </NapkinCard>

      {/* Connection Request Modal for VCs */}
      {isModalOpen && selectedMatch && role === 'vc' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Connection Request</h3>
              <button
                onClick={closeConnectionModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Idea:</p>
                <p className="font-medium">&ldquo;{selectedMatch.idea_name}&rdquo;</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Quick Templates:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setMessage(getQuickMessageTemplate('email'))}
                    className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    📧 Email Request
                  </button>
                  <button
                    onClick={() => setMessage(getQuickMessageTemplate('luma'))}
                    className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    📅 Luma Link
                  </button>
                  <button
                    onClick={() => setMessage(getQuickMessageTemplate('meet'))}
                    className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    🎥 Google Meet
                  </button>
                  <button
                    onClick={() => setMessage(getQuickMessageTemplate('linkedin'))}
                    className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    💼 LinkedIn DM
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Message:</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your connection request message..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeConnectionModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendConnection}
                disabled={!message.trim() || isSending}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 