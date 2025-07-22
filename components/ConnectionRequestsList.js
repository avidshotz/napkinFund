'use client'

import { useState, useEffect } from 'react'
import NapkinCard from '../NapkinCard'
import { supabase } from '../lib/supabase'

export default function ConnectionRequestsList({ 
  connectionRequests, 
  width = 600, 
  height = 400,
  role = 'founder',
  onRequestConnection = null,
  onAcceptConnection = null,
  emptyMessage = null
}) {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [connectionMessages, setConnectionMessages] = useState({})

  // Fetch messages for connection requests
  useEffect(() => {
    const fetchMessages = async () => {
      if (connectionRequests.length > 0) {
        const messages = {}
        for (const request of connectionRequests) {
          const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('connection_id', request.id)
            .order('created_at', { ascending: true })
          
          messages[request.id] = data || []
        }
        setConnectionMessages(messages)
      }
    }
    
    fetchMessages()
  }, [connectionRequests])

  const openMessageModal = (request) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const closeMessageModal = () => {
    setIsModalOpen(false)
    setSelectedRequest(null)
    setMessage('')
  }

  const handleSendRequest = async () => {
    if (message.trim() && selectedRequest && onRequestConnection) {
      await onRequestConnection(selectedRequest.founder_id, selectedRequest.idea_id, message)
      closeMessageModal()
    }
  }

  const handleAcceptConnection = async (connectionId) => {
    if (onAcceptConnection) {
      await onAcceptConnection(connectionId)
    }
  }

  // Set appropriate empty message based on role
  const getEmptyMessage = () => {
    if (emptyMessage) return emptyMessage
    if (role === 'vc') {
      return "No pending connections yet. Founders will appear here after they like you."
    }
    return "No connection requests yet."
  }

  if (!connectionRequests || connectionRequests.length === 0) {
    return (
      <NapkinCard width={width} height={height}>
        <h2 className="text-lg font-semibold mb-4">
          {role === 'vc' ? 'Pending Connections' : 'Connection Requests'}
        </h2>
        <p className="mb-3">
          {role === 'vc' 
            ? 'Founders who liked you back.' 
            : 'VCs who want to connect with you.'
          }
        </p>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-center">{getEmptyMessage()}</p>
        </div>
      </NapkinCard>
    )
  }

  return (
    <>
      <NapkinCard width={width} height={height}>
        <h2 className="text-lg font-semibold mb-4">
          {role === 'vc' ? 'Pending Connections' : 'Connection Requests'}
        </h2>
        <p className="mb-3">
          {role === 'vc' 
            ? 'Founders who liked you back.' 
            : 'VCs who want to connect with you.'
          }
        </p>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {connectionRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-3 bg-blue-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-800">
                    {role === 'vc' 
                      ? (request.founderName || `Founder ${request.founder_id.slice(0, 8)}...`)
                      : `VC ${request.vc_id.slice(0, 8)}...`
                    }
                  </h3>
                  <p className="text-sm text-gray-600">
                    {role === 'vc' ? 'Liked you:' : 'Requested:'} {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {role === 'vc' ? (
                <button
                  onClick={() => openMessageModal(request)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                      <span>Send Request</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAcceptConnection(request.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Accept</span>
                </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </NapkinCard>

      {/* Message Modal for VCs */}
      {isModalOpen && selectedRequest && role === 'vc' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Connection Request</h3>
              <button
                onClick={closeMessageModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">To:</p>
                <p className="font-medium">{selectedRequest.founderName || `Founder ${selectedRequest.founder_id.slice(0, 8)}...`}</p>
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
                onClick={closeMessageModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={!message.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal for Founders */}
      {isModalOpen && selectedRequest && role === 'founder' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Connection Request</h3>
              <button
                onClick={closeMessageModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">From:</p>
                <p className="font-medium">VC {selectedRequest.vc_id.slice(0, 8)}...</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Date:</p>
                <p>{new Date(selectedRequest.created_at).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Message:</p>
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-gray-800">
                    {connectionMessages[selectedRequest.id]?.[0]?.content || "No message provided"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeMessageModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleAcceptConnection(selectedRequest.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Accept Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 