import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { STATEMENTS, Statement, parseStatement } from '../data/statements';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface LuckyStarsJarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStatement: (index: number) => void;
  recipientName: string;
  onTriggerStarRain?: () => void;
}

export const LuckyStarsJarModal: React.FC<LuckyStarsJarModalProps> = ({
  isOpen,
  onClose,
  onSelectStatement,
  recipientName,
  onTriggerStarRain,
}) => {
  const [openedStar, setOpenedStar] = useState<Statement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fallingMeteors, setFallingMeteors] = useState<
    { id: number; left: number; top: number; delay: number; duration: number }[]
  >([]);

  if (!isOpen) return null;

  const starColors = [
    '#ff9ebb', '#ffb6c1', '#f7d382', '#d8b4fe', '#5eead4', '#ffd1dc', '#fed7aa', '#a7f3d0'
  ];

  const handleUnfoldStar = () => {
    sounds.playSparkle();
    setIsAnimating(true);

    // Trigger canvas star rain in background
    if (onTriggerStarRain) {
      onTriggerStarRain();
    }

    // Generate in-modal star rain animation
    const meteors = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 90 + 5,
      top: -40 - Math.random() * 50,
      delay: Math.random() * 0.35,
      duration: 0.8 + Math.random() * 0.5,
    }));
    setFallingMeteors(meteors);

    setTimeout(() => {
      setIsAnimating(false);
      setFallingMeteors([]);
      const randomIndex = Math.floor(Math.random() * STATEMENTS.length);
      setOpenedStar(STATEMENTS[randomIndex]);

      // Star confetti burst
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#ff9ebb', '#ffb6c1', '#f7d382', '#ffffff'],
      });
    }, 550);
  };

  const formattedWhom =
    recipientName.toUpperCase() === 'YOU' ? 'you are' : `${recipientName} is`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-hidden">
      <style>{`
        @keyframes starRainStreak {
          0% {
            transform: translate3d(0, 0, 0) rotate(45deg) scale(0.3);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate3d(180px, 320px, 0) rotate(45deg) scale(1);
            opacity: 0;
          }
        }
        @keyframes starGlowPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>

      {/* Internal Star Rain Flow within Modal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        {fallingMeteors.map((m) => (
          <div
            key={m.id}
            className="absolute h-0.5 w-24 bg-gradient-to-r from-transparent via-[#ff9ebb] to-white rounded-full shadow-[0_0_12px_#ff9ebb]"
            style={{
              left: `${m.left}%`,
              top: `${m.top}px`,
              animation: `starRainStreak ${m.duration}s ease-out forwards`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col w-full max-w-lg glass-panel rounded-3xl overflow-hidden border border-[#ff9ebb]/30 shadow-2xl p-6 sm:p-8 text-center max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Jar Title */}
        <div className="flex items-center justify-center gap-2 mb-1.5 text-[#ff9ebb]">
          <Sparkles className="h-4 w-4" />
          <h2 className="font-serif text-xl sm:text-2xl tracking-wider text-[#ff9ebb]">
            Jar of 100 Lucky Stars ✨
          </h2>
          <Sparkles className="h-4 w-4" />
        </div>

        <p className="font-serif text-xs sm:text-sm text-neutral-300 mb-5">
          Every folded star inside holds a secret reason why {formattedWhom} so special.
        </p>

        {/* The Glass Lucky Star Jar Display */}
        <div
          className={`relative mx-auto w-56 sm:w-64 h-64 sm:h-72 rounded-b-[45px] rounded-t-[18px] border-2 border-[#ff9ebb]/40 bg-gradient-to-b from-white/10 via-rose-500/5 to-[#ff9ebb]/10 backdrop-blur-md p-4 shadow-[0_0_35px_rgba(255,158,187,0.2)] flex flex-wrap items-center justify-center content-center gap-1.5 overflow-hidden transition-all duration-300 ${
            isAnimating ? 'scale-105 shadow-[0_0_50px_rgba(255,158,187,0.5)]' : ''
          }`}
        >
          {/* Jar Lid & Cute Pink Ribbon Bow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-36 sm:w-40 h-4 rounded-t-lg bg-gradient-to-r from-[#e8799a] via-[#ff9ebb] to-[#ffccd8] border border-[#ff9ebb] shadow-md" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10 text-base filter drop-shadow-[0_0_6px_rgba(255,158,187,0.7)]">
            🎀
          </div>
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-44 sm:w-48 h-1.5 bg-[#ff9ebb]/30 rounded-full" />

          {/* Glowing Folded Lucky Stars Inside */}
          {Array.from({ length: 48 }).map((_, i) => {
            const color = starColors[i % starColors.length];
            return (
              <span
                key={i}
                onClick={handleUnfoldStar}
                className="cursor-pointer select-none text-base sm:text-lg hover:scale-140 active:scale-95 transition-transform duration-200 filter drop-shadow-[0_0_8px_currentColor]"
                style={{
                  color,
                  transform: `rotate(${(i * 37) % 360}deg)`,
                  animation: `starGlowPulse ${2 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.1) % 2}s`,
                }}
                title="Tap to unfold lucky star"
              >
                ★
              </span>
            );
          })}

          {/* Jar Label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-md bg-[#0e040a]/90 border border-[#ff9ebb]/30 text-[10px] uppercase font-serif tracking-[0.25em] text-[#ff9ebb]">
            FOR {recipientName}
          </div>
        </div>

        {/* Unfolded Star Revelation Card */}
        {openedStar ? (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl border border-[#ff9ebb]/40 bg-gradient-to-b from-[#200d1a] to-[#0c0409] shadow-xl animate-fade-in text-center">
            <div className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#ff9ebb]/85 mb-1 flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#ff9ebb]" />
              <span>UNFOLDED STAR #{String(openedStar.id).padStart(3, '0')}</span>
              <Sparkles className="h-3 w-3 text-[#ff9ebb]" />
            </div>

            <p className="font-serif text-base sm:text-lg leading-relaxed text-[#f3ede1] my-2">
              {parseStatement(openedStar.raw).map((p, idx) => (
                <span
                  key={idx}
                  className={
                    p.isHighlighted
                      ? 'font-serif italic font-semibold text-[#ff9ebb] drop-shadow-[0_0_8px_rgba(255,158,187,0.6)]'
                      : ''
                  }
                >
                  {p.text}
                </span>
              ))}
            </p>

            <button
              onClick={() => {
                onSelectStatement(openedStar.id - 1);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-serif text-[#ff9ebb] hover:brightness-125 transition-all"
            >
              <span>View in Fullscreen Cinema Mode</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}

        {/* Action Button: Unfold a Lucky Star with Star Rain Flow */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={handleUnfoldStar}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[#e8799a] via-[#ff9ebb] to-[#ffccd8] text-[#2a0410] font-serif font-semibold text-xs sm:text-sm tracking-wider shadow-lg shadow-rose-950/40 hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isAnimating ? 'Shooting Stars Flowing...' : 'Unfold a Lucky Star ✨'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

