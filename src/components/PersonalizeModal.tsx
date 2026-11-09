import React, { useState } from 'react';
import { X, Check, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (name: string) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName,
}) => {
  const [nameInput, setNameInput] = useState(currentName);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSparkle();
    const cleanName = nameInput.trim() || 'YOU';
    onSaveName(cleanName);

    // Update URL query parameter without reloading
    const url = new URL(window.location.href);
    if (cleanName.toUpperCase() !== 'YOU') {
      url.searchParams.set('name', cleanName);
    } else {
      url.searchParams.delete('name');
    }
    window.history.replaceState({}, '', url.toString());

    // Trigger sweet pastel confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff9ebb', '#ffb6c1', '#f7d382', '#ffffff'],
    });

    onClose();
  };

  const shareableUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(
    nameInput.trim() || 'YOU'
  )}`;

  const handleCopyLink = () => {
    sounds.playPop();
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden border border-[#ff9ebb]/30 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#ff9ebb]">
          <Sparkles className="h-5 w-5" />
          <h2 className="font-serif text-xl tracking-wider text-[#ff9ebb]">
            Personalize This Tribute
          </h2>
        </div>

        <p className="font-serif text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
          Type her name below. The entire website title and cards will update to
          <span className="text-[#ff9ebb] font-semibold">
            {' '}
            &ldquo;100 THINGS ABOUT {nameInput.trim() || 'YOU'}&rdquo;
          </span>
          .
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-widest font-serif text-[#ff9ebb]/80 mb-2">
              Her Name
            </label>
            <input
              type="text"
              maxLength={30}
              placeholder="Enter her name..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-[#160a12] border border-[#ff9ebb]/35 focus:border-[#ff9ebb] rounded-2xl px-4 py-3 text-base text-[#f1ede2] placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
              autoFocus
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#e8799a] via-[#ff9ebb] to-[#ffccd8] text-[#2a0410] font-semibold font-serif tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm"
            >
              <Check className="h-4 w-4" />
              <span>Apply Name</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-[#ff9ebb]/30 hover:bg-[#ff9ebb]/10 text-[#ff9ebb] font-serif text-xs tracking-wider transition-all"
              title="Copy link with this name"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Share Link</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
