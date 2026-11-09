import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
  wobbleDuration: number;
  floatDuration: number;
  size: number;
}

export const CuteReactionsDock: React.FC = () => {
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const emojis = ['💖', '✨', '🥺', '💌', '🧸', '🌸'];

  const sendReaction = (emoji: string) => {
    sounds.playPop();

    // Spawn 2-3 floating emojis around the center/bottom
    const newItems: FloatingReaction[] = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      emoji,
      x: Math.random() * 80 + 10, // 10% to 90% across screen width
      wobbleDuration: 1.5 + Math.random() * 1.5,
      floatDuration: 2.5 + Math.random() * 1.5,
      size: Math.random() * 14 + 22,
    }));

    setReactions((prev) => [...prev, ...newItems]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => !newItems.some((n) => n.id === r.id)));
    }, 4000);
  };

  return (
    <>
      <style>{`
        @keyframes floatUpWobble {
          0% {
            transform: translateY(100vh) scale(0.4) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translateY(80vh) scale(1.1) rotate(-10deg);
          }
          50% {
            transform: translateY(45vh) scale(1) rotate(12deg);
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-10vh) scale(0.8) rotate(-15deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Floating Animated Emojis in Sky */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none">
        {reactions.map((r) => (
          <div
            key={r.id}
            className="absolute will-change-transform filter drop-shadow-[0_0_12px_rgba(255,180,200,0.7)]"
            style={{
              left: `${r.x}vw`,
              fontSize: `${r.size}px`,
              animation: `floatUpWobble ${r.floatDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Reactions Bar Pill */}
      <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-[#090611]/85 backdrop-blur-md shadow-lg shadow-black/50">
        <span className="hidden md:inline font-serif text-[11px] text-[#f7d382]/70 mr-1 tracking-wider">
          React:
        </span>
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => sendReaction(emoji)}
            className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 active:scale-125 transition-transform duration-150 text-base sm:text-lg leading-none"
            title={`Send ${emoji}`}
            aria-label={`Reaction ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};

