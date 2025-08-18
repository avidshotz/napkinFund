'use client'

import { useEffect, useState } from 'react'

export default function Confetti({ isActive, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (isActive) {
      // Create confetti particles covering the entire screen
      const newParticles = Array.from({ length: 120 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight, // Start from random positions across screen
        vx: (Math.random() - 0.5) * 8, // Reduced horizontal spread for smoother movement
        vy: (Math.random() - 0.5) * 4, // Reduced vertical spread for smoother movement
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8, // Reduced rotation speed
        color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f', '#fef3c7', '#fde68a', '#fcd34d'][Math.floor(Math.random() * 8)],
        size: Math.random() * 8 + 5, // Slightly smaller for better performance
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      }))

      // Add additional particles that fall from the top for dramatic effect
      const topParticles = Array.from({ length: 60 }, (_, i) => ({
        id: `top-${i}`,
        x: Math.random() * window.innerWidth,
        y: -20,
        vx: (Math.random() - 0.5) * 4, // Reduced horizontal movement
        vy: Math.random() * 2 + 0.5, // Reduced vertical speed
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6, // Reduced rotation speed
        color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f', '#fef3c7', '#fde68a', '#fcd34d'][Math.floor(Math.random() * 8)],
        size: Math.random() * 6 + 4, // Smaller particles
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      }))

      setParticles([...newParticles, ...topParticles])

      // Animate particles
      const animation = setInterval(() => {
        setParticles(prev => {
          const updated = prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            rotation: particle.rotation + particle.rotationSpeed,
            vy: particle.vy + 0.08 // reduced gravity for smoother movement
          }))

          // Remove particles that are off screen with more generous bounds
          const filtered = updated.filter(p => 
            p.y < window.innerHeight + 200 && 
            p.x > -100 && 
            p.x < window.innerWidth + 100
          )
          
          if (filtered.length === 0) {
            clearInterval(animation)
            onComplete?.()
          }
          
          return filtered
        })
      }, 32) // 30fps for smoother, less glitchy animation

      return () => clearInterval(animation)
    }
  }, [isActive, onComplete])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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
            backfaceVisibility: 'hidden'
          }}
        />
      ))}
    </div>
  )
}
