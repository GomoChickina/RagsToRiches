import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from './GameCard';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { VillainCharacter, VillainState } from './VillainCharacter';
import { JourneyTrack } from './JourneyTrack';
import { api } from "@/hooks/Api";
import { getCleanSummary } from '@/utils/gameLogic';

import {
  PlayerCharacter,
  EvilCharacter,
  SituationCard,
  Choice,
  BackendStats
} from '@/types/game';
import { getRandomEvilCharacter } from '@/data/customization';
import { cn } from '@/lib/utils';
import {
  DollarSign,
  PiggyBank,
  Swords,
  Brain,
  TrendingUp,
  Wallet,
  Target,
  PieChart,
  ArrowUp
} from 'lucide-react';
import { toast } from 'sonner';

interface GameBoardProps {
  playerCharacter: PlayerCharacter;
  cards: SituationCard[];
  onGameEnd: (score: number) => void;
}

// ─── Exact replica of RagsToRichesCalculator.java ────────────────────────────────────────────

// Mirrors getSymbolMultiplier() in Java.
// Effect fields arrive from MongoDB as symbol strings: "+", "++", "+++", "-", "--", "---"
// or as a raw numeric string like "1500" for explicit cash (those score 0 for ranking).
function getSymbolMultiplier(value: string | number): number {
  const text = String(value ?? '').trim();
  switch (text) {
    case '+++': return 3;
    case '++': return 2;
    case '+': return 1;
    case '-': return 0;
    case '--': return -1;
    case '---': return -2;
    default: return 0;
  }
}

// Mirrors the totalScore formula: (8 * pflMult) + (4 * hapMult) + (6 * monMult)
function optionScore(option: SituationCard['options'][number]): number {
  const pflMult = getSymbolMultiplier(option.effect.financeKnowledge);
  const hapMult = getSymbolMultiplier(option.effect.happiness);
  const monMult = getSymbolMultiplier(option.effect.money);
  return (8 * pflMult) + (4 * hapMult) + (6 * monMult);
}

// Returns the index of the best and worst options for the active card.
function getBestAndWorstIndex(options: SituationCard['options']): { bestIndex: number; worstIndex: number } {
  const scores = options.map(optionScore);
  const bestIndex = scores.indexOf(Math.max(...scores));
  const worstIndex = scores.indexOf(Math.min(...scores));
  return { bestIndex, worstIndex };
}


export const GameBoard = ({ playerCharacter, cards, onGameEnd }: GameBoardProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [stats, setStats] = useState<BackendStats>(playerCharacter.stats);
  const [currentScore, setCurrentScore] = useState<number>(playerCharacter.overallScore || 0);

  const [gameOver, setGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [playerReaction, setPlayerReaction] = useState<'neutral' | 'happy' | 'thinking' | 'sad'>('neutral');
  const [evilCharacter, setEvilCharacter] = useState<EvilCharacter | null>(null);
  const [evilHealth, setEvilHealth] = useState(100);
  const [evilMaxHealth] = useState(100);
  const [isEvilAttacking, setIsEvilAttacking] = useState(false);
  const [damageDealt, setDamageDealt] = useState<number | undefined>(undefined);
  const [battleMessage, setBattleMessage] = useState<string>('');

  useEffect(() => {
    const evil = getRandomEvilCharacter();
    setEvilCharacter(evil);
    setEvilHealth(evil.power);
  }, []);

  const getVillainState = (): VillainState => {
    if (isEvilAttacking) return 'laughing';
    if (damageDealt && damageDealt > 0) return 'scared';
    return 'idle';
  };

  const activeCard = cards[currentCardIndex];

  const handleChoice = async (choice: Choice, choiceIndex: number) => {
    if (gameOver || isProcessing) return;
    setIsProcessing(true);
    setPlayerReaction('thinking');

    // ── Determine best/worst BEFORE the API call, using local effect data ──
    const { bestIndex, worstIndex } = getBestAndWorstIndex(activeCard.options);
    const isAbsoluteBest = choiceIndex === bestIndex;
    const isAbsoluteWorst = choiceIndex === worstIndex;

    try {
      const updatedUser = await api.makeChoice(playerCharacter.id, activeCard.situationId, choiceIndex);
      if (!updatedUser) throw new Error("Failed to process turn");

      const newScore = updatedUser.overallScore;
      const scoreDelta = newScore - currentScore;

      setStats(updatedUser.stats);
      setCurrentScore(newScore);

      const playSoundEffect = (type: 'hero' | 'villain') => {
        const audio = new Audio(type === 'hero' ? '/sounds/hero.mp3' : '/sounds/villain.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => { });
      };

      if (isAbsoluteBest) {
        // ── BEST choice: hero victory dance, villain cowers ──────────────
        setIsEvilAttacking(false);
        playSoundEffect('hero');
        setPlayerReaction('happy');
        const damage = Math.min(scoreDelta * 2, 30);
        setDamageDealt(damage);
        setEvilHealth(prev => Math.max(0, prev - damage));
        setBattleMessage('🏆 Perfect Choice!');
        setTimeout(() => { setPlayerReaction('neutral'); setDamageDealt(undefined); }, 2500);

      } else if (isAbsoluteWorst) {
        // ── WORST choice: villain laughs, hero looks sad ─────────────────
        setIsEvilAttacking(true);
        playSoundEffect('villain');
        setPlayerReaction('sad');
        setBattleMessage(`😈 ${evilCharacter?.name} laughs at your mistake!`);
        setTimeout(() => { setIsEvilAttacking(false); setPlayerReaction('neutral'); }, 2500);

      } else {
        // ── Middle choice: no dancing, just a gentle positive/negative cue ──
        setIsEvilAttacking(false);
        setPlayerReaction(scoreDelta >= 0 ? 'neutral' : 'sad');
        setBattleMessage(scoreDelta >= 0 ? '👍 Decent choice.' : '😬 Could be better...');
        setTimeout(() => { setPlayerReaction('neutral'); }, 2500);
      }

      setTimeout(() => {
        setDamageDealt(undefined);
        setBattleMessage('');
        setIsProcessing(false);
        if (currentCardIndex + 1 < cards.length) {
          setCurrentCardIndex(prev => prev + 1);
        } else {
          finishGame(newScore);
        }
      }, 2500);

    } catch (error) {
      console.error("Turn failed", error);
      toast.error("Server Error: Could not process choice");
      setIsProcessing(false);
    }
  };

  const finishGame = (finalScore: number) => {
    setGameOver(true);
    setTimeout(() => onGameEnd(finalScore), 2500);
  };

  if (!activeCard && !gameOver) return <div className="p-10 text-center text-white">Loading Situations...</div>;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden font-sans">

      {/* ── BACKGROUND DECORATION ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-[120px] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <FloatingElement className="absolute top-[10%] left-[5%] text-emerald-500/10" delay={0} duration={8}><TrendingUp className="w-16 h-16 rotate-[-12deg]" /></FloatingElement>
        <FloatingElement className="absolute top-[28%] left-[18%] text-emerald-300/10" delay={1} duration={9}><PieChart className="w-12 h-12" /></FloatingElement>
        <FloatingElement className="absolute bottom-[20%] left-[8%] text-emerald-400/10" delay={1.5} duration={7}><PiggyBank className="w-14 h-14 rotate-[12deg]" /></FloatingElement>
        <FloatingElement className="absolute top-[15%] right-[8%] text-gold/10" delay={2} duration={8}><Target className="w-12 h-12" /></FloatingElement>
        <FloatingElement className="absolute bottom-[25%] right-[10%] text-blue-400/10" delay={0.5} duration={7}><Wallet className="w-16 h-16 rotate-[-6deg]" /></FloatingElement>
        <RisingSymbol symbol={<DollarSign />} left="10%" delay={0} size={18} />
        <RisingSymbol symbol={<ArrowUp />} left="90%" delay={2} size={14} />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto p-4 pb-24">

        <JourneyTrack
          currentRound={currentCardIndex}
          totalRounds={cards.length}
          character={playerCharacter}
        />

        {/* HEADER */}
        <motion.div className="flex justify-between items-start mb-6 px-4 pt-2 relative">
          <div className="drop-shadow-2xl">
            <PlayerCharacterComponent character={playerCharacter} reaction={playerReaction} />
          </div>

          <div className="mt-4 flex flex-col items-center z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 bg-primary hover:bg-emerald-400 text-emerald-950 px-5 py-2 rounded-full shadow-[0_4px_20px_rgba(52,211,153,0.3)] border border-primary/50"
            >
              <Swords className="w-4 h-4" />
              <span className="font-bold text-xs tracking-wide">ROUND {currentCardIndex + 1}/{cards.length}</span>
            </motion.div>

            <AnimatePresence mode="wait">
              {battleMessage && (
                <motion.span
                  key={battleMessage}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-sm font-bold text-white bg-emerald-900/90 px-4 py-2 rounded-xl shadow-xl border border-white/10"
                >
                  {battleMessage}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {evilCharacter && (
            <div className="flex-shrink-0 drop-shadow-2xl">
              <VillainCharacter character={evilCharacter} state={getVillainState()} health={evilHealth} maxHealth={evilMaxHealth} damage={damageDealt} />
            </div>
          )}
        </motion.div>

        {/* STATS */}
        <div className="flex justify-center gap-4 mb-8">
          <StatCard icon={<DollarSign className="w-4 h-4" />} label="Money" value={`$${stats.money}`} color={stats.money > 0 ? 'text-emerald-400' : 'text-red-400'} />
          <StatCard icon={<Brain className="w-4 h-4" />} label="Knowledge" value={`${stats.financeKnowledge}`} color="text-blue-400" />
          <StatCard icon={<PiggyBank className="w-4 h-4" />} label="Happy" value={`${stats.happiness}`} color="text-yellow-400" />
        </div>

        {/* CARD AREA */}
        {!gameOver && activeCard && (
          <div className="flex-1 flex flex-col items-center justify-start w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              key={String(activeCard.situationId)}
              className="mb-6 text-center max-w-3xl w-full bg-emerald-950/60 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl"
            >
              <h2 className="font-display text-xl md:text-2xl leading-relaxed text-white drop-shadow-md">
                &quot;{activeCard.scenario}&quot;
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl perspective-1000">
              <AnimatePresence mode="wait">
                {activeCard.options.map((choice, idx) => (
                  <motion.div
                    key={`choice-${idx}`}
                    className="h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <GameCard
                      choice={choice}
                      index={idx}
                      onClick={(c) => handleChoice(c, idx)}
                      disabled={isProcessing}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* GAME OVER */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center p-12 bg-emerald-900/50 rounded-3xl border border-emerald-500/30 shadow-2xl">
              <h1 className="text-5xl font-black mb-6 text-white">Game Complete!</h1>
              <p className="text-2xl text-emerald-200 mb-8">Final Score: <span className="text-gold font-bold">{currentScore}</span></p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-emerald-400 text-emerald-950 px-10 py-4 rounded-full font-bold text-xl shadow-[0_4px_20px_rgba(52,211,153,0.4)] transition-all transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── HELPER COMPONENTS ────────────────────────────────────────────────────────

interface StatCardProps { icon: React.ReactNode; label: string; value: string | number; color: string; }
const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-900/80 border border-white/5 shadow-lg backdrop-blur-sm min-w-[140px] justify-center transition-transform hover:scale-105">
    <div className={cn('p-2 rounded-lg bg-black/30', color)}>{icon}</div>
    <div className="flex flex-col text-left">
      <span className="text-[10px] text-emerald-200/60 font-bold uppercase tracking-widest">{label}</span>
      <span className={cn("font-bold text-lg leading-tight", color)}>{value}</span>
    </div>
  </div>
);

const FloatingElement = ({ children, className, delay, duration = 6 }: { children: React.ReactNode, className?: string, delay: number, duration?: number }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {children}
  </motion.div>
);

const RisingSymbol = ({ symbol, left, delay, size }: { symbol: React.ReactNode, left: string, delay: number, size: number }) => (
  <motion.div
    className="absolute bottom-[-50px] text-emerald-500/20"
    style={{ left, fontSize: size }}
    animate={{ y: [-50, -800], opacity: [0, 0.5, 0], x: [0, Math.random() * 50 - 25] }}
    transition={{ duration: 15, repeat: Infinity, ease: "linear", delay }}
  >
    {symbol}
  </motion.div>
);
