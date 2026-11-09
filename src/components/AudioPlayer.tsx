import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Disc3, Music2, Upload, Link2, Check } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AudioPlayerProps {
  theme?: string;
}

interface TrackOption {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

const PRESET_TRACKS: TrackOption[] = [
  {
    id: 'sakura-default',
    name: '🌸 Sakura Dream (Default)',
    url: './music.mp3',
  },
  {
    id: 'starlight-lofi',
    name: '✨ Starlight Romantic Lofi',
    url: 'https://assets.mixkit.co/music/preview/mixkit-gentle-sleep-soft-lo-fi-113.mp3',
  },
  {
    id: 'midnight-piano',
    name: '🌙 Midnight Sweet Piano',
    url: 'https://assets.mixkit.co/music/preview/mixkit-sweet-love-123.mp3',
  },
];

export const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<TrackOption>(() => {
    try {
      const saved = localStorage.getItem('100_things_audio_track');
      if (saved) return JSON.parse(saved);
    } catch {}
    return PRESET_TRACKS[0];
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');

  // Setup / change audio track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    const audio = new Audio(currentTrack.url);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.65;
    audioRef.current = audio;

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', handleEnded);

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
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      audio.pause();
      audioRef.current = null;
    };
  }, [currentTrack]);

  const selectTrack = (track: TrackOption) => {
    sounds.playChime();
    setCurrentTrack(track);
    try {
      if (!track.isCustom || !track.url.startsWith('blob:')) {
        localStorage.setItem('100_things_audio_track', JSON.stringify(track));
      }
    } catch {}
    setIsPickerOpen(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 150);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    const newTrack: TrackOption = {
      id: 'custom-file',
      name: `🎵 ${file.name.slice(0, 20)}...`,
      url: blobUrl,
      isCustom: true,
    };
    selectTrack(newTrack);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    const newTrack: TrackOption = {
      id: 'custom-url',
      name: '🔗 Custom Track',
      url: customUrlInput.trim(),
      isCustom: true,
    };
    selectTrack(newTrack);
    setCustomUrlInput('');
  };

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
    <div className="relative flex items-center">
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[var(--theme-accent,#ff9ebb)]/30 bg-[#0e060d]/85 px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md shadow-lg transition-all hover:border-[var(--theme-accent,#ff9ebb)]/60 group">
        {/* Spinning Cute Vinyl Record */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-serif tracking-widest text-[var(--theme-accent,#ff9ebb)] hover:brightness-125 transition-all focus:outline-none active:scale-95"
          title={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
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

          <span className="hidden md:inline text-[11px] uppercase font-serif tracking-widest opacity-90 max-w-[100px] truncate">
            {isPlaying ? 'Playing' : 'Music Off'}
          </span>
        </button>

        {/* Change Song Button */}
        <button
          onClick={() => {
            sounds.playPop();
            setIsPickerOpen((prev) => !prev);
          }}
          className="p-1 rounded-full text-[var(--theme-accent,#ff9ebb)]/80 hover:text-[var(--theme-accent,#ff9ebb)] hover:bg-white/10 transition-colors focus:outline-none"
          title="Change song / soundtrack"
          aria-label="Change song"
        >
          <Music2 className="h-3.5 w-3.5" />
        </button>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="p-1 rounded-full text-[var(--theme-accent,#ff9ebb)]/70 hover:text-[var(--theme-accent,#ff9ebb)] hover:bg-white/5 transition-colors focus:outline-none active:scale-90"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Song Picker Popover Modal */}
      {isPickerOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsPickerOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-[#120a16]/95 border border-[var(--theme-accent,#ff9ebb)]/40 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <span className="text-xs uppercase font-serif tracking-wider text-[var(--theme-accent,#ff9ebb)] flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5" />
                Select Soundtrack
              </span>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="text-white/50 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Presets list */}
            <div className="space-y-1.5 mb-3">
              {PRESET_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTrack(t)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    currentTrack.id === t.id
                      ? 'bg-[var(--theme-accent,#ff9ebb)]/20 text-[var(--theme-accent,#ff9ebb)] font-medium border border-[var(--theme-accent,#ff9ebb)]/40'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate">{t.name}</span>
                  {currentTrack.id === t.id && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              ))}
            </div>

            {/* Upload or Custom URL */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/90 text-xs transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Song from Device</span>
              </button>

              <div className="flex items-center gap-1 pt-1">
                <input
                  type="text"
                  placeholder="Paste direct audio URL..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[var(--theme-accent,#ff9ebb)]"
                />
                <button
                  onClick={handleApplyCustomUrl}
                  className="p-1.5 rounded-lg bg-[var(--theme-accent,#ff9ebb)] text-black font-semibold hover:brightness-110 active:scale-95"
                  title="Apply URL"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
