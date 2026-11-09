import React, { useEffect, useState, useRef } from 'react';

interface TrailSparkle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  size: number;
  color: string;
}

export const MagicCursorTrail: React.FC<{ theme: string }> = ({ theme }) => {
  const [sparkles, setSparkles] = useState<TrailSparkle[]>([]);
  const lastSpawnRef = useRef<number>(0);

  const getThemeSymbols = () => {
    switch (theme) {
      case 'sakura':
        return ['🌸', '💖', '♡', '✧', '⋆', '✨'];
      case 'lavender':
        return ['💜', '🔮', '✧', '✦', '⋆', '✨'];
      case 'aurora':
        return ['💚', '✨', '✧', '✦', '⋆', '🌟'];
      default:
        return ['✨', '💛', '✧', '✦', '⋆', '♡'];
    }
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'sakura':
        return ['#ff9ebb', '#ffb6c1', '#fcd5ce', '#ffffff'];
      case 'lavender':
        return ['#d8b4fe', '#c084fc', '#e9d5ff', '#ffffff'];
      case 'aurora':
        return ['#5eead4', '#34d399', '#a7f3d0', '#ffffff'];
      default:
        return ['#f7d382', '#ffbe53', '#ffe4a0', '#ffffff'];
    }
  };

  useEffect(() => {
    const handleMove = (x: number, y: number) => {
      const now = Date.now();
      if (now - lastSpawnRef.current < 45) return; // limit spawn rate
      lastSpawnRef.current = now;

      const symbols = getThemeSymbols();
      const colors = getThemeColors();
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 12;

      const id = now + Math.random();
      setSparkles((prev) => [
        ...prev.slice(-20), // keep max 20 sparkles active
        { id, x, y, symbol, size, color },
      ]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 750);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [theme]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none">
      <style>{`
        @keyframes trailDrift {
          0% { transform: translate(-50%, -50%) scale(0.6) rotate(0deg); opacity: 0.9; }
          50% { transform: translate(-50%, -85%) scale(1.15) rotate(15deg); opacity: 1; }
          100% { transform: translate(-50%, -140%) scale(0.3) rotate(-20deg); opacity: 0; }
        }
      `}</style>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute inline-block drop-shadow-[0_0_8px_currentColor]"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            fontSize: `${s.size}px`,
            color: s.color,
            animation: 'trailDrift 0.75s ease-out forwards',
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
};

