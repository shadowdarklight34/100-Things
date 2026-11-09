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
      // Use explicit version query parameter to prevent browser caching of old trimmed clips
      const audioUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}dilruba_full.m4a?v=full_22s_to_end`;
      audio = new Audio(audioUrl);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.65;
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
    <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[var(--theme-accent,#ff9ebb)]/30 bg-[#0e060d]/85 px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md shadow-lg transition-all hover:border-[var(--theme-accent,#ff9ebb)]/60 group">
      {/* Spinning Cute Vinyl Record */}
      <button
        onClick={togglePlay}
        className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-serif tracking-widest text-[var(--theme-accent,#ff9ebb)] hover:brightness-125 transition-all focus:outline-none active:scale-95"
        title={isPlaying ? `Pause soundtrack (${formatTime(currentTime)} / ${formatTime(duration)})` : 'Play soundtrack'}
        aria-label="Soundtrack toggle"
      >
        <div className="relative flex items-center justify-center">
          <Disc3
            className={`h-4 w-4 sm:h-5 sm:w-5 text-[var(--theme-accent,#ff9ebb)] transition-transform ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'opacity-70'
            }`}
          />
          {/* Center record spindle */}
          <span className="absolute h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[var(--theme-accent,#ff9ebb)]" />
        </div>

        {/* Dancing cute sound equalizer */}
        <div className="flex items-end gap-0.5 h-3 sm:h-3.5 w-3 sm:w-3.5">
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

        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline text-[11px] uppercase font-serif tracking-widest opacity-90">
            {isPlaying ? 'Dilruba Dilnasheen 🎵' : 'Music Off'}
          </span>
          {isPlaying && (
            <span className="text-[10px] tracking-wider opacity-60 font-mono">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          )}
        </div>
      </button>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="p-1 rounded-full text-[var(--theme-accent,#ff9ebb)]/70 hover:text-[var(--theme-accent,#ff9ebb)] hover:bg-white/5 transition-colors focus:outline-none active:scale-90"
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
