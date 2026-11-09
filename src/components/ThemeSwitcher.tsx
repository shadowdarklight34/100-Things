import React from 'react';
import { sounds } from '../utils/soundEffects';

export type ThemeType = 'midnight' | 'sakura' | 'lavender' | 'aurora';

interface ThemeSwitcherProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const themes: { id: ThemeType; label: string; icon: string; color: string }[] = [
    { id: 'midnight', label: 'Gold', icon: '✨', color: '#f7d382' },
    { id: 'sakura', label: 'Sakura', icon: '🌸', color: '#ff9ebb' },
    { id: 'lavender', label: 'Lavender', icon: '💜', color: '#d8b4fe' },
    { id: 'aurora', label: 'Aurora', icon: '🌌', color: '#5eead4' },
  ];

  const handleSelect = (theme: ThemeType) => {
    sounds.playPop();
    onThemeChange(theme);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-[#090612]/80 backdrop-blur-md shadow-md">
      {themes.map((t) => {
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-serif transition-all duration-300 ${
              isActive
                ? 'bg-white/15 text-white font-medium shadow-inner'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            style={{
              borderColor: isActive ? t.color : 'transparent',
            }}
            title={`${t.label} Theme`}
            aria-label={`${t.label} Theme`}
          >
            <span className="text-xs">{t.icon}</span>
            <span className="hidden lg:inline text-[10px] tracking-wider uppercase">
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

