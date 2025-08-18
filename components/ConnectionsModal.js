'use client'

import React, { useState } from 'react'

/**
 * Connections management modal
 */
export default function ConnectionsModal({ 
  isOpen, 
  onClose, 
  connectionRequests = [], 
  role, 
  onRequestConnection,
  onAcceptConnection,
  onDisconnectConnection,
  onOpenLikesModal,
  onOpenPassedModal 
}) {
  const [showDetailsId, setShowDetailsId] = useState(null)

  if (!isOpen) return null

  // Sort connections by status priority
  const sortedConnections = connectionRequests.slice().sort((a, b) => {
    if (a.status === b.status) {
      return new Date(b.created_at) - new Date(a.created_at)
    }
    if (a.status === 'pending') return -1
    if (b.status === 'pending') return 1
    if (a.status === 'requested') return -1
    if (b.status === 'requested') return 1
    return 0
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'requested': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 
                           bg-clip-text text-transparent">
              matches
            </h1>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                         flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                         transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8 space-y-6">
          {/* Header with action buttons */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                manage matches
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                your professional connections and networking
              </p>
            </div>
            
            <div className="flex gap-3">
      <button
        onClick={onOpenPassedModal}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                           text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200"
      >
                ghosted
      </button>
      <button
        onClick={onOpenLikesModal}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 
                           hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white 
                           rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        likes
      </button>
    </div>
          </div>

          {/* Connections list */}
          {sortedConnections.length > 0 ? (
            <div className="space-y-4">
              {sortedConnections.map((conn) => (
                <div key={conn.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {role === 'founder' ? (conn.vcName || conn.vc_id) : (conn.founderName || conn.founder_id)}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conn.status)}`}>
                          {conn.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Idea: {conn.ideaName || conn.idea_id}
                      </p>
                      
                      {(role === 'founder' ? conn.vcLinkedin : conn.founderLinkedin) && (
                        <a
                          href={role === 'founder' ? conn.vcLinkedin : conn.founderLinkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-4 py-2 text-sm font-bold
                                     text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600
                                     hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700
                                     rounded-lg transition-all duration-300 hover:scale-105 active:scale-95
                                     border-2 border-blue-400 hover:border-blue-500
                                     shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          view linkedin
                        </a>
                    )}
                  </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(conn.created_at).toLocaleDateString()}
                      </span>
                      
                      {/* Action buttons based on status */}
                      {conn.status === 'pending' && role === 'vc' && (
                    <button
                          onClick={() => onRequestConnection(conn.founder_id, conn.idea_id, 'Let\'s connect!')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                          connect
                    </button>
                      )}
                      
                      {conn.status === 'requested' && role === 'founder' && (
                  <button
                          onClick={() => onAcceptConnection(conn.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                          accept
                  </button>
                )}
                      
                      {conn.status === 'connected' && (
                      <button
                          onClick={() => setShowDetailsId(conn.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                          View Details
                      </button>
                      )}
                      </div>
                    </div>
                  </div>
              ))}
                      </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 
                             rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                      </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                no connections yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                start connecting with founders and vcs to build your network
              </p>
                  </div>
                )}
              </div>
        </div>
        </div>
  )
} 