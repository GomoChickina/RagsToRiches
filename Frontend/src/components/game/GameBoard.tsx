import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from './GameCard';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { VillainCharacter, VillainState } from './VillainCharacter';
import { JourneyTrack } from './JourneyTrack';
import { api } from "@/hooks/Api";

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
  Brain,
  ArrowRight
} from 'lucide-react';
import { GeminiCoach } from './GeminiCoach';

interface GameBoardProps {
  playerCharacter: PlayerCharacter;
  cards: SituationCard[];
  onGameEnd: (score: number) => void;
}

// ─── Utility Ranking Logic ────────────────────────────────────────────────────────────

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

function optionScore(option: SituationCard['options'][number]): number {
  const pflMult = getSymbolMultiplier(option.effect.financeKnowledge);
  const hapMult = getSymbolMultiplier(option.effect.happiness);
  const monMult = getSymbolMultiplier(option.effect.money);
  return (8 * pflMult) + (4 * hapMult) + (6 * monMult);
}

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

  // ── NEW LOGIC ──
  const [hasAskedCoach, setHasAskedCoach] = useState(false);
  const [lastChoiceContext, setLastChoiceContext] = useState<{ situationTitle: string; choiceText: string; impact: string; quality: string } | null>(null);
  const [autoExplainCoach, setAutoExplainCoach] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reaction & Battle States
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

  const advanceGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsProcessing(false);
    setLastChoiceContext(null);
    setHasAskedCoach(false);
    setAutoExplainCoach(false);
    setPlayerReaction('neutral');

    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      finishGame(currentScore);
    }
  };

  const onAskCoach = () => {
    // 🛑 KILL THE TIMER: Player wants to read!
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Re-enable future choices; options are already hidden for this round
    setIsProcessing(false);
    setHasAskedCoach(true);
  };

  const handleChoice = async (choice: Choice, choiceIndex: number) => {
    if (gameOver || isProcessing) return;
    setIsProcessing(true);
    setPlayerReaction('thinking');

    const { bestIndex, worstIndex } = getBestAndWorstIndex(activeCard.options);
    const isBestChoice = choiceIndex === bestIndex;
    const isWorstChoice = choiceIndex === worstIndex;
    const quality = isBestChoice ? 'best' : isWorstChoice ? 'worst' : 'ok';

    // Setup the context so the user CAN click the button (or auto-ask) after the choice
    setLastChoiceContext({
      situationTitle: activeCard.scenario,
      choiceText: choice.text,
      impact: choice.impactDescription || "Processed turn",
      quality,
    });
    setAutoExplainCoach(isWorstChoice);

    try {
      const updatedUser = await api.makeChoice(playerCharacter.id, activeCard.situationId, choiceIndex);
      if (!updatedUser) throw new Error("Failed to process turn");

      setStats(updatedUser.stats);
      setCurrentScore(updatedUser.overallScore);

      // Battle Logic
      if (choiceIndex === bestIndex) {
        setPlayerReaction('happy');
        const damage = Math.min((updatedUser.overallScore - currentScore) * 2, 30);
        setDamageDealt(damage);
        setEvilHealth(prev => Math.max(0, prev - damage));
        setBattleMessage('🏆 Perfect Choice!');
      } else if (choiceIndex === worstIndex) {
        setIsEvilAttacking(true);
        setPlayerReaction('sad');
        setBattleMessage(`😈 Oh no! ${evilCharacter?.name} is gaining power!`);
      } else {
        setBattleMessage('👍 Decent choice.');
      }

      // Stop villain/character "dancing" after 2 seconds
      setTimeout(() => {
        setIsEvilAttacking(false);
        setDamageDealt(undefined);
        setPlayerReaction('neutral');
      }, 2000);

      // If it's NOT the worst choice, start the 3-second auto-advance window
      if (!isWorstChoice) {
        timerRef.current = setTimeout(() => {
          setIsProcessing(false);
          setBattleMessage('');
          setIsEvilAttacking(false);
          setDamageDealt(undefined);

          // AUTO ADVANCE: Only happens if they didn't click "Ask Coach"
          advanceGame();
        }, 3000);
      } else {
        // For worst choices, let the villain dance and the coach auto-explain,
        // but keep the player in control of when to continue.
        setIsProcessing(false);
      }

    } catch (error) {
      console.error("Turn failed", error);
      setIsProcessing(false);
    }
  };

  const finishGame = (finalScore: number) => {
    setGameOver(true);
    setTimeout(() => onGameEnd(finalScore), 2500);
  };

  if (!activeCard && !gameOver) return <div className="p-10 text-center text-white font-display">Loading Journey...</div>;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden font-sans">
      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto p-4 pb-24">

        <JourneyTrack currentRound={currentCardIndex} totalRounds={cards.length} character={playerCharacter} />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 px-4 pt-2">
          <PlayerCharacterComponent character={playerCharacter} reaction={playerReaction} />

          <div className="flex flex-col items-center">
            <div className="bg-primary text-emerald-950 px-5 py-2 rounded-full font-bold text-xs border border-primary/50 shadow-lg">
              ROUND {currentCardIndex + 1}/{cards.length}
            </div>
            {battleMessage && (
              <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm font-bold text-white bg-emerald-900/90 px-4 py-2 rounded-xl border border-white/10 shadow-xl">
                {battleMessage}
              </motion.span>
            )}
          </div>

          {evilCharacter && (
            <VillainCharacter character={evilCharacter} state={getVillainState()} health={evilHealth} maxHealth={evilMaxHealth} damage={damageDealt} />
          )}
        </div>

        {/* STATS */}
        <div className="flex justify-center gap-4 mb-8">
          <StatCard icon={<DollarSign className="w-4 h-4" />} label="Money" value={`$${stats.money}`} color={stats.money > 0 ? 'text-emerald-400' : 'text-red-400'} />
          <StatCard icon={<Brain className="w-4 h-4" />} label="Knowledge" value={`${stats.financeKnowledge}`} color="text-blue-400" />
          <StatCard icon={<PiggyBank className="w-4 h-4" />} label="Happy" value={`${stats.happiness}`} color="text-yellow-400" />
        </div>

        {/* GAMEPLAY */}
        {!gameOver && activeCard && (
          <div className="flex-1 flex flex-col items-center justify-start w-full">
            {/* 1. RESTORED ORIGINAL SCENARIO LAYOUT */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} key={currentCardIndex} className="mb-6 text-center max-w-3xl w-full bg-emerald-950/60 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
              <h2 className="font-display text-xl md:text-2xl leading-relaxed text-white drop-shadow-md">
                &quot;{activeCard.scenario}&quot;
              </h2>
            </motion.div>

            {/* 2. SIDE-CAR COACH: Appearing after choice */}
            {(lastChoiceContext || hasAskedCoach) && (
              <div className="flex flex-col items-center gap-6 w-full mb-4">
                {lastChoiceContext && (
                  <GeminiCoach
                    context={lastChoiceContext}
                    onAsked={onAskCoach}
                    autoExplain={autoExplainCoach}
                  />
                )}

                {/* Manual Continue: Only visible if Coach was invoked */}
                {hasAskedCoach && (
                  <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={advanceGame} className="bg-primary hover:bg-emerald-400 text-emerald-950 font-bold py-3 px-12 rounded-full shadow-[0_4px_20px_rgba(52,211,153,0.4)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                    Continue Journey <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {/* OPTIONS: Hide after choice to focus on bot/timer */}
            <AnimatePresence>
              {!lastChoiceContext && (
                <motion.div exit={{ opacity: 0, y: 20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
                  {activeCard.options.map((choice, idx) => (
                    <GameCard key={idx} choice={choice} index={idx} onClick={(c) => handleChoice(c, idx)} disabled={isProcessing} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

// STAT CARD
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-900/80 border border-white/5 min-w-[140px] justify-center shadow-lg transition-transform hover:scale-105">
    <div className={cn('p-2 rounded-lg bg-black/30', color)}>{icon}</div>
    <div className="flex flex-col text-left">
      <span className="text-[10px] text-emerald-200/60 font-bold uppercase tracking-widest">{label}</span>
      <span className={cn("font-bold text-lg leading-tight", color)}>{value}</span>
    </div>
  </div>
);