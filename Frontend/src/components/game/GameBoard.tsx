import React, { ReactNode, useState, useEffect, useRef } from 'react';
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
  const [hasAskedCoach, setHasAskedCoach] = useState(false);
  const [lastChoiceContext, setLastChoiceContext] = useState<{ situationTitle: string; choiceText: string; impact: string; quality: string } | null>(null);
  const [autoExplainCoach, setAutoExplainCoach] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [playerReaction, setPlayerReaction] = useState<'neutral' | 'happy' | 'thinking' | 'sad'>('neutral');
  const [evilCharacter, setEvilCharacter] = useState<EvilCharacter | null>(null);
  const [evilHealth, setEvilHealth] = useState(100);
  const [evilMaxHealth] = useState(100);
  const [isEvilAttacking, setIsEvilAttacking] = useState(false);
  const [damageDealt, setDamageDealt] = useState<number | undefined>(undefined);
  const [_battleMessage, setBattleMessage] = useState<string>('');

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
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setIsProcessing(false); setHasAskedCoach(true);
  };

  const handleChoice = async (choice: Choice, choiceIndex: number) => {
    if (gameOver || isProcessing) return;
    setIsProcessing(true);
    setPlayerReaction('thinking');

    const { bestIndex, worstIndex } = getBestAndWorstIndex(activeCard.options);
    const isBestChoice = choiceIndex === bestIndex;
    const isWorstChoice = choiceIndex === worstIndex;
    const isMiddleChoice = !isBestChoice && !isWorstChoice;
    const quality = isBestChoice ? 'best' : isWorstChoice ? 'worst' : 'ok';

    try {
      const updatedUser = await api.makeChoice(playerCharacter.id, activeCard.situationId, choiceIndex);
      if (!updatedUser) throw new Error("Failed to process turn");

      setStats(updatedUser.stats);
      setCurrentScore(updatedUser.overallScore);

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

      setTimeout(() => {
        setIsEvilAttacking(false);
        setDamageDealt(undefined);
        setPlayerReaction('neutral');
      }, 2000);

      // 1) BEST choice => no coach shown
      if (isBestChoice) {
        setLastChoiceContext(null);
        setAutoExplainCoach(false);
        timerRef.current = setTimeout(() => {
          setIsProcessing(false);
          setBattleMessage('');
          advanceGame();
        }, 3000);
        return;
      }

      // 2) WORST choice => auto trigger coach (manual continue after explanation)
      if (isWorstChoice) {
        setLastChoiceContext({
          situationTitle: activeCard.scenario,
          choiceText: choice.text,
          impact: choice.impactDescription || "Processed turn",
          quality,
        });
        setAutoExplainCoach(true);
        setIsProcessing(false);
        return;
      }

      // 3) MIDDLE choice => optional ask coach for 3s, then auto-advance
      if (isMiddleChoice) {
        setLastChoiceContext({
          situationTitle: activeCard.scenario,
          choiceText: choice.text,
          impact: choice.impactDescription || "Processed turn",
          quality,
        });
        setAutoExplainCoach(false);
        timerRef.current = setTimeout(() => {
          setIsProcessing(false);
          setBattleMessage('');
          advanceGame();
        }, 3000);
      }

    } catch (error) {
      console.error("Turn failed", error);
      setLastChoiceContext(null);
      setAutoExplainCoach(false);
      setIsProcessing(false);
    }
  };

  const finishGame = (finalScore: number) => {
    setGameOver(true);
    setTimeout(() => onGameEnd(finalScore), 2500);
  };

  if (!activeCard && !gameOver) return <div className="p-10 text-center text-white">Loading Journey...</div>;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-x-hidden font-sans">
      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto p-2 sm:p-4 pb-28 sm:pb-24">

        {/* --- JOURNEY TRACK SECTION --- */}
        {/* Fix: Added pt-6 to ensure the character face isn't clipped at the top */}
        <div className="relative w-full rounded-3xl bg-emerald-950/40 border border-white/5 mb-4 shadow-inner pt-6 pb-2">
          <div className="scale-95 sm:scale-100 origin-center transition-transform overflow-visible">
            <JourneyTrack currentRound={currentCardIndex} totalRounds={cards.length} character={playerCharacter} />
          </div>
        </div>

        {/* --- BATTLE / CHARACTER SECTION --- */}
        {/* Fix: Character Centering & Size Equality */}
        <div className="grid grid-cols-[minmax(0,120px)_auto_minmax(0,120px)] sm:grid-cols-[1fr_auto_1fr] items-center justify-center mb-4 sm:mb-6 px-1 sm:px-4 gap-1 relative min-h-[130px] sm:min-h-[200px] w-full">

          {/* Player Stage */}
          <div className="w-full flex justify-center items-center mx-auto">
            <div className="scale-75 sm:scale-100 origin-center">
              <PlayerCharacterComponent character={playerCharacter} reaction={playerReaction} />
            </div>
          </div>

          {/* Round Counter (Absolute center for stability) */}
          <div className="flex flex-col items-center z-10 shrink-0 px-2">
            <div className="bg-primary text-emerald-950 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-black text-[10px] sm:text-xs border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] whitespace-nowrap">
              ROUND {currentCardIndex + 1}/{cards.length}
            </div>
          </div>

          {/* Villain Stage */}
          <div className="w-full flex justify-center items-center mx-auto">
            <div className="scale-75 sm:scale-100 origin-center">
              {evilCharacter && (
                <VillainCharacter
                  character={evilCharacter}
                  state={getVillainState()}
                  health={evilHealth}
                  maxHealth={evilMaxHealth}
                  damage={damageDealt}
                />
              )}
            </div>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:gap-4 mb-6 sm:mb-8">
          <StatCard icon={<DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} label="Money" value={`$${stats.money}`} color={stats.money > 0 ? 'text-emerald-400' : 'text-red-400'} />
          <StatCard icon={<Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} label="Knowledge" value={`${stats.financeKnowledge}`} color="text-blue-400" />
          <StatCard icon={<PiggyBank className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} label="Happy" value={`${stats.happiness}`} color="text-yellow-400" />
        </div>

        {/* --- SITUATION / CHOICES --- */}
        {!gameOver && activeCard && (
          <div className="flex-1 flex flex-col items-center justify-start w-full">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} key={currentCardIndex} className="mb-6 text-center max-w-3xl w-full bg-emerald-950/60 p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
              <h2 className="font-display text-lg md:text-2xl leading-relaxed text-white drop-shadow-md px-2">
                &quot;{activeCard.scenario}&quot;
              </h2>
            </motion.div>

            {(lastChoiceContext || hasAskedCoach) && (
              <div className="flex flex-col items-center gap-4 sm:gap-6 w-full mb-4 px-2">
                {lastChoiceContext && (
                  <GeminiCoach context={lastChoiceContext} onAsked={onAskCoach} autoExplain={autoExplainCoach} />
                )}
                {hasAskedCoach && (
                  <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={advanceGame} className="w-full max-w-xs sm:max-w-none sm:w-auto bg-primary hover:bg-emerald-400 text-emerald-950 font-bold py-3 px-6 sm:px-12 rounded-full shadow-[0_4px_20px_rgba(52,211,153,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                    Continue Journey <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            <AnimatePresence>
              {!lastChoiceContext && (
                <motion.div exit={{ opacity: 0, y: 20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-6xl">
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

const StatCard = ({ icon, label, value, color }: { icon: ReactNode, label: string, value: string | number, color: string }) => (
  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-2 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-emerald-900/80 border border-white/5 min-w-0 sm:min-w-[140px] justify-center shadow-lg transition-transform overflow-hidden">
    <div className={cn('p-1.5 sm:p-2 rounded-lg bg-black/30', color)}>{icon}</div>
    <div className="flex flex-col text-center sm:text-left overflow-hidden w-full">
      <span className="text-[10px] sm:text-[11px] text-emerald-200/60 font-bold uppercase tracking-wider truncate">{label}</span>
      <span className={cn("font-bold text-base sm:text-lg leading-tight truncate", color)}>{value}</span>
    </div>
  </div>
);