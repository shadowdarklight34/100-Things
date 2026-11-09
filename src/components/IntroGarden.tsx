import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface IntroGardenProps {
  isOpen: boolean;
  onEnter: () => void;
  recipientName?: string;
}

export const IntroGarden: React.FC<IntroGardenProps> = ({
  isOpen,
  onEnter,
  recipientName = 'YOU',
}) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Listen for postMessage from the embedded garden page
    const handleMessage = (e: MessageEvent) => {
      if (e.data && (e.data.type === 'ENTER_100_THINGS' || e.data.type === 'ENTER_APP')) {
        handleEnter();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleEnter = () => {
    sounds.playSparkle();
    setIsFading(true);
    setTimeout(() => {
      onEnter();
      setIsFading(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-black transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Floating Glass Bar */}
      <div className="absolute top-3 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
        {/* Left: Romantic Garden Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-pink-500/30 backdrop-blur-md text-pink-200 text-xs shadow-lg">
          <span className="text-sm">🌸</span>
          <span className="font-serif tracking-wide hidden xs:inline">
            A Garden Grown For {recipientName}
          </span>
          <span className="font-serif tracking-wide xs:hidden">For {recipientName}</span>
        </div>

        {/* Center / Right: Enter 100 Things Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleEnter}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 text-slate-950 font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,105,180,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 group-hover:rotate-45 transition-transform" />
            <span>Enter 100 Things</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={handleEnter}
            className="pointer-events-auto p-2 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
            title="Close / Skip to 100 Things"
            aria-label="Skip to 100 Things"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embedded Type Garden Canvas Application */}
      <iframe
        src="./garden.html"
        title="Type Garden Intro"
        className="w-full h-full border-none flex-1 bg-black"
        allow="autoplay"
      />
    </div>
  );
};
