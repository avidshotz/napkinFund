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
    <div className="absolute top-2 right-2 text-xs text-gray-600 bg-white bg-opacity-90 rounded p-2 max-w-48 shadow-md z-10">
      {likeHistory.map((entry, index) => (
        <div key={index} className="mb-1 last:mb-0">
          <div className="font-medium">{entry.text}</div>
          {entry.timestamp && (
            <div className="text-gray-500">{entry.timestamp}</div>
          )}
        </div>
      ))}
    </div>
  )
}
