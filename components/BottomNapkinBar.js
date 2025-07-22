import React, { useEffect, useState } from 'react';
import NapkinCornerButton from './NapkinCornerButton';

export default function BottomNapkinBar({ buttons }) {
  const [napkinWidth, setNapkinWidth] = useState(105); // smaller default

  useEffect(() => {
    function handleResize() {
      const minWidth = 70;
      const maxWidth = 140;
      const gap = 32; // px, matches gap-8
      const totalGaps = (buttons.length - 1) * gap;
      const available = window.innerWidth - totalGaps - 40; // 40px padding
      const width = Math.max(minWidth, Math.min(maxWidth, Math.floor(available / buttons.length)));
      setNapkinWidth(width);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [buttons.length]);

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-between items-end px-6 z-40 pointer-events-none" style={{gap: 0}}>
      {buttons.map((button, i) => (
        <div key={button.label} className="flex-1 flex justify-center pointer-events-none">
          <NapkinCornerButton {...button} width={napkinWidth} />
        </div>
      ))}
    </div>
  );
} 