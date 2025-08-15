'use client'

import React from 'react'
import NapkinCard from '../NapkinCard'
import LikeHistory from './LikeHistory'

export default class BaseNapkinComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    }
  }

  handlePass = (index) => {
    const { items, onPass } = this.props
    if (items.length > 0 && onPass) {
      onPass(index)
      // Reset to 0 if this was the last item, otherwise stay on same index
      if (items.length === 1) {
        this.setState({ currentIndex: 0 })
      } else {
        this.setState({ currentIndex: Math.min(this.state.currentIndex, items.length - 2) })
      }
    }
  }

  handleAction = (actionType) => {
    const { items, onLike, onConnect } = this.props
    const { currentIndex } = this.state
    
    if (items[currentIndex]) {
      if (actionType === 'like' && onLike) {
        onLike(items[currentIndex].id)
      } else if (actionType === 'connect' && onConnect) {
        onConnect(items[currentIndex])
      }
    }
  }

  renderItem = (item, userRole = 'vc', showLikeHistory = true) => {
    return (
      <div className="text-center">
        <p className="text-sm font-medium">{item?.idea_name || 'Loading...'}</p>
        {(item?.creatorLinkedin || item?.vcLinkedin || item?.founderLinkedin) && (
          <a
            href={item?.creatorLinkedin || item?.vcLinkedin || item?.founderLinkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-xs block mt-1"
          >
            LinkedIn
          </a>
        )}
      </div>
    )
  }

  renderLikeHistory = (item, userRole = 'vc') => {
    return <LikeHistory item={item} userRole={userRole} />
  }

  renderEmptyState = (emptyMessage) => {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  renderContent = () => {
    // This method should be overridden by child components
    throw new Error('renderContent method must be implemented by child components')
  }

  render() {
    const { width = 400, height = 300, items = [] } = this.props
    const { currentIndex } = this.state
    const currentItem = items[currentIndex]
    
    return (
      <NapkinCard width={width} height={height}>
        {this.renderContent()}
        {currentItem && this.renderLikeHistory(currentItem, 'vc')}
      </NapkinCard>
    )
  }
}
