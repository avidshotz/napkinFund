'use client'

import React from 'react'
import BaseNapkinComponent from './BaseNapkinComponent'

export default function VCUnreviewedIdeas({
  title = "ideas to review", 
  description = "new ideas waiting for your review.", 
  items = [], 
  emptyMessage = "no new ideas to review.",
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