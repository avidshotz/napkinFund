'use client'

import React from 'react'
import BaseNapkinComponent from './BaseNapkinComponent'

export default class VCMatchedIdeas extends BaseNapkinComponent {
  renderContent = () => {
    const { 
      title = "Matches", 
      description = "Ideas where both you and the founder have shown interest.", 
      items = [], 
      emptyMessage = "No matches yet." 
    } = this.props
    const { currentIndex } = this.state

    return (
      <>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-3">{description}</p>
        {items.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="text-center mb-4 relative">
              {this.renderItem(items[currentIndex], 'vc')}
            </div>
            <div className="flex items-center space-x-4 mb-3">
              <span className="text-xs text-gray-600">
                {currentIndex + 1} of {items.length}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => this.handleAction('connect')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                title="Send connection request"
              >
                Connect
              </button>
              <button 
                onClick={() => this.handlePass(currentIndex)}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={items.length === 0}
              >
                Pass
              </button>
            </div>
          </div>
        ) : (
          this.renderEmptyState(emptyMessage)
        )}
      </>
    )
  }
}
