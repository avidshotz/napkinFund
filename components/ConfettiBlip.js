'use client'

import { useEffect, useState } from 'react'

export default function ConfettiBlip({ isActive, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (isActive) {
      // Create a quick burst of confetti particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f', '#fef3c7', '#fde68a', '#fcd34d'][Math.floor(Math.random() * 8)],
        size: Math.random() * 6 + 3,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
        life: 60 // frames of life
      }))

      setParticles(newParticles)

      // Quick animation that lasts about 1 second
      const animation = setInterval(() => {
        setParticles(prev => {
          const updated = prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            rotation: particle.rotation + particle.rotationSpeed,
            life: particle.life - 1
          }))

          // Remove particles that have no life left
          const filtered = updated.filter(p => p.life > 0)
          
          if (filtered.length === 0) {
            clearInterval(animation)
            onComplete?.()
          }
          
          return filtered
        })
      }, 16) // 60fps

      return () => clearInterval(animation)
    }
  }, [isActive, onComplete])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute ${particle.shape === 'circle' ? 'rounded-full' : ''}`}
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            transition: 'none',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            opacity: particle.life / 60 // fade out as life decreases
          }}
        />
      ))}
    </div>
  )
}
