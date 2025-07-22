'use client'

import React from 'react';

const NapkinCornerButton = ({ onClick, count, label, width = 105 }) => {
  const height = width * 0.8;
  return (
    <div 
      className="relative flex items-end justify-center select-none"
      style={{ width: width, height: height }}
    >
      {/* Triangle shape: hypotenuse facing down */}
      <div 
        className="absolute bottom-0 left-0 bg-gray-100 border-2 border-gray-300 shadow-xl cursor-pointer pointer-events-auto"
        style={{
          width: width,
          height: height,
          clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
        }}
        onClick={onClick}
      />
      {/* Text on napkin */}
      <span
        className="absolute pointer-events-none"
        style={{
          bottom: height * 0.22,
          left: '50%',
          transform: 'translateX(-50%) rotate(-10deg)',
          color: '#7a5c2e',
          fontFamily: 'Caveat, cursive',
          fontSize: width * 0.13,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      {/* Count on napkin, lower right corner, smaller */}
      <span
        className="absolute pointer-events-none"
        style={{ 
          bottom: height * 0.04,
          right: width * 0.08,
          fontSize: width * 0.11,
          color: '#2b2b2b',
          fontWeight: 'bold',
        }}
      >
        {count}
      </span>
    </div>
  );
};

export default NapkinCornerButton; 