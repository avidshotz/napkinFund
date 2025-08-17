'use client'

import React from 'react'
import BaseNapkinComponent from './BaseNapkinComponent'

export default function VCMatchedIdeas({
  title = "matches", 
  description = "ideas where both you and the founder have shown interest.", 
  items = [], 
  emptyMessage = "no matches yet.",
  onLike,
  onPass
}) {
  return (
    <BaseNapkinComponent
      title={title}
      description={description}
      items={items}
      emptyMessage={emptyMessage}
      onLike={onLike}
      onPass={onPass}
      userRole="vc"
    />
  )
}