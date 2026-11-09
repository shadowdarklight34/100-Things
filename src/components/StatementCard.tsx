import React, { useState, useRef } from 'react';
import { Statement, parseStatement } from '../data/statements';
import { Heart, Sparkles, Dices, MailOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface StatementCardProps {
  statement: Statement;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onRandomQuote: () => void;
  onOpenLoveLetter: () => void;
  theme?: string;
}

export const StatementCard: React.FC<StatementCardProps> = ({
  statement,
  isFavorite,
  onToggleFavorite,
  onRandomQuote,
  onOpenLoveLetter,
}) => {
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastTapRef = useRef<number>(0);

  const parts = parseStatement(statement.raw);
  const formattedNumber = String(statement.id).padStart(3, '0');
  const isFinalReason = statement.id === 100;

  // Handle double tap on mobile
  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 320;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      const touch = e.changedTouches[0];
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      triggerHeartAnimation(x, y);
      if (!isFavorite) {
        onToggleFavorite(statement.id);
      }
    }
    lastTapRef.current = now;
  };

  const triggerHeartAnimation = (x: number, y: number) => {
    sounds.playPop();
    const id = Date.now();
    setFloatingHearts((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1200);

    confetti({
      particleCount: 18,
      spread: 45,
      origin: {
        x: (x + window.innerWidth * 0.1) / window.innerWidth,
        y: y / window.innerHeight,
      },
      colors: ['#ff9ebb', '#ffb6c1', '#f7d382', '#ffffff'],
      shapes: ['circle'],
    });
  };

  const handleHeartClick = () => {
    sounds.playPop();
    onToggleFavorite(statement.id);
    if (!isFavorite) {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#ff9ebb', '#ffb6c1', '#f7d382', '#ffffff'],
      });
    }
  };

  return (
    <div
      onTouchEnd={handleTouchEnd}
      className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl px-3 sm:px-8 py-2 my-auto select-none"
    >
      <style>{`
        @keyframes floatUpFade {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
          30% { transform: translate(-50%, -80%) scale(1.35); opacity: 1; }
          100% { transform: translate(-50%, -160%) scale(1.8); opacity: 0; }
        }
      `}</style>

      {/* Floating hearts on double tap */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="pointer-events-none absolute z-40 text-[#ff9ebb]"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            animation: 'floatUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
          }}
        >
          <Heart className="h-10 w-10 fill-[#ff9ebb] drop-shadow-[0_0_15px_rgba(255,158,187,0.8)]" />
        </div>
      ))}

      {/* Top Ornamental Divider with Number Badge */}
      <div className="flex items-center justify-center w-full max-w-xs sm:max-w-md gap-3 sm:gap-6 mb-4 sm:mb-8">
        <div className="flex-1 line-gold" />
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 font-serif text-sm sm:text-base tracking-[0.25em] sm:tracking-[0.4em] text-[var(--theme-accent,#ff9ebb)] font-medium drop-shadow-[0_0_10px_var(--theme-accent-glow,rgba(255,158,187,0.6))]">
          <span>{formattedNumber[0]}</span>
          <span>{formattedNumber[1]}</span>
          <span>{formattedNumber[2]}</span>
        </div>
        <div className="flex-1 line-gold" />
      </div>

      {/* Main Quote Statement (Optimized for Mobile Viewports) */}
      <div className="relative w-full text-center px-2 sm:px-6">
        <h1
          key={statement.id}
          className="font-serif text-xl sm:text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.35] sm:leading-[1.28] tracking-wide glow-card-text transition-all duration-700 ease-out min-h-[90px] sm:min-h-[140px] flex items-center justify-center flex-wrap"
        >
          {parts.map((part, index) => {
            if (part.isHighlighted) {
              return (
                <span key={index} className="glow-keyword mx-1 sm:mx-1.5">
                  {part.text}
                </span>
              );
            }
            return (
              <span key={index} className="text-[#f1ede2]">
                {part.text}
              </span>
            );
          })}
        </h1>
      </div>

      {/* Special Secret Note Button if #100 */}
      {isFinalReason && (
        <button
          onClick={onOpenLoveLetter}
          className="mt-4 sm:mt-6 flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#e8799a] via-[#ff9ebb] to-[#ffccd8] text-[#2a0410] font-serif font-semibold text-xs sm:text-sm tracking-wider shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all animate-bounce"
        >
          <MailOpen className="h-4 w-4" />
          <span>Open Secret Note 💌</span>
          <Sparkles className="h-4 w-4" />
        </button>
      )}

      {/* Bottom Ornamental Divider */}
      <div className="w-full max-w-xs sm:max-w-md line-gold-subtle mt-4 sm:mt-8" />

      {/* Cute Interactive Actions (Touch-friendly for mobile) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap">
        {/* Favorite Button */}
        <button
          onClick={handleHeartClick}
          className={`group flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-full border text-xs font-serif tracking-wider transition-all duration-300 active:scale-95 ${
            isFavorite
              ? 'bg-[var(--theme-accent,#ff9ebb)]/20 border-[var(--theme-accent,#ff9ebb)]/60 text-[var(--theme-accent,#ff9ebb)] shadow-[0_0_15px_var(--theme-accent-glow,rgba(255,158,187,0.3))]'
              : 'border-white/10 hover:border-[var(--theme-accent,#ff9ebb)]/40 text-neutral-400 hover:text-[var(--theme-accent,#ff9ebb)] bg-[#120810]/60'
          }`}
          title={isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
          aria-label="Favorite toggle"
        >
          <Heart
            className={`h-4 w-4 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:scale-110 ${
              isFavorite
                ? 'fill-[var(--theme-accent,#ff9ebb)] text-[var(--theme-accent,#ff9ebb)]'
                : 'stroke-current'
            }`}
          />
          <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
        </button>

        {/* Surprise Me / Random Quote Button */}
        <button
          onClick={onRandomQuote}
          className="flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-full border border-white/10 hover:border-[var(--theme-accent,#ff9ebb)]/40 text-neutral-300 hover:text-[var(--theme-accent,#ff9ebb)] bg-[#120810]/60 text-xs font-serif tracking-wider transition-all duration-300 active:scale-95"
          title="Pick a random reason 🎲"
          aria-label="Random quote"
        >
          <Dices className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          <span>Surprise Me</span>
        </button>

        {/* Secret Note Pill */}
        <button
          onClick={onOpenLoveLetter}
          className="flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-full border border-white/10 hover:border-[var(--theme-accent,#ff9ebb)]/40 text-neutral-300 hover:text-[var(--theme-accent,#ff9ebb)] bg-[#120810]/60 text-xs font-serif tracking-wider transition-all duration-300 active:scale-95"
          title="Read secret note 💌"
          aria-label="Secret note"
        >
          <MailOpen className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          <span>Secret Note</span>
        </button>
      </div>
    </div>
  );
};
