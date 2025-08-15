'use client'

import React from 'react'
import BaseNapkinComponent from './BaseNapkinComponent'

export default class VCUnreviewedIdeas extends BaseNapkinComponent {
  renderContent = () => {
    const { 
      title = "Ideas to Review", 
      description = "New ideas waiting for your review.", 
      items = [], 
      emptyMessage = "No new ideas to review." 
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
                onClick={() => this.handleAction('like')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Like this idea"
              >
                👍
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
