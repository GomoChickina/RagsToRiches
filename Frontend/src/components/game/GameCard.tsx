import React, { useEffect, useState } from 'react';
import { Choice } from '@/types/game';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { parseCash, parseSymbol } from '@/utils/gameLogic';
import { Sparkles } from 'lucide-react';

interface GameCardProps {
  choice: Choice;
  onClick?: (choice: Choice) => void;
  disabled?: boolean;
  index?: number;
}

type CardCategory = 'income' | 'expense' | 'savings' | 'investment';

const categoryConfig: Record<
  CardCategory,
  {
    border: string;
    glow: string;
    bg: string;
    badge: string;
    label: string;
    glowOverlay: string;
  }
> = {
  investment: {
    border: 'border-amber-400',
    glow: 'shadow-[0_0_36px_rgba(251,191,36,0.5)]',
    bg: 'bg-[linear-gradient(155deg,#1c1100_0%,#3b2000_55%,#150d00_100%)]',
    badge: 'bg-amber-400/15 border-amber-400/50 text-amber-200',
    label: 'Investment',
    glowOverlay: 'bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,191,36,0.18),transparent_60%)]',
  },
  savings: {
    border: 'border-cyan-400',
    glow: 'shadow-[0_0_36px_rgba(34,211,238,0.5)]',
    bg: 'bg-[linear-gradient(155deg,#001d22_0%,#003d47_55%,#001218_100%)]',
    badge: 'bg-cyan-400/15 border-cyan-400/50 text-cyan-200',
    label: 'Savings',
    glowOverlay: 'bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,0.15),transparent_60%)]',
  },
  income: {
    border: 'border-lime-400',
    glow: 'shadow-[0_0_36px_rgba(163,230,53,0.5)]',
    bg: 'bg-[linear-gradient(155deg,#0d1f00_0%,#1e4200_55%,#091500_100%)]',
    badge: 'bg-lime-400/15 border-lime-400/50 text-lime-200',
    label: 'Income',
    glowOverlay: 'bg-[radial-gradient(ellipse_at_50%_0%,rgba(163,230,53,0.14),transparent_60%)]',
  },
  expense: {
    border: 'border-orange-400',
    glow: 'shadow-[0_0_36px_rgba(251,146,60,0.5)]',
    bg: 'bg-[linear-gradient(155deg,#1f0700_0%,#4a1500_55%,#160400_100%)]',
    badge: 'bg-orange-400/15 border-orange-400/50 text-orange-200',
    label: 'Expense',
    glowOverlay: 'bg-[radial-gradient(ellipse_at_50%_0%,rgba(251,146,60,0.14),transparent_60%)]',
  },
};

const rarityConfig = {
  common: { label: '', color: '' },
  rare: { label: '★ RARE', color: 'text-amber-400' },
  epic: { label: '✦ EPIC', color: 'text-lime-400' },
  legendary: { label: '✦ LEGENDARY', color: 'text-yellow-300' },
};

export const GameCard = ({ choice, onClick, disabled, index = 0 }: GameCardProps) => {

  const [flipped, setFlipped] = useState(false);

  const analyzeChoice = (c: Choice) => {
    const moneyVal = parseCash(c.effect.money);
    const financeVal = parseSymbol(c.effect.financeKnowledge);

    let category: CardCategory = 'savings';
    let icon = '🛡️';
    let rarity: keyof typeof rarityConfig = 'common';

    if (moneyVal < 0) {
      category = 'expense';
      icon = '💸';
    } else if (moneyVal > 0) {
      category = 'income';
      icon = '💰';
    } else if (financeVal > 0) {
      category = 'investment';
      icon = '🧠';
    }

    const totalImpact = Math.abs(moneyVal) + financeVal * 50;
    if (totalImpact > 1000) rarity = 'legendary';
    else if (totalImpact > 500) rarity = 'epic';
    else if (totalImpact > 200) rarity = 'rare';

    return { category, icon, rarity };
  };

  const { category, icon, rarity } = analyzeChoice(choice);
  const cfg = categoryConfig[category];
  const rarityInfo = rarityConfig[rarity];

  // Run a one-time flip animation shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => setFlipped(true), 400 + index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  // Gold coin SVG used in the card front medallion
  const CoinSVG = () => (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
      <circle cx="16" cy="16" r="10" fill="#071610" stroke="#ca8a04" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="7" fill="none" stroke="#78350f" strokeWidth="0.75" strokeDasharray="2 2" />
      <text
        x="16" y="21"
        textAnchor="middle"
        fontSize="14"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fill="#fbbf24"
      >
        $
      </text>
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
      className={cn(
        'h-[340px] w-full cursor-pointer',
        '[perspective:1000px]',
        disabled && 'opacity-40 pointer-events-none grayscale'
      )}
      onClick={() => !disabled && onClick?.(choice)}
    >
      {/* Flip wrapper */}
      <div
        className={cn(
          'relative h-full w-full rounded-2xl transition-transform duration-700',
          '[transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]',
          cfg.glow
        )}
      >

        {/* ═══════════════════════════════════════════
            FRONT — Playing Card Back Pattern
            Deep forest green + gold lattice & coin
        ═══════════════════════════════════════════ */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl overflow-hidden',
            '[backface-visibility:hidden]',
            'bg-[#0c2016] border-2 border-amber-600'
          )}
        >
          {/* Decorative inner border rings */}
          <div className="absolute inset-[6px] rounded-xl border border-amber-400/30 pointer-events-none z-10" />
          <div className="absolute inset-[10px] rounded-xl border border-amber-400/12 pointer-events-none z-10" />

          {/* Gold diamond lattice */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 1px, transparent 1px, transparent 14px),
                repeating-linear-gradient(-45deg, #fbbf24 0, #fbbf24 1px, transparent 1px, transparent 14px)
              `,
            }}
          />

          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.03)_0%,rgba(0,0,0,0.55)_100%)]" />

          {/* Corner ornaments */}
          {(['top-[10px] left-[10px]', 'top-[10px] right-[10px] rotate-90', 'bottom-[10px] left-[10px] -rotate-90', 'bottom-[10px] right-[10px] rotate-180'] as const).map(
            (pos, i) => (
              <div key={i} className={`absolute ${pos} w-[18px] h-[18px] z-10`}>
                <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
                  <path d="M3 3 L3 9 M3 3 L9 3" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="3" cy="3" r="1.5" fill="#ca8a04" />
                </svg>
              </div>
            )
          )}

          {/* Center medallion */}
          <div className="absolute inset-0 flex items-center justify-center z-[2]">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-[88px] h-[88px] rounded-full border border-amber-400/28" />
              <div className="absolute w-[72px] h-[72px] rounded-full border border-amber-400/12" />
              <div className="w-14 h-14 rounded-full bg-[#071610] border-[1.5px] border-amber-600 flex items-center justify-center shadow-[0_0_18px_rgba(251,191,36,0.25),inset_0_2px_8px_rgba(0,0,0,0.6)]">
                <CoinSVG />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BACK — Card Content (revealed on hover)
        ═══════════════════════════════════════════ */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl border-2 overflow-hidden flex flex-col',
            '[backface-visibility:hidden]',
            '[transform:rotateY(180deg)]',
            cfg.border,
            cfg.bg
          )}
        >
          {/* Radial glow overlay at top */}
          <div className={cn('absolute inset-0', cfg.glowOverlay)} />

          {/* Top shine line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative z-10 flex flex-col h-full p-4">

            {/* Header */}
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border backdrop-blur-sm',
                  cfg.badge
                )}
              >
                {cfg.label}
              </span>
              {rarity !== 'common' && (
                <div className="flex items-center gap-1">
                  <span className={cn('text-[8px] font-bold uppercase tracking-wider animate-pulse', rarityInfo.color)}>
                    {rarityInfo.label}
                  </span>
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[56px] leading-none filter drop-shadow-2xl">{icon}</span>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/15 text-center">
              <p className="text-white/90 font-semibold text-xs leading-snug tracking-wide">
                {choice.text}
              </p>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
};