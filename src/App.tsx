import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Grid,
  Edit3,
  Share2,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';
import { STATEMENTS } from './data/statements';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { AmbientQuotesBackground } from './components/AmbientQuotesBackground';
import { StatementCard } from './components/StatementCard';
import { AudioPlayer } from './components/AudioPlayer';
import { AllStatementsModal } from './components/AllStatementsModal';
import { PersonalizeModal } from './components/PersonalizeModal';
import { ShareQuoteModal } from './components/ShareQuoteModal';
import { LoveLetterModal } from './components/LoveLetterModal';
import { LuckyStarsJarModal } from './components/LuckyStarsJarModal';
import { MagicCursorTrail } from './components/MagicCursorTrail';
import { CuteReactionsDock } from './components/CuteReactionsDock';
import { ThemeSwitcher, ThemeType } from './components/ThemeSwitcher';
import { sounds } from './utils/soundEffects';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  // Read query params from URL - Default theme is Sakura! 🌸
  const queryParams = new URLSearchParams(window.location.search);
  const initialName = queryParams.get('name') || 'HIGHNESS';
  const initialTheme = (queryParams.get('theme') as ThemeType) || 'sakura';
  const initialQuoteParam = parseInt(queryParams.get('quote') || '1', 10);
  const initialIndex =
    !isNaN(initialQuoteParam) && initialQuoteParam >= 1 && initialQuoteParam <= 100
      ? initialQuoteParam - 1
      : 0;

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [recipientName, setRecipientName] = useState<string>(initialName.toUpperCase());
  const [theme, setTheme] = useState<ThemeType>(initialTheme);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [slideshowSpeed, setSlideshowSpeed] = useState<number>(3600); // 3.6s per statement
  const [starRainCount, setStarRainCount] = useState<number>(0);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('100_things_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLoveLetterOpen, setIsLoveLetterOpen] = useState(false);
  const [isJarOpen, setIsJarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Swipe & Touch handling for mobile devices
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('100_things_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleNext = useCallback(() => {
    sounds.playChime();
    setCurrentIndex((prev) => (prev + 1) % STATEMENTS.length);
  }, []);

  const handlePrev = useCallback(() => {
    sounds.playChime();
    setCurrentIndex((prev) => (prev - 1 + STATEMENTS.length) % STATEMENTS.length);
  }, []);

  const handleTriggerStarRain = useCallback(() => {
    sounds.playSparkle();
    setStarRainCount((prev) => prev + 1);
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.3 },
      colors: ['#ff9ebb', '#ffb6c1', '#f7d382', '#ffffff'],
    });
  }, []);

  const handleRandomQuote = useCallback(() => {
    sounds.playSparkle();
    const randomIndex = Math.floor(Math.random() * STATEMENTS.length);
    setCurrentIndex(randomIndex);
    setStarRainCount((prev) => prev + 1);
    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff9ebb', '#ffb6c1', '#f7d382', '#ffffff'],
    });
  }, []);

  // Auto slideshow timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, slideshowSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, slideshowSpeed, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAllModalOpen || isPersonalizeOpen || isShareOpen || isLoveLetterOpen || isJarOpen) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFavorite(STATEMENTS[currentIndex].id);
      } else if (e.key === 'r' || e.key === 'R') {
        handleRandomQuote();
      } else if (e.key === 's' || e.key === 'S') {
        handleTriggerStarRain();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNext,
    handlePrev,
    currentIndex,
    toggleFavorite,
    handleRandomQuote,
    handleTriggerStarRain,
    isAllModalOpen,
    isPersonalizeOpen,
    isShareOpen,
    isLoveLetterOpen,
    isJarOpen,
  ]);

  // Mobile Touch Swipe Listeners
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Swipe left (next) or right (previous)
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCelebrateCompletion = () => {
    sounds.playSparkle();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff9ebb', '#ffb6c1', '#f7d382', '#ffffff'],
    });
  };

  const currentStatement = STATEMENTS[currentIndex];
  const progressPercent = ((currentIndex + 1) / STATEMENTS.length) * 100;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`theme-${theme} relative flex flex-col h-[100dvh] w-full overflow-hidden select-none text-[#f2eee3]`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Magic Fairy Dust & Heart Trail */}
      <MagicCursorTrail theme={theme} />

      {/* Dynamic Star Rain & Meteor Shower Canvas */}
      <StarfieldCanvas theme={theme} triggerShower={starRainCount} />

      {/* Atmospheric Radial Gradient & Vignette */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-radial-atmosphere transition-colors duration-1000" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-vignette" />

      {/* Ambient Floating Text Stream */}
      <AmbientQuotesBackground currentIndex={currentIndex} />

      {/* Top Header - Mobile & Desktop */}
      <header className="relative z-30 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-8 pt-2.5 sm:pt-5 pb-1 gap-2">
        {/* Top Controls Row on Mobile */}
        <div className="w-full flex items-center justify-between sm:w-auto gap-2">
          {/* Audio Player */}
          <AudioPlayer theme={theme} />

          {/* Theme Switcher */}
          <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />

          {/* Mobile Right Tools */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playPop();
                setIsJarOpen(true);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-full border border-[var(--theme-accent,#ff9ebb)]/40 bg-[var(--theme-accent,#ff9ebb)]/20 text-[var(--theme-accent,#ff9ebb)] active:scale-90 shadow-sm"
              title="Lucky Stars Jar 🌟"
              aria-label="Lucky Stars Jar"
            >
              <span className="text-xs">⭐</span>
              <span className="font-serif text-[11px] font-medium tracking-wide">Jar</span>
            </button>
            <button
              onClick={() => setIsAllModalOpen(true)}
              className="p-1.5 rounded-full border border-white/10 bg-[#0e060d]/80 text-[var(--theme-accent,#ff9ebb)] active:scale-95"
              title="Browse 100"
              aria-label="Browse all"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-1.5 rounded-full border border-white/10 bg-[#0e060d]/80 text-[var(--theme-accent,#ff9ebb)] active:scale-95"
              title="Share"
              aria-label="Share quote"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Center Title (Personalizable, Clickable) */}
        <div className="text-center pointer-events-auto py-0.5 sm:py-0">
          <button
            onClick={() => setIsPersonalizeOpen(true)}
            className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-transform duration-300 active:scale-95 hover:scale-105"
            title="Click to personalize recipient name"
          >
            <h1 className="font-serif text-base sm:text-2xl md:text-3xl tracking-[0.2em] sm:tracking-[0.35em] uppercase glow-gold-title font-medium flex items-center gap-1.5">
              <span>100 THINGS ABOUT {recipientName}</span>
              <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 opacity-70 group-hover:opacity-100 transition-opacity text-[var(--theme-accent,#ff9ebb)]" />
            </h1>
          </button>

          {/* Dedicated Mobile Jar Pill right under title */}
          <div className="flex sm:hidden items-center justify-center gap-2 mt-1">
            <button
              onClick={() => {
                sounds.playPop();
                setIsJarOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[var(--theme-accent,#ff9ebb)]/40 bg-[var(--theme-accent,#ff9ebb)]/15 hover:bg-[var(--theme-accent,#ff9ebb)]/25 text-[var(--theme-accent,#ff9ebb)] font-serif text-[11px] tracking-wider shadow-[0_0_12px_rgba(255,158,187,0.3)] active:scale-95"
              title="Open Jar of 100 Lucky Stars"
            >
              <Sparkles className="h-3 w-3 animate-spin-slow" />
              <span>Open Lucky Stars Jar 🌟</span>
            </button>
          </div>
        </div>

        {/* Desktop Right Tools */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Lucky Stars Jar Button */}
          <button
            onClick={() => {
              sounds.playPop();
              setIsJarOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--theme-accent,#ff9ebb)]/30 bg-[#0e060d]/80 hover:bg-[var(--theme-accent,#ff9ebb)]/15 text-[var(--theme-accent,#ff9ebb)] font-serif text-xs tracking-wider transition-all shadow-md backdrop-blur-md active:scale-95"
            title="Open Lucky Stars Jar 🌟"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Lucky Stars Jar 🌟</span>
          </button>

          {/* Star Rain Flow Button */}
          <button
            onClick={handleTriggerStarRain}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--theme-accent,#ff9ebb)]/25 bg-[#0e060d]/80 hover:bg-[var(--theme-accent,#ff9ebb)]/15 text-[var(--theme-accent,#ff9ebb)] font-serif text-xs tracking-wider transition-all shadow-md backdrop-blur-md active:scale-95"
            title="Trigger a shooting star shower 🌠"
          >
            <span>Star Rain 🌠</span>
          </button>

          <button
            onClick={() => setIsAllModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--theme-accent,#ff9ebb)]/25 bg-[#0e060d]/80 hover:bg-[var(--theme-accent,#ff9ebb)]/15 text-[var(--theme-accent,#ff9ebb)] font-serif text-xs tracking-wider transition-all shadow-md backdrop-blur-md"
            title="Browse all 100 reasons"
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Browse 100</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="p-1.5 rounded-full border border-[var(--theme-accent,#ff9ebb)]/25 bg-[#0e060d]/80 hover:bg-[var(--theme-accent,#ff9ebb)]/15 text-[var(--theme-accent,#ff9ebb)] transition-all shadow-md backdrop-blur-md"
            title="Share this reason / Download image"
            aria-label="Share quote"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full border border-[var(--theme-accent,#ff9ebb)]/25 bg-[#0e060d]/80 hover:bg-[var(--theme-accent,#ff9ebb)]/15 text-[var(--theme-accent,#ff9ebb)] transition-all shadow-md backdrop-blur-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Fullscreen toggle"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Display Area */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-2 sm:px-4 overflow-hidden">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-6 z-30 p-2 sm:p-3 rounded-full text-[var(--theme-accent,#ff9ebb)]/60 hover:text-[var(--theme-accent,#ff9ebb)] hover:bg-[var(--theme-accent,#ff9ebb)]/10 transition-all duration-300 active:scale-90"
          title="Previous reason (Left Arrow)"
          aria-label="Previous statement"
        >
          <ChevronLeft className="h-6 w-6 sm:h-9 sm:w-9 drop-shadow-[0_0_10px_var(--theme-accent-glow,rgba(255,158,187,0.5))]" />
        </button>

        {/* Central Statement Card */}
        <StatementCard
          statement={currentStatement}
          isFavorite={favorites.includes(currentStatement.id)}
          onToggleFavorite={toggleFavorite}
          onRandomQuote={handleRandomQuote}
          onOpenLoveLetter={() => setIsLoveLetterOpen(true)}
          theme={theme}
        />

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-6 z-30 p-2 sm:p-3 rounded-full text-[var(--theme-accent,#ff9ebb)]/60 hover:text-[var(--theme-accent,#ff9ebb)] hover:bg-[var(--theme-accent,#ff9ebb)]/10 transition-all duration-300 active:scale-90"
          title="Next reason (Right Arrow or Space)"
          aria-label="Next statement"
        >
          <ChevronRight className="h-6 w-6 sm:h-9 sm:w-9 drop-shadow-[0_0_10px_var(--theme-accent-glow,rgba(255,158,187,0.5))]" />
        </button>

        {/* Cute Subtle Mobile Hint */}
        <div className="sm:hidden absolute bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-serif tracking-widest text-[var(--theme-accent,#ff9ebb)]/65 flex items-center gap-1.5 whitespace-nowrap animate-pulse">
          <span>💫</span>
          <span>Swipe to read • Double-tap for hearts 💕</span>
        </div>
      </main>

      {/* Bottom Progress Section (Matching Video Design + Mobile Friendly) */}
      <footer className="relative z-30 w-full px-3 sm:px-8 pb-3 sm:pb-6 pt-2 bg-gradient-to-t from-[#040307] via-[#040307]/80 to-transparent">
        {/* Progress Bar Container */}
        <div className="w-full max-w-5xl mx-auto mb-2">
          {/* Subtle Track Line */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              const target = Math.min(
                Math.max(Math.floor(ratio * STATEMENTS.length), 0),
                STATEMENTS.length - 1
              );
              sounds.playChime();
              setCurrentIndex(target);
            }}
            className="group relative h-1 sm:h-1.5 w-full bg-[#160c14] rounded-full overflow-hidden cursor-pointer"
          >
            {/* Glowing Theme Fill */}
            <div
              className="h-full bg-gradient-to-r from-[#e8799a] via-[#ff9ebb] to-[#ffccd8] transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(255,158,187,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls & Progress Caption */}
        <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-serif">
          {/* Top Row on Mobile: Progress Label + Play/Speed */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 tracking-[0.15em] sm:tracking-[0.25em] text-[var(--theme-accent,#ff9ebb)] uppercase font-medium text-[11px] sm:text-xs">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[var(--theme-accent,#ff9ebb)]" />
              <span>
                {currentIndex + 1} OF 100 STATEMENTS APPEARED
              </span>
            </div>

            {/* Mobile Play/Pause Controls */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsPlaying(!isPlaying);
                }}
                className="p-1 rounded-full border border-[var(--theme-accent,#ff9ebb)]/30 text-[var(--theme-accent,#ff9ebb)] bg-[#120810]/70 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label="Play pause toggle"
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
              </button>
            </div>
          </div>

          {/* Cute Floating Reactions Dock (Centered on Mobile & Desktop) */}
          <div className="w-full sm:w-auto flex justify-center order-last sm:order-none">
            <CuteReactionsDock />
          </div>

          {/* Desktop Slideshow Controls */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            {/* Speed Selector */}
            <button
              onClick={() => {
                const speeds = [5000, 3600, 2200];
                const nextSpeed =
                  speeds[(speeds.indexOf(slideshowSpeed) + 1) % speeds.length];
                sounds.playPop();
                setSlideshowSpeed(nextSpeed);
              }}
              className="px-2 py-1 rounded-md text-[10px] sm:text-xs tracking-wider border border-white/10 hover:border-[var(--theme-accent,#ff9ebb)]/30 text-neutral-400 hover:text-[var(--theme-accent,#ff9ebb)] transition-colors"
              title="Change slideshow pace"
            >
              {slideshowSpeed === 5000
                ? 'Pace: Calm'
                : slideshowSpeed === 3600
                ? 'Pace: Normal'
                : 'Pace: Fast'}
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--theme-accent,#ff9ebb)]/30 bg-[#0c0915] hover:bg-[var(--theme-accent,#ff9ebb)]/15 text-[var(--theme-accent,#ff9ebb)] tracking-wider transition-all active:scale-95"
              title={isPlaying ? 'Pause auto-play (Space)' : 'Start auto-play (Space)'}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>

            {/* Reset to Start */}
            <button
              onClick={() => {
                setCurrentIndex(0);
                handleCelebrateCompletion();
              }}
              className="p-1 rounded-full text-neutral-500 hover:text-[var(--theme-accent,#ff9ebb)] transition-colors"
              title="Restart from beginning"
              aria-label="Restart"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AllStatementsModal
        isOpen={isAllModalOpen}
        onClose={() => setIsAllModalOpen(false)}
        currentIndex={currentIndex}
        onSelect={(idx) => {
          sounds.playChime();
          setCurrentIndex(idx);
        }}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        recipientName={recipientName}
      />

      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        currentName={recipientName}
        onSaveName={(name) => setRecipientName(name.toUpperCase())}
      />

      <ShareQuoteModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        statement={currentStatement}
        recipientName={recipientName}
      />

      <LoveLetterModal
        isOpen={isLoveLetterOpen}
        onClose={() => setIsLoveLetterOpen(false)}
        recipientName={recipientName}
      />

      {/* Lucky Stars Jar Modal with Star Rain Flow Animation */}
      <LuckyStarsJarModal
        isOpen={isJarOpen}
        onClose={() => setIsJarOpen(false)}
        onSelectStatement={(idx) => {
          sounds.playChime();
          setCurrentIndex(idx);
        }}
        recipientName={recipientName}
        onTriggerStarRain={handleTriggerStarRain}
      />
    </div>
  );
};

export default App;
