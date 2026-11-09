import React, { useState, useMemo } from 'react';
import { X, Search, Heart, Sparkles } from 'lucide-react';
import { STATEMENTS, parseStatement } from '../data/statements';
import { sounds } from '../utils/soundEffects';

interface AllStatementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onSelect: (index: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  recipientName: string;
}

export const AllStatementsModal: React.FC<AllStatementsModalProps> = ({
  isOpen,
  onClose,
  currentIndex,
  onSelect,
  favorites,
  onToggleFavorite,
  recipientName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filtered = useMemo(() => {
    return STATEMENTS.filter((s) => {
      const matchesSearch = s.raw.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFav = onlyFavorites ? favorites.includes(s.id) : true;
      return matchesSearch && matchesFav;
    });
  }, [searchTerm, onlyFavorites, favorites]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] glass-panel rounded-3xl overflow-hidden border border-[var(--theme-accent,#ff9ebb)]/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--theme-accent,#ff9ebb)]/15 bg-[#0a0409]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--theme-accent,#ff9ebb)]" />
            <h2 className="font-serif text-base sm:text-xl tracking-wider text-[var(--theme-accent,#ff9ebb)]">
              100 Things About {recipientName}
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-4 sm:px-5 py-3 border-b border-[var(--theme-accent,#ff9ebb)]/10 bg-[#120710]/90">
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search words (e.g. calm, smile, gentle)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1b0a17] border border-[var(--theme-accent,#ff9ebb)]/20 rounded-full pl-9 pr-4 py-1.5 text-xs sm:text-sm text-[#f1ede2] placeholder-neutral-500 focus:outline-none focus:border-[var(--theme-accent,#ff9ebb)]/60"
            />
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              setOnlyFavorites(!onlyFavorites);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif tracking-wider transition-all border active:scale-95 ${
              onlyFavorites
                ? 'bg-[var(--theme-accent,#ff9ebb)]/20 text-[var(--theme-accent,#ff9ebb)] border-[var(--theme-accent,#ff9ebb)]/60'
                : 'bg-transparent text-neutral-400 border-white/10 hover:border-[var(--theme-accent,#ff9ebb)]/30'
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                onlyFavorites ? 'fill-[var(--theme-accent,#ff9ebb)] text-[var(--theme-accent,#ff9ebb)]' : ''
              }`}
            />
            <span>Favorites ({favorites.length})</span>
          </button>
        </div>

        {/* Statements List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 font-serif text-sm">
              No matching statements found.
            </div>
          ) : (
            filtered.map((item) => {
              const parts = parseStatement(item.raw);
              const isCurrent = currentIndex + 1 === item.id;
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id - 1);
                    onClose();
                  }}
                  className={`group flex items-start gap-3 p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.99] ${
                    isCurrent
                      ? 'bg-[var(--theme-accent,#ff9ebb)]/15 border border-[var(--theme-accent,#ff9ebb)]/40 shadow-inner'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {/* Number Badge */}
                  <span className="font-serif text-xs tracking-widest text-[var(--theme-accent,#ff9ebb)]/70 group-hover:text-[var(--theme-accent,#ff9ebb)] pt-0.5 min-w-[2.2rem]">
                    {String(item.id).padStart(3, '0')}
                  </span>

                  {/* Statement content */}
                  <p className="flex-1 font-serif text-sm sm:text-base leading-relaxed text-[#eae5d8] group-hover:text-white">
                    {parts.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className={
                          p.isHighlighted
                            ? 'font-serif italic font-semibold text-[var(--theme-accent,#ff9ebb)] drop-shadow-[0_0_8px_var(--theme-accent-glow,rgba(255,158,187,0.5))]'
                            : ''
                        }
                      >
                        {p.text}
                      </span>
                    ))}
                  </p>

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playPop();
                      onToggleFavorite(item.id);
                    }}
                    className="p-1 text-neutral-500 hover:text-[var(--theme-accent,#ff9ebb)] transition-colors"
                    title={isFav ? 'Remove favorite' : 'Add to favorites'}
                    aria-label="Favorite toggle"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFav
                          ? 'fill-[var(--theme-accent,#ff9ebb)] text-[var(--theme-accent,#ff9ebb)]'
                          : 'stroke-current'
                      }`}
                    />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-[var(--theme-accent,#ff9ebb)]/15 bg-[#0a0409] text-center text-xs font-serif text-[var(--theme-accent,#ff9ebb)]/70 tracking-wider">
          Tap any reason to experience it in full cinema mode ✨
        </div>
      </div>
    </div>
  );
};
