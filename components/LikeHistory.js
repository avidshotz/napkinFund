'use client'

import React from 'react'

export default function LikeHistory({ 
  item, 
  userRole = 'vc',
  connectionData = null 
}) {
  if (!item) return null

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getLikeHistory = () => {
    const history = []
    
    // Use connection data if provided, otherwise use item data
    const data = connectionData || item
    
    // Based on connection status and timestamps, show the like history
    if (data.connectionStatus === 'curious' || data.connectionStatus === 'pending' || 
        data.connectionStatus === 'requested' || data.connectionStatus === 'connected') {
      
      // VC liked this (when connection was created with curious status)
      if (data.created_at) {
        history.push({
          text: userRole === 'vc' ? 'You liked this at' : 'VC liked this at',
          timestamp: formatTimestamp(data.created_at)
        })
      }
      
      // If status is pending or higher, founder has liked back
      if (data.connectionStatus === 'pending' || data.connectionStatus === 'requested' || 
          data.connectionStatus === 'connected') {
        if (data.updated_at && data.updated_at !== data.created_at) {
          history.push({
            text: userRole === 'vc' ? 'Founder liked you at' : 'You liked VC at',
            timestamp: formatTimestamp(data.updated_at)
          })
        }
      }
      
      // If status is requested, VC sent connection request
      if (data.connectionStatus === 'requested' || data.connectionStatus === 'connected') {
        const requestTime = data.updated_at ? new Date(new Date(data.updated_at).getTime() + 1000) : null
        history.push({
          text: userRole === 'vc' ? 'You sent connection request at' : 'VC sent connection request at',
          timestamp: formatTimestamp(requestTime)
        })
      }
      
      // If status is connected, founder accepted
      if (data.connectionStatus === 'connected') {
        const acceptTime = data.updated_at ? new Date(new Date(data.updated_at).getTime() + 2000) : null
        history.push({
          text: userRole === 'vc' ? 'Founder accepted connection at' : 'You accepted connection at',
          timestamp: formatTimestamp(acceptTime)
        })
      }
    }
    
    return history
  }

  const likeHistory = getLikeHistory()
  
  if (likeHistory.length === 0) return null

  return (
    <div className="absolute top-4 right-4 text-xs text-slate-700 dark:text-slate-300 
                    bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm 
                    rounded-lg p-3 max-w-52 shadow-lg border border-slate-200/60 dark:border-slate-700/60 z-20">
      {likeHistory.map((entry, index) => (
        <div key={index} className="mb-2 last:mb-0">
          <div className="font-medium text-slate-900 dark:text-slate-100">{entry.text}</div>
          {entry.timestamp && (
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">{entry.timestamp}</div>
          )}
        </div>
      ))}
    </div>
  )
}
