import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Disc3 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AudioPlayerProps {
  theme?: string;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(146.6); // 2m 26s

  useEffect(() => {
    let audio: HTMLAudioElement;
    try {
      const baseUrl = import.meta.env?.BASE_URL || './';
      // Load soft volume audio with cache-busting query parameter
      const audioUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}dilruba_full.m4a?v=soft_v3`;
      audio = new Audio(audioUrl);
      audio.loop = true;
      audio.preload = 'auto';
      // Lower volume for gentle background listening
      audio.volume = 0.35;
      audioRef.current = audio;
    } catch {
      return;
    }

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    const handleError = () => {
      console.warn('Audio could not be loaded or played');
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Attempt autoplay if permitted
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      })
      .catch(() => {
        setIsPlaying(false);
      });

    // Start audio on first user touch/click
    const handleFirstGesture = () => {
      if (!hasInteracted && audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playPop();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(() => {});
    }
  }, [isPlaying]);

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    sounds.playPop();
    if (!audioRef.current) return;
    const newMuteState = !isMuted;
    audioRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  }, [isMuted]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 rounded-full border border-[var(--theme-accent,#ff9ebb)]/45 bg-[#140812]/90 px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(255,158,187,0.2)] transition-all hover:border-[var(--theme-accent,#ff9ebb)]/70 shrink-0">
      {/* Vinyl + Equalizer + Title/Timer */}
      <button
        onClick={togglePlay}
        className="flex items-center gap-1.5 sm:gap-2 text-xs font-serif tracking-widest text-[var(--theme-accent,#ff9ebb)] hover:brightness-125 transition-all focus:outline-none active:scale-95"
        title={isPlaying ? `Pause soundtrack (${formatTime(currentTime)} / ${formatTime(duration)})` : 'Play soundtrack'}
        aria-label="Soundtrack toggle"
      >
        {/* Spinning Cute Vinyl Record */}
        <div className="relative flex items-center justify-center shrink-0">
          <Disc3
            className={`h-4 w-4 sm:h-5 sm:w-5 text-[var(--theme-accent,#ff9ebb)] transition-transform ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'opacity-70'
            }`}
          />
          <span className="absolute h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[var(--theme-accent,#ff9ebb)]" />
        </div>

        {/* Dancing sound equalizer */}
        <div className="flex items-end gap-0.5 h-3 sm:h-3.5 w-2.5 sm:w-3 shrink-0">
          <span
            className={`w-0.5 bg-[var(--theme-accent,#ff9ebb)] rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite] h-3 sm:h-3.5' : 'h-1'
            }`}
          />
          <span
            className={`w-0.5 bg-[var(--theme-accent,#ff9ebb)] rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_1.2s_ease-in-out_infinite] h-2 sm:h-2.5' : 'h-1.5'
            }`}
          />
          <span
            className={`w-0.5 bg-[var(--theme-accent,#ff9ebb)] rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_0.6s_ease-in-out_infinite] h-2.5 sm:h-3' : 'h-1'
            }`}
          />
        </div>

        {/* Label & Timer: Visually crystal-clear on BOTH Mobile & Desktop */}
        <div className="flex flex-col text-left">
          <span className="text-[11px] sm:text-xs uppercase font-serif tracking-wider text-[var(--theme-accent,#ff9ebb)] font-medium leading-none whitespace-nowrap">
            {isPlaying ? 'Dilruba 🎵' : 'Music Off'}
          </span>
          {isPlaying && (
            <span className="text-[9px] sm:text-[10px] tracking-wider text-neutral-300 font-mono mt-0.5 leading-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>
      </button>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="p-1 rounded-full text-[var(--theme-accent,#ff9ebb)]/80 hover:text-[var(--theme-accent,#ff9ebb)] hover:bg-white/10 transition-colors focus:outline-none active:scale-90 shrink-0"
        title={isMuted ? 'Unmute' : 'Mute'}
        aria-label="Mute toggle"
      >
        {isMuted ? (
          <VolumeX className="h-3.5 w-3.5 text-rose-400" />
        ) : (
          <Volume2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
};
