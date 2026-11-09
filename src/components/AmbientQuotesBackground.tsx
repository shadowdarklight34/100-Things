import React, { useMemo } from 'react';
import { STATEMENTS_RAW, parseStatement } from '../data/statements';

interface FloatingItem {
  id: number;
  text: string;
  topPercent: number;
  speedSec: number;
  opacity: number;
  fontSizeRem: number;
  delaySec: number;
  direction: 'left' | 'right';
}

export const AmbientQuotesBackground: React.FC<{ currentIndex: number }> = () => {
  // Select a curated pool of ambient floating quotes
  const floatingItems = useMemo<FloatingItem[]>(() => {
    // Generate 12 distinct floating quote tracks distributed vertically
    const tracks = [14, 20, 27, 34, 40, 62, 68, 75, 81, 87, 92];
    
    return tracks.map((top, idx) => {
      // Pick varied statements across the 100 statements
      const statementIdx = (idx * 9 + 3) % STATEMENTS_RAW.length;
      return {
        id: idx,
        text: STATEMENTS_RAW[statementIdx],
        topPercent: top,
        speedSec: 45 + (idx % 4) * 15, // Smooth, slow drift 45s-90s
        opacity: 0.12 + (idx % 3) * 0.07, // 0.12 to 0.26 opacity
        fontSizeRem: 0.95 + (idx % 3) * 0.25, // 0.95rem to 1.45rem
        delaySec: -(idx * 7), // staggered start
        direction: idx % 2 === 0 ? 'left' : 'right',
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
      <style>{`
        @keyframes driftLeft {
          0% { transform: translate3d(100vw, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes driftRight {
          0% { transform: translate3d(-100%, 0, 0); }
          100% { transform: translate3d(100vw, 0, 0); }
        }
      `}</style>

      {floatingItems.map((item) => {
        const parts = parseStatement(item.text);
        const animName = item.direction === 'left' ? 'driftLeft' : 'driftRight';

        return (
          <div
            key={item.id}
            className="absolute whitespace-nowrap font-serif tracking-wide"
            style={{
              top: `${item.topPercent}%`,
              opacity: item.opacity,
              fontSize: `${item.fontSizeRem}rem`,
              animation: `${animName} ${item.speedSec}s linear infinite`,
              animationDelay: `${item.delaySec}s`,
              willChange: 'transform',
            }}
          >
            {parts.map((part, pIdx) => (
              <span
                key={pIdx}
                className={
                  part.isHighlighted
                    ? 'font-serif italic font-semibold text-[#f7d382]'
                    : 'text-[#e5decb]'
                }
              >
                {part.text}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

