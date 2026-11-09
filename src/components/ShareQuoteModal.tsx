import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Download } from 'lucide-react';
import { Statement, parseStatement } from '../data/statements';
import { downloadStoryCard } from '../utils/cardGenerator';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface ShareQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  statement: Statement;
  recipientName: string;
}

export const ShareQuoteModal: React.FC<ShareQuoteModalProps> = ({
  isOpen,
  onClose,
  statement,
  recipientName,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const parts = parseStatement(statement.raw);
  const plainText = statement.raw.replace(/\*/g, '');
  const quoteFormatted = `"${plainText}"\n— 100 Things About ${recipientName} (#${String(statement.id).padStart(3, '0')})`;

  const shareableUrl = `${window.location.origin}${window.location.pathname}?quote=${statement.id}${
    recipientName.toUpperCase() !== 'YOU' ? `&name=${encodeURIComponent(recipientName)}` : ''
  }`;

  const handleCopyText = () => {
    sounds.playPop();
    navigator.clipboard.writeText(quoteFormatted);
    setCopiedText(true);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#f7d382', '#ffbe53', '#ffffff'],
    });
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyLink = () => {
    sounds.playPop();
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadImage = async () => {
    sounds.playSparkle();
    setIsDownloading(true);
    await downloadStoryCard(statement, recipientName);
    setIsDownloading(false);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f7d382', '#ff9ebb', '#ffffff'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl overflow-hidden border border-[#f7d382]/30 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-3 text-[#f7d382]">
          <Sparkles className="h-4 w-4" />
          <h2 className="font-serif text-lg tracking-widest uppercase">
            Share Reason #{String(statement.id).padStart(3, '0')}
          </h2>
        </div>

        {/* Quote Card Preview */}
        <div className="relative rounded-2xl border border-[#f7d382]/30 bg-gradient-to-b from-[#140f22] to-[#07050d] p-6 text-center shadow-xl my-4">
          <div className="text-[10px] uppercase font-serif tracking-[0.25em] text-[#f7d382]/70 mb-3">
            100 Things About {recipientName}
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#f7d382]/50" />
            <span className="font-serif text-xs tracking-widest text-[#f7d382]">
              {String(statement.id).padStart(3, '0')}
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#f7d382]/50" />
          </div>

          <p className="font-serif text-lg sm:text-xl leading-relaxed text-[#f4efe4] my-2">
            {parts.map((p, idx) => (
              <span
                key={idx}
                className={
                  p.isHighlighted
                    ? 'font-serif italic font-semibold text-[#f7d382] drop-shadow-[0_0_10px_rgba(247,211,130,0.6)]'
                    : ''
                }
              >
                {p.text}
              </span>
            ))}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Download Aesthetic Story Image button */}
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#d99f36] via-[#f7d382] to-[#ffe299] text-black font-semibold font-serif tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            <Download className="h-4 w-4 text-black" />
            <span>{isDownloading ? 'Generating Card...' : 'Save As Story Image (PNG)'}</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleCopyText}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-[#f7d382]/30 hover:bg-[#f7d382]/10 text-[#f7d382] font-serif text-xs tracking-wider transition-all"
            >
              {copiedText ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">Quote Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#f7d382]/30 hover:bg-[#f7d382]/10 text-[#f7d382] font-serif text-xs tracking-wider transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
