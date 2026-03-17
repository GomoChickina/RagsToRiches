import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  Play, Coins, Trophy, TrendingUp, PiggyBank, Wallet, Target, ShoppingBag,
  Calculator, CreditCard, Landmark, PieChart, DollarSign, Percent, ArrowUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlayerCharacter } from '@/types/game';
import { PlayerCharacterComponent } from './PlayerCharacter';

interface HeroSectionProps {
  onNavigate: (page: 'play' | 'learn' | 'shop' | 'leaderboard') => void;
  playerCharacter: PlayerCharacter;
}

export const HeroSection = ({ onNavigate, playerCharacter }: HeroSectionProps) => {
  if (!playerCharacter) return null;
  const score = Math.round(playerCharacter.overallScore || 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-text-main bg-background">

      {/* ========================================= */}
      {/* 1. BACKGROUND DECORATION (Rich Financial Theme) */}
      {/* ========================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">

        {/* A. Deep Atmospheric Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-[120px] opacity-60" />

        {/* B. Perspective Grid Floor (Cyber-Finance Look) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

        {/* C. Floating Financial Icons (Scattered) */}
        {/* Top Left Cluster */}
        <FloatingElement className="absolute top-[15%] left-[8%] text-emerald-500/20" delay={0} duration={8}>
          <TrendingUp className="w-20 h-20 rotate-[-12deg]" />
        </FloatingElement>
        <FloatingElement className="absolute top-[28%] left-[18%] text-emerald-300/10" delay={1} duration={9}>
          <PieChart className="w-12 h-12" />
        </FloatingElement>

        {/* Bottom Left Cluster */}
        <FloatingElement className="absolute bottom-[20%] left-[10%] text-emerald-400/10" delay={1.5} duration={7}>
          <PiggyBank className="w-24 h-24 rotate-[12deg]" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-[35%] left-[5%] text-blue-400/10" delay={2.5} duration={10}>
          <Calculator className="w-14 h-14 rotate-[-15deg]" />
        </FloatingElement>

        {/* Top Right Cluster */}
        <FloatingElement className="absolute top-[18%] right-[12%] text-gold/10" delay={2} duration={8}>
          <Target className="w-16 h-16" />
        </FloatingElement>
        <FloatingElement className="absolute top-[30%] right-[5%] text-white/5" delay={0.5} duration={11}>
          <Landmark className="w-20 h-20" />
        </FloatingElement>

        {/* Bottom Right Cluster */}
        <FloatingElement className="absolute bottom-[15%] right-[15%] text-blue-500/10" delay={0.5} duration={7}>
          <Wallet className="w-20 h-20 rotate-[-6deg]" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-[25%] right-[25%] text-emerald-200/5" delay={3} duration={9}>
          <CreditCard className="w-16 h-16 rotate-[10deg]" />
        </FloatingElement>

        {/* D. Upward Stream (Bubbles of Wealth) */}
        <RisingSymbol symbol={<DollarSign />} left="20%" delay={0} size={20} />
        <RisingSymbol symbol={<ArrowUp />} left="35%" delay={2} size={16} />
        <RisingSymbol symbol={<Percent />} left="65%" delay={1} size={18} />
        <RisingSymbol symbol={<DollarSign />} left="80%" delay={3} size={24} />
        <RisingSymbol symbol={<ArrowUp />} left="50%" delay={4} size={14} />

      </div>

      {/* ========================================= */}
      {/* 2. MAIN CHARACTER AREA                     */}
      {/* ========================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mb-8 flex flex-col items-center"
      >
        <div className="flex flex-col items-center group cursor-pointer">
          {/* Character Glow Effect */}
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 opacity-0 group-hover:opacity-50 transition-opacity duration-700" />

          {/* Character */}
          <div className="relative drop-shadow-2xl filter z-10 transform group-hover:scale-105 transition-transform duration-500">
            <PlayerCharacterComponent
              character={playerCharacter}
              size="lg"
            />
          </div>

          {/* Points display (Clickable Pill) */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('shop')}
            className="mt-8 flex items-center gap-3 bg-emerald-900/90 hover:bg-emerald-800 px-6 py-2.5 rounded-full border border-emerald-500/30 backdrop-blur-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] z-20"
          >
            <div className="bg-gold/10 p-1.5 rounded-full">
              <Coins className="w-4 h-4 text-gold" />
            </div>
            <span className="text-white font-bold tracking-wide text-lg">
              {score.toLocaleString()}
            </span>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <ShoppingBag className="w-4 h-4 text-emerald-400 opacity-80" />
          </motion.button>
        </div>
      </motion.div>

      {/* ========================================= */}
      {/* 3. TEXT & ACTIONS                          */}
      {/* ========================================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative text-center z-10 w-full max-w-3xl"
      >
        <h1 className="font-display text-5xl md:text-8xl mb-4 font-black tracking-tight text-white drop-shadow-2xl">
          Rags to Riches
        </h1>
        <p className="text-xl md:text-2xl text-emerald-100/60 mb-12 font-medium tracking-wide max-w-lg mx-auto leading-relaxed">
          Master Money Management Skills.
        </p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full px-4"
        >
          {/* Primary CTA */}
          <div className="w-full sm:w-auto min-w-[220px]">
            <GameButton onClick={() => onNavigate('play')} variant="primary" icon={<Play className="w-5 h-5 fill-current" />}>
              Start Game
            </GameButton>
          </div>

          {/* Secondary CTA */}
          <div className="w-full sm:w-auto min-w-[220px]">
            <GameButton onClick={() => onNavigate('leaderboard')} variant="secondary" icon={<Trophy className="w-5 h-5 text-gold" />}>
              Rankings
            </GameButton>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

// 1. Floating Animation Wrapper (Drifting Icons)
const FloatingElement = ({ children, className, delay, duration = 6 }: { children: ReactNode, className?: string, delay: number, duration?: number }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

// 2. Rising Symbol Animation (Bubbles)
const RisingSymbol = ({ symbol, left, delay, size }: { symbol: ReactNode, left: string, delay: number, size: number }) => (
  <motion.div
    className="absolute bottom-[-50px] text-emerald-500/20"
    style={{ left, fontSize: size }}
    animate={{
      y: [-50, -800],
      opacity: [0, 0.5, 0],
      x: [0, Math.random() * 50 - 25] // Slight wobble
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear",
      delay: delay
    }}
  >
    {symbol}
  </motion.div>
);

// 3. Button Component
interface GameButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}
const GameButton = ({ children, onClick, variant, icon }: GameButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={cn(
      'w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl',

      // 1. PRIMARY: Vibrant Mint Green with Glow
      variant === 'primary' && 'bg-primary hover:bg-emerald-400 text-emerald-950 shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:shadow-[0_8px_30px_rgba(52,211,153,0.5)]',

      // 2. SECONDARY: Deep Green with Subtle Border
      variant === 'secondary' && 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-50 border border-emerald-700/50 backdrop-blur-sm'
    )}
  >
    {icon} {children}
  </motion.button>
);