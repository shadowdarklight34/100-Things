import React from 'react';
import { X, Sparkles, Heart, MailOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  isOpen,
  onClose,
  recipientName,
}) => {
  if (!isOpen) return null;

  const handleCelebrate = () => {
    sounds.playSparkle();
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#ff9ebb', '#ffb6c1', '#f7d382', '#ffffff'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-9 border border-[#ff9ebb]/40 bg-gradient-to-b from-[#1e0d17] via-[#12060e] to-[#070205] shadow-2xl shadow-rose-950/40 text-center overflow-hidden">
        {/* Soft sakura glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-[#ff9ebb]/20 to-[#f7d382]/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cute Secret Note Icon */}
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#ff9ebb]/15 border border-[#ff9ebb]/30 mb-4 shadow-[0_0_20px_rgba(255,158,187,0.3)]">
          <MailOpen className="h-7 w-7 text-[#ff9ebb]" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-[#ff9ebb]" />
          <span className="font-serif text-xs uppercase tracking-[0.3em] text-[#ff9ebb]/85">
            A Secret Note For You
          </span>
          <Sparkles className="h-4 w-4 text-[#ff9ebb]" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#fff5f8] font-medium tracking-wide mb-5">
          To {recipientName},
        </h2>

        {/* Sweet crush appreciation letter body */}
        <div className="space-y-3.5 font-serif text-base sm:text-lg leading-relaxed text-[#f3e7ed] px-2 sm:px-4 text-center italic">
          <p>
            &ldquo;You probably don&apos;t even realize how effortlessly you light up a room just by walking into it.&rdquo;
          </p>
          <p>
            These hundred little things aren&apos;t just words—they are quiet moments, gentle kindnesses, and rare qualities I couldn&apos;t help noticing and admiring about you.
          </p>
          <p className="text-[#ff9ebb] font-semibold not-italic text-sm sm:text-base pt-2">
            The world is softer, brighter, and infinitely more special with you in it. 🌸✨
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#ff9ebb]/50" />
          <Heart className="h-4 w-4 fill-[#ff9ebb] text-[#ff9ebb]" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#ff9ebb]/50" />
        </div>

        {/* Celebrate button */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={handleCelebrate}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#e8799a] via-[#ff9ebb] to-[#ffccd8] text-[#2a0410] font-serif font-semibold text-xs sm:text-sm tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Send a Smile 🌸</span>
          </button>
        </div>
      </div>
    </div>
  );
};
